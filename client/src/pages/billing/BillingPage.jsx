import DashboardShell from '../../components/layout/DashboardShell';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useCreateCheckoutSessionMutation, useGetBillingMeQuery } from '../../features/billing/billingApi';
import { PLANS } from '../../lib/constants';
import { useToast } from '../../components/ui/ToastProvider';

const planRank = {
  free: 0,
  pro: 1,
  team: 2,
};

const planFeatures = {
  free: ['Core workflow access', '20 monthly credits', 'Basic project history'],
  pro: ['Priority output generation', '300 monthly credits', 'Best for solo pros'],
  team: ['High-volume usage', '1200 monthly credits', 'Best for studio teams'],
};

function BillingPage() {
  const { data, isFetching } = useGetBillingMeQuery();
  const [createCheckout, { isLoading }] = useCreateCheckoutSessionMutation();
  const { pushToast } = useToast();

  const currentPlan = (data?.plan || 'free').toLowerCase();
  const currentPlanConfig = PLANS[currentPlan] || PLANS.free;
  const totalCredits = currentPlanConfig.credits || 1;
  const creditsRemaining = data?.creditsRemaining ?? 0;
  const creditsUsed = Math.max(0, totalCredits - creditsRemaining);
  const usagePercent = Math.min(100, Math.round((creditsUsed / totalCredits) * 100));

  const onUpgrade = async (plan) => {
    try {
      const response = await createCheckout({ plan }).unwrap();
      window.location.href = response.url;
    } catch (error) {
      pushToast({ type: 'error', message: error?.data?.message || 'Checkout failed' });
    }
  };

  return (
    <DashboardShell
      tone="warm"
      title="Billing"
      subtitle="Manage subscription tier and monthly generation credits."
    >
      <Card className="border border-sand-300/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,250,242,0.96))] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-wood-600">Current Plan</p>
            <p className="mt-1 text-2xl font-bold text-sand-900">
              {currentPlanConfig.name}
            </p>
            <p className="mt-1 text-sm text-sand-700">
              Status:{' '}
              <span className="font-semibold text-sand-900">
                {data?.subscriptionStatus || 'inactive'}
              </span>
            </p>
          </div>
          <div className="rounded-xl border border-sand-300 bg-white/80 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-wood-600">Credits Remaining</p>
            <p className="mt-1 text-2xl font-bold text-sand-900">
              {isFetching ? '--' : creditsRemaining}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-sand-700">
            <span>
              Usage this cycle: {isFetching ? '--' : `${creditsUsed} / ${totalCredits}`}
            </span>
            <span>{isFetching ? '--' : `${usagePercent}% used`}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-sand-200">
            <div
              className="h-full rounded-full bg-wood-500 transition-all"
              style={{ width: isFetching ? '0%' : `${usagePercent}%` }}
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(PLANS).map(([key, plan]) => (
          <Card
            key={key}
            className={`relative overflow-hidden border p-5 ${
              key === currentPlan
                ? 'border-wood-300/80 bg-[linear-gradient(180deg,#fff8ec,#fff1de)] shadow-[0_16px_34px_rgba(107,79,49,0.17)]'
                : 'border-sand-300/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,250,242,0.96))]'
            }`}
          >
            {key === currentPlan ? (
              <p className="absolute right-4 top-4 rounded-full border border-wood-300/70 bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-wood-600">
                Active
              </p>
            ) : null}
            <p className="text-lg font-semibold text-sand-900">{plan.name}</p>
            <p className="mt-2 text-2xl font-bold text-sand-900">{plan.price}</p>
            <p className="mt-2 text-sm text-sand-700">{plan.description}</p>
            <p className="mt-2 text-sm font-medium text-wood-500">{plan.credits} credits/month</p>
            <ul className="mt-4 space-y-2 border-t border-sand-300/80 pt-3">
              {planFeatures[key].map((item) => (
                <li key={item} className="text-sm text-sand-800">
                  <span className="mr-2 text-wood-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
            {key === currentPlan ? (
              <Button variant="secondary" className="mt-5 w-full" disabled>
                Current plan
              </Button>
            ) : planRank[key] > planRank[currentPlan] ? (
              <Button className="mt-5 w-full" onClick={() => onUpgrade(key)} disabled={isLoading}>
                {isLoading ? 'Redirecting...' : `Upgrade to ${plan.name}`}
              </Button>
            ) : (
              <Button variant="secondary" className="mt-5 w-full" disabled>
                Not available here
              </Button>
            )}
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}

export default BillingPage;

