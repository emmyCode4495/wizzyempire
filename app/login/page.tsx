import { AuthForm } from "@/components/auth-form";

export const metadata = { title: "Log in — LUME" };

export default function LoginPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-center font-display text-3xl">Welcome back</h1>
        <p className="mb-8 text-center text-sm text-ink-400">
          Log in to view your orders and saved bag.
        </p>
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
