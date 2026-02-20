import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-neutral-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-neutral-400">The page you requested does not exist.</p>
        <Link to="/" className="mt-4 inline-block">
          <Button>Back to home</Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;

