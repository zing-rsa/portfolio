"use client";

import { Icon } from "./Icon";
import { toast } from "./Toaster";
import { clsx, decodeBase64 } from "@/lib/utils";

interface IconData {
  path?: string | null;
  svg?: string | null;
  viewBox?: string;
  color?: string | null;
}

interface CopyButtonProps {
  /** Base64-encoded value to copy — decoded only at click time. */
  encoded: string;
  label: string;
  icon?: IconData | null;
  size?: number;
  className?: string;
}

/**
 * Renders like a social link but copies a value to the clipboard on click
 * (rather than navigating) and shows a toast. The value arrives base64-encoded
 * so the plaintext (e.g. an email) never sits in the DOM; it's decoded only when
 * the user clicks.
 */
export function CopyButton({
  encoded,
  label,
  icon,
  size = 20,
  className,
}: CopyButtonProps) {
  async function onClick() {
    try {
      const value = decodeBase64(encoded);
      await navigator.clipboard.writeText(value);
      toast(`${label} copied to clipboard`);
    } catch {
      toast(`Couldn't copy ${label}`);
    }
  }

  return (
    <button type="button" onClick={onClick} className={clsx("group", className)}>
      <Icon icon={icon} label={label} size={size} />
      <span className="text-sm group-hover:underline">{label}</span>
    </button>
  );
}
