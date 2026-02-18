# CI/CD Workflows

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
