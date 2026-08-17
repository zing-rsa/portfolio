"use client";

import { useState } from "react";
import type { Project, Technology } from "@/lib/db/schema";
import { Button, Field, Input, inputClass } from "@/components/ui";
import { TechnologiesEditor } from "./TechnologiesEditor";

interface ProjectFormProps {
  project?: Project | null;
  onSaved: (project: Project) => void;
  onCancel: () => void;
}

type ProjectType = "professional" | "personal";

/**
 * Create/edit form for a project. One form handles both timeline variants;
 * professional vs personal fields are shown based on the selected type.
 * Technologies are entered one per line as `Name, icon-slug`.
 */
export function ProjectForm({ project, onSaved, onCancel }: ProjectFormProps) {
  const [type, setType] = useState<ProjectType>(project?.type ?? "professional");
  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [startDate, setStartDate] = useState(project?.startDate ?? "");
  const [endDate, setEndDate] = useState(project?.endDate ?? "");
  const [technologies, setTechnologies] = useState<Technology[]>(
    project?.technologies ?? [],
  );
  const [organization, setOrganization] = useState(project?.organization ?? "");
  const [organizationIcon, setOrganizationIcon] = useState(
    project?.organizationIcon ?? "",
  );
  const [role, setRole] = useState(project?.role ?? "");
  const [imageUrl, setImageUrl] = useState(project?.imageUrl ?? "");
  const [link, setLink] = useState(project?.link ?? "");
  const [githubLink, setGithubLink] = useState(project?.githubLink ?? "");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      type,
      title,
      description,
      startDate,
      endDate: endDate || null,
      technologies: technologies.filter((t) => t.name.trim()),
      organization,
      organizationIcon,
      role,
      imageUrl,
      link,
      githubLink,
    };

    try {
      const res = await fetch(
        project ? `/api/projects/${project.id}` : "/api/projects",
        {
          method: project ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "save failed");
      onSaved(data as Project);
    } catch (err) {
      setError(err instanceof Error ? err.message : "save failed");
    } finally {
      setSaving(false);
    }
  }

  const isPro = type === "professional";

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 border border-ink p-5"
    >
      <h3 className="text-sm font-bold uppercase tracking-widest">
        {project ? "edit project" : "new project"}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="type">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ProjectType)}
            className={inputClass}
          >
            <option value="professional">professional</option>
            <option value="personal">personal</option>
          </select>
        </Field>

        <Field label="title">
          <Input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
      </div>

      <Field label="description">
        <textarea
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="start date (YYYY-MM-DD)">
          <Input
            required
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Field>
        <Field label="end date (blank = present)">
          <Input
            type="date"
            value={endDate ?? ""}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Field>
      </div>

      {isPro ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="organization">
            <Input
              value={organization ?? ""}
              onChange={(e) => setOrganization(e.target.value)}
            />
          </Field>
          <Field label="org icon slug">
            <Input
              value={organizationIcon ?? ""}
              onChange={(e) => setOrganizationIcon(e.target.value)}
            />
          </Field>
          <Field label="role">
            <Input
              value={role ?? ""}
              onChange={(e) => setRole(e.target.value)}
            />
          </Field>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="image url">
            <Input
              value={imageUrl ?? ""}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </Field>
          <Field label="live link">
            <Input
              value={link ?? ""}
              onChange={(e) => setLink(e.target.value)}
            />
          </Field>
          <Field label="github link">
            <Input
              value={githubLink ?? ""}
              onChange={(e) => setGithubLink(e.target.value)}
            />
          </Field>
        </div>
      )}

      <TechnologiesEditor value={technologies} onChange={setTechnologies} />

      {error ? <p className="text-sm text-ink">⚠ {error}</p> : null}

      <div className="flex gap-3">
        <Button type="submit" variant="solid" disabled={saving}>
          {saving ? "saving…" : project ? "save changes" : "create"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          cancel
        </Button>
      </div>
    </form>
  );
}
