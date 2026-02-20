import { useLocation } from 'react-router-dom';

function Footer() {
  const location = useLocation();
  const isWarmFooter = location.pathname === '/' || location.pathname.startsWith('/auth');
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={
        isWarmFooter
          ? 'border-t border-sand-300/80 bg-[linear-gradient(180deg,rgba(245,237,226,0.74),rgba(237,227,212,0.86))]'
          : 'border-t border-white/10 bg-black/40'
      }
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div
          className={`grid gap-8 text-sm lg:grid-cols-[1.4fr_1fr_1fr_1fr] ${
            isWarmFooter ? 'text-sand-700' : 'text-neutral-400'
          }`}
        >
          <div>
            <p
              className={
                isWarmFooter
                  ? 'text-lg font-bold tracking-wide text-sand-900'
                  : 'text-lg font-bold tracking-wide text-neutral-100'
              }
            >
              Archify
            </p>
            <p className="mt-3 max-w-sm leading-relaxed">
              Professional blueprint-to-render SaaS for architects, interior teams, and developers.
            </p>
            <p className="mt-4 inline-flex rounded-full border border-sand-300/80 bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-wood-600">
              Photoreal 2D Workflow
            </p>
          </div>

          <div>
            <p className={isWarmFooter ? 'font-semibold text-sand-900' : 'font-semibold text-neutral-200'}>
              Product
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="/#how-it-works" className={isWarmFooter ? 'hover:text-wood-700' : 'hover:text-white'}>
                  Workflow
                </a>
              </li>
              <li>
                <a href="/#demo" className={isWarmFooter ? 'hover:text-wood-700' : 'hover:text-white'}>
                  Interactive Demo
                </a>
              </li>
              <li>
                <a href="/#pricing" className={isWarmFooter ? 'hover:text-wood-700' : 'hover:text-white'}>
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className={isWarmFooter ? 'font-semibold text-sand-900' : 'font-semibold text-neutral-200'}>
              Platform
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="/auth/login" className={isWarmFooter ? 'hover:text-wood-700' : 'hover:text-white'}>
                  Login
                </a>
              </li>
              <li>
                <a href="/auth/register" className={isWarmFooter ? 'hover:text-wood-700' : 'hover:text-white'}>
                  Start Free
                </a>
              </li>
              <li>
                <a href="/#faq" className={isWarmFooter ? 'hover:text-wood-700' : 'hover:text-white'}>
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className={isWarmFooter ? 'font-semibold text-sand-900' : 'font-semibold text-neutral-200'}>
              Legal
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="/#faq" className={isWarmFooter ? 'hover:text-wood-700' : 'hover:text-white'}>
                  Privacy
                </a>
              </li>
              <li>
                <a href="/#faq" className={isWarmFooter ? 'hover:text-wood-700' : 'hover:text-white'}>
                  Terms
                </a>
              </li>
              <li>
                <a href="/#faq" className={isWarmFooter ? 'hover:text-wood-700' : 'hover:text-white'}>
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={`mt-8 flex flex-col gap-3 border-t pt-4 text-xs sm:flex-row sm:items-center sm:justify-between ${
            isWarmFooter ? 'border-sand-300/80 text-sand-700' : 'border-white/10 text-neutral-500'
          }`}
        >
          <p>© {currentYear} Archify. All rights reserved.</p>
          <p>Built for architecture and interior visualization teams.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

