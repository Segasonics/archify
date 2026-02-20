import { useSelector } from 'react-redux';
import DashboardShell from '../../components/layout/DashboardShell';
import Card from '../../components/ui/Card';

function SettingsPage() {
  const user = useSelector((state) => state.auth.user);

  return (
    <DashboardShell title="Settings" subtitle="Profile and account preferences.">
      <Card className="max-w-xl p-5">
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-neutral-400">Name</dt>
            <dd className="text-neutral-100">{user?.name || '-'}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Email</dt>
            <dd className="text-neutral-100">{user?.email || '-'}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Role</dt>
            <dd className="text-neutral-100">{user?.role || '-'}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Plan</dt>
            <dd className="text-neutral-100">{user?.plan || '-'}</dd>
          </div>
        </dl>
      </Card>
    </DashboardShell>
  );
}

export default SettingsPage;

