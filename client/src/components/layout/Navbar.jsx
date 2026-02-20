import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLogoutMutation } from '../../features/auth/authApi';
import { useToast } from '../ui/ToastProvider';

function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [logout] = useLogoutMutation();
  const { pushToast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const isWarmNav =
    location.pathname === '/' ||
    location.pathname.startsWith('/auth') ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/billing') ||
    location.pathname.startsWith('/projects');

  useEffect(() => {
    if (!isWarmNav) {
      setScrolled(false);
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isWarmNav, location.pathname]);

  const onLogout = async () => {
    try {
      await logout().unwrap();
      pushToast({ message: 'Signed out.' });
      navigate('/');
    } catch {
      pushToast({ type: 'error', message: 'Sign out failed' });
    }
  };

  const onSectionClick = (sectionId) => (event) => {
    if (location.pathname !== '/') {
      return;
    }

    const target = document.getElementById(sectionId);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `/#${sectionId}`);
  };

  return (
    <header
      className={
        isWarmNav
          ? scrolled
            ? 'sticky top-0 z-40 border-b border-sand-300/75 bg-[linear-gradient(135deg,rgba(245,241,234,0.98),rgba(239,232,220,0.96)_60%,rgba(231,220,203,0.95))] shadow-[0_12px_30px_rgba(91,74,53,0.14)] backdrop-blur-md'
            : 'sticky top-0 z-40 border-b border-sand-300/65 bg-[linear-gradient(135deg,rgba(245,241,234,0.96),rgba(239,232,220,0.94)_60%,rgba(231,220,203,0.92))] backdrop-blur-sm'
          : 'sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur'
      }
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className={
            isWarmNav
              ? 'text-lg font-bold tracking-wide text-sand-900'
              : 'text-lg font-bold tracking-wide text-white'
          }
        >
          Archify
        </Link>
        <nav
          className={
            isWarmNav
              ? 'hidden items-center gap-4 text-sm md:flex'
              : 'hidden items-center gap-5 text-sm md:flex'
          }
        >
          <a
            href="/#top-hero"
            onClick={onSectionClick('top-hero')}
            className={
              isWarmNav
                ? 'px-1 py-1.5 font-semibold text-sand-900 hover:text-wood-700'
                : 'text-neutral-300 hover:text-white'
            }
          >
            Home
          </a>
          <a
            href="/#how-it-works"
            onClick={onSectionClick('how-it-works')}
            className={
              isWarmNav
                ? 'px-1 py-1.5 font-semibold text-sand-900 hover:text-wood-700'
                : 'text-neutral-300 hover:text-white'
            }
          >
            How it works
          </a>
          <a
            href="/#pricing"
            onClick={onSectionClick('pricing')}
            className={
              isWarmNav
                ? 'px-1 py-1.5 font-semibold text-sand-900 hover:text-wood-700'
                : 'text-neutral-300 hover:text-white'
            }
          >
            Pricing
          </a>
          <a
            href="/#faq"
            onClick={onSectionClick('faq')}
            className={
              isWarmNav
                ? 'px-1 py-1.5 font-semibold text-sand-900 hover:text-wood-700'
                : 'text-neutral-300 hover:text-white'
            }
          >
            FAQ
          </a>
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isWarmNav
                    ? isActive
                      ? 'border-b-2 border-wood-500 px-1 py-1.5 font-semibold text-wood-700'
                      : 'px-1 py-1.5 font-semibold text-sand-900 hover:text-wood-700'
                    : isActive
                      ? 'text-brand-300'
                      : 'text-neutral-300 hover:text-white'
                }
              >
                Projects
              </NavLink>
              <NavLink
                to="/billing"
                className={({ isActive }) =>
                  isWarmNav
                    ? isActive
                      ? 'border-b-2 border-wood-500 px-1 py-1.5 font-semibold text-wood-700'
                      : 'px-1 py-1.5 font-semibold text-sand-900 hover:text-wood-700'
                    : isActive
                      ? 'text-brand-300'
                      : 'text-neutral-300 hover:text-white'
                }
              >
                Billing
              </NavLink>
              <button
                type="button"
                className={
                  isWarmNav
                    ? 'rounded-lg border border-rose-300/70 bg-rose-50/70 px-3 py-1.5 font-semibold text-rose-700 transition hover:bg-rose-100'
                    : 'rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 font-semibold text-neutral-200 hover:bg-white/10 hover:text-white'
                }
                onClick={onLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth/login"
              className={
                isWarmNav
                  ? 'rounded-lg bg-wood-500 px-4 py-2 font-semibold text-sand-50 hover:bg-wood-600'
                  : 'rounded-lg bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-400'
              }
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

