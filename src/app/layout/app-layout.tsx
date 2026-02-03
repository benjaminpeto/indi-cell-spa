import { Link, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div>
      <header>
        <h1>
          <Link to="/">Indi Cell Store</Link>
        </h1>

        <nav>
          <Link to="/">Home</Link>
        </nav>
      </header>

      <Outlet />
    </div>
  );
}
