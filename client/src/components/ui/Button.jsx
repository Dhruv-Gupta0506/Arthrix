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
      {loading ? "Please wait..." : children}
    </button>
  );
}