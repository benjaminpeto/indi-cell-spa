# Indi Cell SPA

Single Page Application for browsing mobile devices and adding a selected variant (color + storage) to a cart.

## Table of Contents

- [Indi Cell SPA](#indi-cell-spa)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [Requirements](#requirements)
  - [API](#api)
  - [Getting Started](#getting-started)
    - [Install](#install)
    - [Run development server](#run-development-server)
    - [Build](#build)
    - [Test](#test)
    - [Lint](#lint)
    - [Format](#format)
  - [Code Quality](#code-quality)
  - [Project Status](#project-status)
    - [Milestone 0 (Initial scaffolding + tooling)](#milestone-0-initial-scaffolding--tooling)
    - [Milestone 1 (App Shell)](#milestone-1-app-shell)
    - [Milestone 2 (Data layer + caching)](#milestone-2-data-layer--caching)

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

### Install

```bash
npm install
```

### Run development server

```bash
npm run start
```

### Build

```bash
npm run build
```

### Test

```bash
npm run test
```

### Lint

```bash
npm run lint
```

### Format

```bash
npm run format
```

## Code Quality

- Pre-commit checks run automatically via Husky:
  - `npm run test`
  - `lint-staged` (ESLint fix + Prettier on staged files)

Tailwind classnames are automatically sorted using `prettier-plugin-tailwindcss`.

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
- API detail shape includes variant options under `options.colors` and `options.storages`.
- Implemented client-side caching using `localStorage` with a **1-hour TTL**:
  - `products:list`
  - `products:detail:{id}`
- React Query is used for request lifecycle (loading/error) with defaults aligned to the 1-hour caching window.