# Security Policy

## Supported Versions

Security updates are applied to the latest version on the `main` branch.

## Reporting a Vulnerability

Please do not disclose security vulnerabilities publicly in issues or discussions.

Instead, report vulnerabilities privately to the repository owner with:

- Vulnerability type and impact
- Affected file(s) and endpoint(s)
- Reproduction steps or proof of concept
- Suggested mitigation (if known)

You can use email or a private communication channel with the maintainer.

## Response Process

1. Acknowledgement target: within 72 hours.
2. Triage and severity assessment.
3. Fix development and validation.
4. Coordinated disclosure after patch release.

## Handling Secrets

- Never commit `.env` files.
- Rotate exposed credentials immediately.
- Use strong secrets for JWT and API keys.
