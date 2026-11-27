# KDVA

KDVA is a lightweight project workspace for keeping active projects, upcoming tasks, and team progress in one place. The interface is built with React and TypeScript, uses Bun for package management, and stores task changes in the browser's local storage.

## Requirements

- [Bun](https://bun.sh/)
- Docker and the Docker Compose plugin (optional, for container use)

## Run locally

```sh
bun install
bun run dev
```

Vite prints the local URL after the development server starts.

## Production build

```sh
bun run build
bun run preview
```

## Run in a container

```sh
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080). Stop the container with `docker compose down`.

## CI and releases

GitHub Actions runs a frozen Bun install, production build, and Docker image build for pushes and pull requests targeting `master`. Push a version tag such as `v1.0.0` to build and publish the container to GitHub Container Registry (GHCR).

## Project structure

- `src/App.tsx` — workspace dashboard and task interactions
- `src/style.css` — responsive layout and visual system
- `Dockerfile` — Bun build stage and Nginx static runtime
- `compose.yaml` — local container configuration