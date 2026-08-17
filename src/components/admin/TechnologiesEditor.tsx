"use client";

import type { Technology } from "@/lib/db/schema";
import { Button, Input } from "@/components/ui";

interface TechnologiesEditorProps {
  value: Technology[];
  onChange: (technologies: Technology[]) => void;
}

/**
 * Structured editor for a project's technologies. Each row is a display name
 * plus an optional simple-icons slug. The icon glyph and colour are resolved
 * entirely in code (simple-icons, with any customisation defined once in
 * `src/lib/icon-overrides.ts`) — there is no per-project icon customisation
 * here. If a slug has no match, the badge falls back to a placeholder square;
 * add or alias it in `icon-overrides.ts` to fix it everywhere at once.
 */
export function TechnologiesEditor({
  value,
  onChange,
}: TechnologiesEditorProps) {
  const update = (i: number, patch: Partial<Technology>) =>
    onChange(value.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  const remove = (i: number) =>
    onChange(value.filter((_, idx) => idx !== i));
  const add = () => onChange([...value, { name: "" }]);

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm text-ink-muted">technologies</span>

      {value.length === 0 ? (
        <p className="text-xs text-ink-faint">No technologies yet.</p>
      ) : null}

      <ul className="flex flex-col gap-2">
        {value.map((t, i) => (
          <li
            key={i}
            className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
          >
            <Input
              placeholder="Name (e.g. TypeScript)"
              value={t.name}
              onChange={(e) => update(i, { name: e.target.value })}
            />
            <Input
              placeholder="simple-icons slug (e.g. typescript)"
              value={t.icon ?? ""}
              onChange={(e) => update(i, { icon: e.target.value || undefined })}
              className="font-mono"
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => remove(i)}
              aria-label={`Remove ${t.name || "technology"}`}
            >
              remove
            </Button>
          </li>
        ))}
      </ul>

      <div>
        <Button type="button" variant="outline" onClick={add}>
          + add technology
        </Button>
      </div>

      <p className="text-xs text-ink-faint">
        Find slugs at simpleicons.org. Missing or mis-coloured icons are fixed in
        code via <code>src/lib/icon-overrides.ts</code>.
      </p>
    </div>
  );
}
