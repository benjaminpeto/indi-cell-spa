import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="text-neutral-600">The route you visited does not exist.</p>
      <Link to="/" className="inline-block text-sm font-medium hover:underline">
        Go back home
      </Link>
    </section>
  );
}
