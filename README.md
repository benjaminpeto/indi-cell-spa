# Indi Cell SPA

Single Page Application for browsing mobile devices and adding a selected variant (color + storage) to a cart.

## Table of Contents

- [Indi Cell SPA](#indi-cell-spa)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [Requirements](#requirements)
  - [API](#api)
  - [Getting Started](#getting-started)
  - [Code Quality](#code-quality)
  - [Project Status](#project-status)
    - [Milestone 0 (Initial scaffolding + tooling)](#milestone-0-initial-scaffolding--tooling)
    - [Milestone 1 (App Shell)](#milestone-1-app-shell)
    - [Milestone 2 (Data layer + caching)](#milestone-2-data-layer--caching)
    - [Milestone 3 (PLP - Product List Base UI and Real Time Search)](#milestone-3-plp---product-list-base-ui-and-real-time-search)
    - [Milestone 4 (PDP + Product Details Base UI and Add to cart)](#milestone-4-pdp--product-details-base-ui-and-add-to-cart)
    - [Milestone 5 (Cart count persistence \[global + client-side\])](#milestone-5-cart-count-persistence-global--client-side)

## Tech Stack

- React 19 + TypeScript
- Vite
- TailwindCSS
- React Router (client-side routing)
- TanStack Query (data fetching)
- ESLint + Prettier
- Vitest + React Testing Library

## Requirements

- SPA (no SSR / no MPA)
- Two views:
  - Product List (PLP)
  - Product Details (PDP)
- Client-side routing
- Real-time search filter by **brand** and **model**
- Add to cart sends: `id`, `colorCode`, `storageCode`
- Cart API returns `{ count }` and the header must display the current count
- Client-side caching with **1-hour expiration** for API data

## API

Base URL:

- `https://itx-frontend-test.onrender.com/`

Endpoints:

- `GET /api/product` — product list
- `GET /api/product/:id` — product details
- `POST /api/cart` — add to cart
  - Body: `{ id, colorCode, storageCode }`
  - Response: `{ count }`

## Getting Started

```bash
### Install
npm install

### Run development server
npm run start

### Build
npm run build

### Test
npm run test

### Lint
npm run lint

### Format
npm run format
```

## Code Quality

- Pre-commit checks run automatically via Husky:
  - `npm run test`
  - `lint-staged` (ESLint fix + Prettier on staged files)

## Project Status

### Milestone 0 (Initial scaffolding + tooling)

### Milestone 1 (App Shell)
- Client-side routing:
  - `/` Product List (placeholder)
  - `/product/:id` Product Details (placeholder)
  - `*` Not Found
- Global layout with header:
  - Title link to Home
  - Breadcrumbs (Home / Product placeholder on PDP)
  - Cart count placeholder (0)

### Milestone 2 (Data layer + caching)
- Added a typed API client for:
  - `GET /api/product`
  - `GET /api/product/:id`
  - `POST /api/cart`
- API detail shape includes variant options under `options.colors` and `options.storages`
- Implemented client-side caching using `localStorage` with a **1-hour TTL**:
  - `products:list`
  - `products:detail:{id}`
- React Query is used for request lifecycle (loading/error) with defaults aligned to the 1-hour caching window

### Milestone 3 (PLP - Product List Base UI and Real Time Search)
- Product List page now renders a responsive grid of product cards (image, brand/model, price)
- Added a real-time search input that filters by **brand** and **model** (case-insensitive)
- Includes loading / error / empty states

### Milestone 4 (PDP + Product Details Base UI and Add to cart)
- Product Details page renders a real layout with image, title, price and basic specs
- Variant selectors are driven by API `options.colors` and `options.storages`
- Add to cart sends `{ id, colorCode, storageCode }` and updates the header cart count from API `{ count }`
- Breadcrumbs on PDP show `Home / {brand model}` once the product loads (fallback `Home / Product`)

### Milestone 5 (Cart count persistence [global + client-side])
- Holds `cartCount`
- Initialises from localStorage (default 0)
- Persists on change
- Mutation success updates context + storage