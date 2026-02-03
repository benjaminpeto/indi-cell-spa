import { Link, useLocation } from 'react-router-dom';

type Crumb = { label: string; to?: string };

export function Breadcrumbs() {
  const { pathname } = useLocation();

  const crumbs: Crumb[] = [{ label: 'Home', to: '/' }];

  if (pathname.startsWith('/product/')) {
    crumbs.push({ label: 'Product' }); // placeholder.. later use brand/model
  }

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-neutral-600">
      <ol className="flex items-center gap-2">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
              {crumb.to && !isLast ? (
                <Link to={crumb.to} className="hover:text-neutral-900 hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className="text-neutral-800">
                  {crumb.label}
                </span>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
