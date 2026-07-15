import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-ivory-50 flex flex-col items-center justify-center p-4 font-body">
      <h1 className="text-6xl font-heading font-bold text-sage-600 mb-4">404</h1>
      <h2 className="text-2xl font-heading font-bold text-navy-800 mb-6 text-center">
        Page not found
      </h2>
      <p className="text-navy-500 mb-8 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button>Go back home</Button>
      </Link>
    </div>
  );
}
