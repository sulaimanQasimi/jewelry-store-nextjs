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

### "Connection timed out" / SSH (port 22) blocked

If the workflow fails with `ssh: connect to host … port 22: Connection timed out` or `rsync: connection unexpectedly closed`, the **VPS or its firewall is blocking SSH from GitHub’s IPs**. Fix it in one of these ways:

1. **Allow SSH from GitHub Actions IPs**  
   GitHub publishes IP ranges for Actions:  
   https://api.github.com/meta → use the `actions` list.  
   On the VPS (or in your cloud firewall), allow **TCP port 22** from those IPs.  
   (Ranges can change; you may need to allow a broader set or update periodically.)

2. **Allow SSH from anywhere (less secure)**  
   If your provider uses a security group / firewall (e.g. UFW, cloud console), open **port 22** to `0.0.0.0/0`.  
   Harden the server: SSH key-only auth, strong passwords, and e.g. fail2ban.

3. **Use a self-hosted runner on the VPS**  
   Install a [GitHub Actions self-hosted runner](https://docs.github.com/en/actions/guides/adding-self-hosted-runners) on the same VPS (or a machine that can reach it). In the workflow set `runs-on: self-hosted` (or your runner label) so the job runs there and SSH is to `localhost` (or an allowed IP). No need to open port 22 to the internet for GitHub.

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
