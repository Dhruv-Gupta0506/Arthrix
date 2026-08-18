import { cn } from "../../lib/utils";

const VARIANTS = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  danger: "btn-danger",
};

export default function Button({
  variant = "primary",
  className,
  children,
  disabled,
  loading,
  ...props
}) {
  return (
    <button
      className={cn(VARIANTS[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {loading ? "Please wait..." : children}
    </button>
  );
}