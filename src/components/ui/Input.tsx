import { clsx } from "@/lib/utils";

/** Shared control surface for inputs, selects and textareas. */
export const inputClass =
  "border border-ink-muted/50 bg-paper px-3 py-2 text-sm focus:border-ink focus:outline-none";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/** Monochrome text input built on {@link inputClass}. */
export function Input({ className, ...props }: InputProps) {
  return <input className={clsx(inputClass, className)} {...props} />;
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

/** Stacked label + control, the standard admin form row. */
export function Field({ label, children, className }: FieldProps) {
  return (
    <label className={clsx("flex flex-col gap-1 text-sm", className)}>
      <span className="text-ink-muted">{label}</span>
      {children}
    </label>
  );
}
