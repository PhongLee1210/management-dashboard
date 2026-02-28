# Management Dashboard

A full-featured customer and orders management dashboard, powered by a GraphQL API with cursor-based pagination, server-side sorting, and filtering.

## Setup

```bash
npm install
npm start
```

The dev server starts on `http://localhost:5173` by default.

To build for production:

```bash
npm run build
npm run preview
```

## Stack

| Layer         | Technology                                     |
| ------------- | ---------------------------------------------- |
| UI Framework  | React 19                                       |
| Build Tool    | Vite 7                                         |
| CSS           | TailwindCSS 4 (via `@tailwindcss/vite` plugin) |
| Data Fetching | Apollo Client 4                                |
| Routing       | React Router 7                                 |
| Language      | TypeScript 5                                   |
