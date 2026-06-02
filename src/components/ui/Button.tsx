import { clsx } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANTS: Record<Variant, string> = {
  solid: "bg-ink text-paper hover:bg-ink-muted",
  outline: "border border-ink text-ink hover:bg-ink hover:text-paper",
  ghost: "text-ink-muted hover:text-ink",
};

/** Monochrome terminal-styled button. */
export function Button({
  variant = "outline",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm",
        "transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
