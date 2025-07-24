import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gaming-dark">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gaming-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild variant="gaming">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
