export default function AccessibilityIcons({
  wheelchair,
  stairClimber,
}: {
  wheelchair?: boolean;
  stairClimber?: boolean;
}) {
  if (!wheelchair && !stairClimber) return null;
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      {wheelchair && (
        <span
          title="Wheelchair needed"
          className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="4" r="1.5" fill="currentColor" stroke="none" />
            <path d="M11 6v6l4 2M11 12H6a2 2 0 0 0 0 4h1.5a4 4 0 0 0 7.5-1" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 15l2 5" strokeLinecap="round" />
          </svg>
        </span>
      )}
      {stairClimber && (
        <span
          title="Stair climber / elevator needed"
          className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M4 20v-4h4v-4h4V8h4V4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </span>
  );
}
