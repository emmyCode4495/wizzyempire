"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }
    toast.success("You're on the list.");
    setEmail("");
  }

  return (
    <form onSubmit={submit} className="flex max-w-xs border-b border-ink/30">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-ink-400"
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className="focus-ring flex items-center px-1 text-ink hover:text-ink-600"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
