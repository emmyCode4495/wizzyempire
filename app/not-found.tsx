import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-8xl italic">404</p>
      <h1 className="mt-4 text-xl">This page has been discontinued.</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-400">
        The page you're looking for doesn't exist, or has moved.
      </p>
      <Link href="/" className="mt-6">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
