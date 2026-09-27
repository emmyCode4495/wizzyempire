"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProfileForm({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) {
  const [name, setName] = useState(fullName);
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", data.user.id);

    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile updated");
  }

  return (
    <form onSubmit={save} className="flex max-w-sm flex-col gap-4">
      <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="Email" value={email} disabled />
      <Button type="submit" disabled={saving} className="self-start">
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
