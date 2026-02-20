import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useRegisterMutation } from '../../features/auth/authApi';
import { useToast } from '../../components/ui/ToastProvider';

function RegisterPage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [register, { isLoading }] = useRegisterMutation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const submit = async (event) => {
    event.preventDefault();
    try {
      await register(form).unwrap();
      pushToast({ message: 'Account created.' });
      navigate('/dashboard');
    } catch (error) {
      pushToast({ type: 'error', message: error?.data?.message || 'Registration failed' });
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden rounded-3xl border border-sand-300/80 bg-[linear-gradient(140deg,rgba(255,251,245,0.9),rgba(247,239,227,0.9))] p-6 shadow-[0_22px_52px_rgba(91,74,53,0.14)] sm:p-8">
          <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-wood-200/60 blur-3xl" />
          <div className="absolute -left-12 bottom-0 h-36 w-36 rounded-full bg-sand-200/80 blur-3xl" />
          <p className="inline-flex rounded-full border border-wood-300/60 bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-wood-600">
            Start Free
          </p>
          <h1 className="mt-4 text-3xl font-bold text-sand-900 sm:text-4xl">Create your Archify account</h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-sand-700 sm:text-base">
            Set up your workspace and start turning floor plans into photoreal outputs with project
            history, comparison tools, and plan-based credits.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-sand-300 bg-white/70 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-wood-600">Step 1</p>
              <p className="mt-1 text-sm font-semibold text-sand-900">Create project</p>
            </div>
            <div className="rounded-xl border border-sand-300 bg-white/70 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-wood-600">Step 2</p>
              <p className="mt-1 text-sm font-semibold text-sand-900">Upload blueprint</p>
            </div>
            <div className="rounded-xl border border-sand-300 bg-white/70 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-wood-600">Step 3</p>
              <p className="mt-1 text-sm font-semibold text-sand-900">Generate renders</p>
            </div>
          </div>
        </section>

        <Card className="border border-sand-300/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,250,242,0.96))] p-6 shadow-[0_18px_40px_rgba(91,74,53,0.16)] sm:p-7">
          <h2 className="text-2xl font-bold text-sand-900">Create account</h2>
          <p className="mt-1 text-sm text-sand-700">Get started in less than a minute.</p>
          <form className="mt-5 space-y-4" onSubmit={submit}>
            <label className="block text-sm font-medium text-sand-900">
              Name
              <input
                type="text"
                required
                className="mt-1 w-full rounded-lg border border-sand-300 bg-white/90 px-3 py-2 text-sand-900 outline-none transition focus:border-wood-400"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              />
            </label>
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
                minLength={8}
                className="mt-1 w-full rounded-lg border border-sand-300 bg-white/90 px-3 py-2 text-sand-900 outline-none transition focus:border-wood-400"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              />
            </label>
            <Button type="submit" className="mt-1 w-full py-2.5" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create account'}
            </Button>
          </form>
          <p className="mt-4 text-sm text-sand-700">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-semibold text-wood-600 hover:text-wood-700">
              Login
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

export default RegisterPage;

