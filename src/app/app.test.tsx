import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import App from "./app";

test("renders app shell", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );

  expect(screen.getByText(/indi cell store/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
});
