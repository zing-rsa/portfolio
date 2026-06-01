"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/db/schema";
import { Button } from "@/components/ui";
import { ProjectForm } from "./ProjectForm";

interface AdminDashboardProps {
  initialProjects: Project[];
  adminEmail: string;
}

type Editing =
  | { mode: "none" }
  | { mode: "create" }
  | { mode: "edit"; project: Project };

export function AdminDashboard({
  initialProjects,
  adminEmail,
}: AdminDashboardProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [editing, setEditing] = useState<Editing>({ mode: "none" });
  const [busyId, setBusyId] = useState<string | null>(null);

  function upsert(saved: Project) {
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      const next = exists
        ? prev.map((p) => (p.id === saved.id ? saved : p))
        : [...prev, saved];
      return next.sort((a, b) => b.startDate.localeCompare(a.startDate));
    });
    setEditing({ mode: "none" });
  }

  async function remove(project: Project) {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) {
      return;
    }
    setBusyId(project.id);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
    } catch {
      window.alert("Delete failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="mx-auto w-full max-w-content px-6 py-12 sm:px-8">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink-muted">
            <span className="text-ink-faint">$</span> ~/admin
          </p>
          <h1 className="mt-1 text-2xl font-bold">projects</h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-ink-muted">{adminEmail}</span>
          <Button variant="ghost" onClick={logout}>
            logout
          </Button>
        </div>
      </header>

      {editing.mode === "none" ? (
        <div className="mb-8">
          <Button variant="solid" onClick={() => setEditing({ mode: "create" })}>
            + new project
          </Button>
        </div>
      ) : (
        <div className="mb-8">
          <ProjectForm
            project={editing.mode === "edit" ? editing.project : null}
            onSaved={upsert}
            onCancel={() => setEditing({ mode: "none" })}
          />
        </div>
      )}

      <ul className="divide-y divide-ink-muted/30 border-y border-ink-muted/30">
        {projects.length === 0 ? (
          <li className="py-6 text-sm text-ink-muted">No projects yet.</li>
        ) : (
          projects.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 py-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-ink-faint">
                  <span>{p.type}</span>
                  <span aria-hidden>·</span>
                  <span className="tabular-nums">{p.startDate}</span>
                </div>
                <p className="truncate text-sm font-bold">{p.title}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditing({ mode: "edit", project: p })}
                >
                  edit
                </Button>
                <Button
                  variant="ghost"
                  disabled={busyId === p.id}
                  onClick={() => remove(p)}
                >
                  {busyId === p.id ? "…" : "delete"}
                </Button>
              </div>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
