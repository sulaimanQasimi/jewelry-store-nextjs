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
5. **Email**: After deploy (success or failure), an email is sent if SMTP secrets are set (see below).

### Email on success/failure

To receive an email when deploy succeeds or fails, add these **Secrets** in **Settings → Secrets and variables → Actions**:

| Secret          | Example / description                          |
|-----------------|------------------------------------------------|
| `MAIL_TO`       | Your email (e.g. `you@example.com`)            |
| `MAIL_FROM`     | Sender address (e.g. same as SMTP_USER)        |
| `SMTP_HOST`     | e.g. `smtp.gmail.com`                          |
| `SMTP_PORT`     | e.g. `587`                                     |
| `SMTP_USER`     | Your SMTP login (e.g. Gmail address)           |
| `SMTP_PASSWORD` | SMTP password (for Gmail use an App Password)  |

If these secrets are not set, the workflow still completes; the email step is skipped without failing the run.

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
