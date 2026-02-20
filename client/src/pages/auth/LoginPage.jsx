import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useLoginMutation } from '../../features/auth/authApi';
import { useToast } from '../../components/ui/ToastProvider';

function LoginPage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [login, { isLoading }] = useLoginMutation();
  const [form, setForm] = useState({ email: '', password: '' });

  const submit = async (event) => {
    event.preventDefault();
    try {
      await login(form).unwrap();
      pushToast({ message: 'Logged in successfully.' });
      navigate('/dashboard');
    } catch (error) {
      pushToast({ type: 'error', message: error?.data?.message || 'Login failed' });
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden rounded-3xl border border-sand-300/80 bg-[linear-gradient(140deg,rgba(255,251,245,0.9),rgba(247,239,227,0.9))] p-6 shadow-[0_22px_52px_rgba(91,74,53,0.14)] sm:p-8">
          <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-wood-200/60 blur-3xl" />
          <div className="absolute -left-12 bottom-0 h-36 w-36 rounded-full bg-sand-200/80 blur-3xl" />
          <p className="inline-flex rounded-full border border-wood-300/60 bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-wood-600">
            Welcome Back
          </p>
          <h1 className="mt-4 text-3xl font-bold text-sand-900 sm:text-4xl">Sign in to Archify</h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-sand-700 sm:text-base">
            Continue managing blueprint uploads, photoreal render generations, and project history
            from one workspace.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-sand-300 bg-white/70 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-wood-600">Projects</p>
              <p className="mt-1 text-sm font-semibold text-sand-900">Centralized dashboard</p>
            </div>
            <div className="rounded-xl border border-sand-300 bg-white/70 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-wood-600">Renders</p>
              <p className="mt-1 text-sm font-semibold text-sand-900">2D photoreal outputs</p>
            </div>
            <div className="rounded-xl border border-sand-300 bg-white/70 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-wood-600">Billing</p>
              <p className="mt-1 text-sm font-semibold text-sand-900">Credits by plan</p>
            </div>
          </div>
        </section>

        <Card className="border border-sand-300/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,250,242,0.96))] p-6 shadow-[0_18px_40px_rgba(91,74,53,0.16)] sm:p-7">
          <h2 className="text-2xl font-bold text-sand-900">Login</h2>
          <p className="mt-1 text-sm text-sand-700">Enter your account credentials to continue.</p>
          <form className="mt-5 space-y-4" onSubmit={submit}>
            <label className="block text-sm font-medium text-sand-900">
              Email
              <input
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-sand-300 bg-white/90 px-3 py-2 text-sand-900 outline-none transition focus:border-wood-400"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </label>
            <label className="block text-sm font-medium text-sand-900">
              Password
              <input
                type="password"
                required
                className="mt-1 w-full rounded-lg border border-sand-300 bg-white/90 px-3 py-2 text-sand-900 outline-none transition focus:border-wood-400"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              />
            </label>
            <Button type="submit" className="mt-1 w-full py-2.5" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <p className="mt-4 text-sm text-sand-700">
            No account?{' '}
            <Link to="/auth/register" className="font-semibold text-wood-600 hover:text-wood-700">
              Create one
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;

