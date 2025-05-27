# brev.ly

A complete URL shortening system with an admin dashboard, CSV report export, and Cloudflare R2 integration for file storage. The project is divided into two applications: **server** (back-end) and **web** (front-end).

---

## Project Structure

```
brev.ly/
│
├── server/         # Back-end (Fastify, Drizzle ORM, PostgreSQL, Docker)
│   ├── src/
│   ├── docker/
│   ├── .env.example
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── drizzle.config.ts
│   └── ...
│
└── web/            # Front-end (React, Vite, TailwindCSS)
    ├── src/
    ├── public/
    ├── .env.example
    └── ...
```

---

## Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (or npm/yarn)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (to easily run the back-end)
- (Optional) Local PostgreSQL, if not using Docker

---

## Back-end Setup (`server`)

### 1. Environment Variables

Copy the `.env.example` file to `.env` and fill in the required values:

```sh
cp server/.env.example server/.env
```

Main fields:
- `DATABASE_URL` (e.g.: `postgresql://docker:docker@localhost:5432/brevly`)
- Cloudflare R2 credentials (`CLOUDFLARE_*`)

### 2. Running with Docker Compose

The project includes a `server/docker-compose.yml` that starts:
- PostgreSQL
- Database migration service
- Node.js application

Run:

```sh
cd server
docker-compose up --build
```

### 3. Running Locally (without Docker)

1. Install dependencies:

    ```sh
    pnpm install
    ```

2. Generate database migrations:

    ```sh
    pnpm db:generate
    pnpm db:migrate
    ```

3. Start the server:

    ```sh
    pnpm run dev
    ```

---

## Front-end Setup (`web`)

### 1. Environment Variables

Copy the `.env.example` file to `.env` and set the backend URL:

```sh
cp web/.env.example web/.env
```

Example:
```
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3333
```

### 2. Install dependencies

```sh
cd web
pnpm install
```

### 3. Run the project

```sh
pnpm run dev
```

Access: [http://localhost:5173](http://localhost:5173)

---

## Main Technologies

- **Back-end:** Fastify, Drizzle ORM, PostgreSQL, Cloudflare R2, Docker
- **Front-end:** React, Vite, TailwindCSS, TanStack Query/Router

---

## Features

- Custom URL shortening
- Listing, deleting, and redirecting links
- CSV report export (download via CDN)

---

## Useful Scripts

### Back-end

- `pnpm run dev` — starts the server in development mode
- `pnpm build` — builds the project for production
- `pnpm db:generate` — generates database migrations (Drizzle)
- `pnpm db:migrate` — runs the migrations

### Front-end

- `pnpm run dev` — starts the front-end in development mode
- `pnpm build` — builds the front-end for production

---

## License

This project is licensed under the MIT License.

---

> For questions or suggestions, open an issue or contact the project maintainer.

---