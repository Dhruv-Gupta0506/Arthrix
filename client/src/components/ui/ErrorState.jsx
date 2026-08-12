export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="error-state">
      <p className="font-medium">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary">
          Try again
        </button>
      )}
    </div>
  );
}