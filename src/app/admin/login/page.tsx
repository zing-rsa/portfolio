"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Field, Input } from "@/components/ui";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "login failed");
      }
      const from = params.get("from");
      router.replace(from && from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-6">
      <p className="mb-6 text-sm text-ink-muted">
        <span className="text-ink-faint">$</span> ./login
      </p>
      <h1 className="mb-8 text-2xl font-bold">backoffice</h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field label="email">
          <Input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field label="password">
          <Input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        {error ? <p className="text-sm text-ink">⚠ {error}</p> : null}

        <Button type="submit" variant="solid" disabled={loading}>
          {loading ? "…" : "sign in"}
        </Button>
      </form>
    </main>
  );
}
