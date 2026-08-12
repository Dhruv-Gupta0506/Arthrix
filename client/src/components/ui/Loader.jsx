export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-volt" />
      <p className="text-sm text-ink-muted">{label}</p>
    </div>
  );
}