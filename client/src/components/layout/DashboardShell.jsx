function DashboardShell({ title, subtitle, actions, children, tone = 'dark' }) {
  const titleClass = tone === 'warm' ? 'text-2xl font-bold text-sand-900' : 'text-2xl font-bold text-white';
  const subtitleClass = tone === 'warm' ? 'mt-1 text-sm text-sand-700' : 'mt-1 text-sm text-neutral-400';

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className={titleClass}>{title}</h1>
          {subtitle ? <p className={subtitleClass}>{subtitle}</p> : null}
        </div>
        {actions}
      </header>
      {children}
    </section>
  );
}

export default DashboardShell;

