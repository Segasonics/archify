function EmptyState({ title, message, action, tone = 'dark' }) {
  const rootClass =
    tone === 'warm'
      ? 'rounded-2xl border border-sand-300 bg-white/60 p-8 text-center'
      : 'rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center';
  const messageClass = tone === 'warm' ? 'mt-2 text-sm text-sand-700' : 'mt-2 text-sm text-neutral-400';

  return (
    <div className={rootClass}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className={messageClass}>{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;

