@AGENTS.md

## Team

You are the organizer. Roles live in `.claude/agents/`.
- Task touches one area → do it yourself, or hand it to that one role.
- Task spans areas → create an agent team: split it into tasks per owner (with dependencies, e.g. API before UI), spawn only the roles needed using their agent type, name each teammate after its role, then wait for them instead of doing their work.
- When they finish, spawn `reviewer` on the diff, route its findings back to the owners, then summarize for the user.
- Never edit files a teammate owns while it's working.

| Role | Owns | Talks to |
|------|------|----------|
| page | `src/app/**`, `next.config.ts`, `package.json`, `package-lock.json`, `tsconfig.json`, `.impeccable/` | content, tests |
| content | `src/content/**`, `public/**`, `PRODUCT.md` | page, tests |
| tests | `tests/**`, `playwright.config.ts` | page, content |
| reviewer | read-only | organizer |
