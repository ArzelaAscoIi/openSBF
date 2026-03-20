# Contributing to openSBF

Thanks for taking the time to contribute! openSBF is a community-driven project and every contribution helps learners prepare for their boating license for free.

## Ways to contribute

### Reporting errors in questions or answers

The most valuable contribution is keeping the question catalog accurate. If you spot an incorrect question, wrong answer, or outdated content:

1. Open a [bug report](https://github.com/ArzelaAscoIi/openSBF/issues/new?template=bug_report.md).
2. Include the question number, the current (wrong) text, the correct text, and a reference (e.g. a link to [elwis.de](https://www.elwis.de) or the official BMDV catalog).

### Suggesting features

Have an idea for a new study mode, UI improvement, or accessibility feature? Open a [feature request](https://github.com/ArzelaAscoIi/openSBF/issues/new?template=feature_request.md).

### Submitting code

1. **Fork** the repository and create a branch from `main`:
   ```bash
   git checkout -b fix/question-42-wrong-answer
   ```

2. **Install dependencies** and start the dev server:
   ```bash
   cd app
   npm install
   npm run dev
   ```

3. **Make your changes.** Keep PRs focused – one fix or feature per PR.

4. **Verify the build** passes before opening a PR:
   ```bash
   npm run build
   npm run lint
   ```

5. **Open a pull request** against `main`. Fill in the PR template and link the related issue.

## Project structure

```
openSBF/
├── app/                  # Next.js application
│   ├── src/
│   │   ├── app/          # Next.js App Router pages and layouts
│   │   ├── components/   # React components
│   │   └── data/         # Question catalogs (TypeScript)
│   └── package.json
├── docs/                 # Original PDF question catalogs (BMDV/ELWIS)
├── LICENSE
└── README.md
```

## Content sources

All question/answer content must be traceable to the official BMDV/ELWIS catalogs. Do not introduce questions from unofficial or commercial sources.

## Code style

- TypeScript everywhere – avoid `any`.
- Follow the existing component and file naming conventions.
- Run `npm run lint` before committing.

## Commit messages

Use conventional commits where possible:

- `fix: correct answer for SBF See question 42`
- `feat: add keyboard navigation for answer selection`
- `docs: update contributing guide`

## Questions?

Open an [issue](https://github.com/ArzelaAscoIi/openSBF/issues) or start a [discussion](https://github.com/ArzelaAscoIi/openSBF/discussions) – we're happy to help.
