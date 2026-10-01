import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { AdminSidebar } from "@/components/admin/sidebar";

export const metadata: Metadata = {
  title: "Admin — Wizzy Empire",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  // Full-viewport shell so store header/footer from root layout are covered
  return (
    <div className="fixed inset-0 z-[100] flex overflow-hidden bg-ink-50">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
