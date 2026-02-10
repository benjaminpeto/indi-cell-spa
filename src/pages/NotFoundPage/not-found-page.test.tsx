import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { NotFoundPage } from './not-found-page';

describe('NotFoundPage', () => {
  it('renders message and home link', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByText(/route you visited does not exist/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go back home/i })).toHaveAttribute('href', '/');
  });
});
