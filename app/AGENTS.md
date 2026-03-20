<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:quality-gate -->
# Quality gate — REQUIRED before every commit

After making any code change, run both checks from inside the `app/` directory and fix every error before committing:

```bash
npm run lint       # ESLint — zero errors allowed
npm run typecheck  # tsc --noEmit — zero errors allowed
```

These are also enforced by:
- A husky pre-commit hook (blocks the commit if either check fails)
- The GitHub Actions CI workflow (`.github/workflows/ci.yml`)

Do NOT use `// eslint-disable` or `@ts-ignore` to silence errors — fix the root cause.
<!-- END:quality-gate -->
