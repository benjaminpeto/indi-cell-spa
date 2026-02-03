import { useParams } from 'react-router-dom';

export function ProductDetailsPage() {
  const { id } = useParams();

  return (
    <section className="space-y-2">
      <h1 className="text-xl font-semibold">Product Details</h1>
      <p className="text-neutral-600">PDP placeholder for id: {id}</p>
    </section>
  );
}
