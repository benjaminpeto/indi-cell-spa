import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="neo-panel bg-paper mt-6 space-y-3 p-5">
      <h1 className="text-2xl">Page not found</h1>
      <p className="text-sm font-medium">The route you visited does not exist.</p>
      <Link to="/" className="inline-block text-sm font-bold underline-offset-2 hover:underline">
        Go back home
      </Link>
    </section>
  );
}
