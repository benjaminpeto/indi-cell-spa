import { Outlet } from 'react-router-dom';

import { Breadcrumbs } from './breadcrumbs';
import { Header } from './header';

export function AppLayout() {
  return (
    <div className="min-h-screen pt-24">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <div className="mx-auto w-full max-w-7xl px-4 pt-3 pb-4 sm:px-6">
        <Breadcrumbs />
      </div>
      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
