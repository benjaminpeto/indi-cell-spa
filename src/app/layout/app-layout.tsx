import { Outlet } from "react-router-dom";

import { Header } from "./header";

export function AppLayout() {
  return (
    <div>
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
