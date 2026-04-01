# Contributing to Resume Saathi

Thank you for contributing to Resume Saathi.
This guide helps keep contributions clear, consistent, and easy to review.

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB (local or cloud)

## Local Setup

### Backend

```bash
cd Backend
npm install
copy .env.sample .env
npm start
```

### Frontend

```bash
cd Frontend
npm install
copy .env.example .env
npm run dev
```

## Development Workflow

1. Fork the repository.
2. Create a branch from `main`.
3. Make focused changes.
4. Run checks locally.
5. Open a pull request with clear context.

## Branch Naming

- `feat/<short-description>`
- `fix/<short-description>`
- `docs/<short-description>`

## Commit Message Style

- `feat: add resume section scoring`
- `fix: handle missing origin in cors`
- `docs: update contribution guide`

## Validation Checklist Before PR

- Backend starts without runtime errors.
- Frontend starts without runtime errors.
- Frontend lint passes with `npm run lint`.
- Backend formatting is applied where needed.
- Documentation is updated when setup or behavior changes.

## Pull Request Checklist

- Explain what changed and why.
- Link related issues, if available.
- Keep PR scope small and reviewable.
- Include screenshots or logs if UI or API behavior changed.

## Reporting Bugs

When opening a bug report, include:

- Expected behavior
- Actual behavior
- Reproduction steps
- Environment details (OS, browser, Node version)

## Suggesting Features

When requesting a feature, include:

- Problem statement
- Proposed solution
- Alternatives considered
- Scope and constraints

## Community Standards

By contributing, you agree to follow `CODE_OF_CONDUCT.md`.
