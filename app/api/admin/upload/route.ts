import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/admin";

const BUCKET = "product-images";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const service = createServiceClient();
  if (!service) {
    return NextResponse.json(
      {
        error:
          "Server storage is not configured (missing SUPABASE_SERVICE_ROLE_KEY)",
      },
      { status: 500 }
    );
  }

  // Ensure public bucket exists (idempotent)
  const { data: buckets } = await service.storage.listBuckets();
  if (!buckets?.some((b) => b.name === BUCKET)) {
    await service.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: MAX_BYTES,
      allowedMimeTypes: Array.from(ALLOWED),
    });
  }

  const form = await request.formData();
  const files = form.getAll("files").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const urls: string[] = [];
  const errors: string[] = [];

  for (const file of files) {
    if (!ALLOWED.has(file.type)) {
      errors.push(`${file.name}: unsupported type (${file.type || "unknown"})`);
      continue;
    }
    if (file.size > MAX_BYTES) {
      errors.push(`${file.name}: exceeds 5 MB`);
      continue;
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await service.storage.from(BUCKET).upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      errors.push(`${file.name}: ${error.message}`);
      continue;
    }

    const { data } = service.storage.from(BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  if (urls.length === 0) {
    return NextResponse.json(
      { error: errors.join("; ") || "Upload failed" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    urls,
    errors: errors.length ? errors : undefined,
  });
}