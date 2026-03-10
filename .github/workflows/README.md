# CI/CD Workflows

## Deploy to VPS (`deploy.yml`)

Deploys the app to your VPS: uploads source, runs `npm ci`, `npm run build`, and `pm2 restart gemify`.

### Triggers

- Push to `master` or `main`
- Manual run (Actions → Deploy to VPS → Run workflow)

### What it does

1. Checkout repo on the runner.
2. Install `sshpass` and `rsync`.
3. **Rsync** project to the VPS at `/var/www/gemify/` (excluding `node_modules`, `.next`, `.git`, `backups`, `.env`, `.env.local`).
4. **SSH** into the VPS and run: `cd /var/www/gemify && npm ci && npm run build && pm2 restart gemify`.

### Email on success/failure (GitHub notifications)

GitHub sends workflow result emails to your account email. Turn them on: **GitHub → Settings → Notifications → Actions** — enable “Email” for Actions so you get an email when this workflow succeeds or fails.

### VPS requirements

- Node.js 20 and npm installed.
- PM2 installed globally (`npm i -g pm2`) with app name `gemify` (e.g. `pm2 start npm --name gemify -- start`).
- Directory `/var/www/gemify` exists and is writable by `VPS_USER`.
- Keep `.env` (and secrets) only on the server; the workflow does not overwrite `.env`.

---

## CI (`ci.yml`)

Runs on every push and pull request to `master` or `main`.

### Jobs

| Job               | Description                                      |
|-------------------|--------------------------------------------------|
| **Lint**          | ESLint via `next lint`                           |
| **Build**         | Next.js production build                         |
| **Security audit**| `npm audit --audit-level=high` (continue-on-error)|
| **Dependency review** | PR only: checks new dependencies for vulnerabilities |

### Triggers

- Push to `master` or `main`
- Pull requests to `master` or `main`
- Manual dispatch

### Environment

- Node 20
- Build uses placeholder `AUTH_SECRET` / `JWT_SECRET` (no real secrets in CI)
