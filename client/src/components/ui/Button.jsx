import clsx from 'clsx';

function Button({
  children,
  className,
  variant = 'primary',
  type = 'button',
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        'app-btn inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'primary' && 'btn-primary',
        variant === 'secondary' && 'btn-secondary',
        variant === 'ghost' && 'btn-ghost',
        variant === 'primary' && 'bg-brand-500 text-white hover:bg-brand-400',
        variant === 'secondary' &&
          'border border-white/15 bg-white/5 text-neutral-100 hover:bg-white/10',
        variant === 'ghost' && 'text-neutral-200 hover:bg-white/10',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;

