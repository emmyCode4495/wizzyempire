import { AuthForm } from "@/components/auth-form";

export const metadata = { title: "Create account — LUME" };

export default function SignupPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-center font-display text-3xl">Create an account</h1>
        <p className="mb-8 text-center text-sm text-ink-400">
          Save your bag, track orders and check out faster.
        </p>
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
