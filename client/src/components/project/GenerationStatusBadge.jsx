function GenerationStatusBadge({ status, tone = 'dark' }) {
  const styles =
    tone === 'warm'
      ? {
          queued: 'bg-amber-100 text-amber-800 border-amber-300',
          running: 'bg-sky-100 text-sky-800 border-sky-300',
          succeeded: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          failed: 'bg-red-100 text-red-800 border-red-300',
        }
      : {
          queued: 'bg-yellow-500/20 text-yellow-200 border-yellow-300/30',
          running: 'bg-blue-500/20 text-blue-200 border-blue-300/30',
          succeeded: 'bg-emerald-500/20 text-emerald-200 border-emerald-300/30',
          failed: 'bg-red-500/20 text-red-200 border-red-300/30',
        };

  return (
    <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

export default GenerationStatusBadge;

