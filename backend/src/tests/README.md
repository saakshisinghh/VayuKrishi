# tests/

Placeholder for Phase 1 & 2. No test runner is wired up yet.

Suggested next steps:
- Add Jest + ts-jest (or Vitest) as dev dependencies.
- Add `supertest` for HTTP-level integration tests against `createApp()`.
- Use `mongodb-memory-server` for isolated DB tests (no real Mongo needed).
- Mock `ioredis` with `ioredis-mock` for unit tests on auth.service.ts.

Example structure once wired up:
tests/
├── unit/
│   ├── auth.service.spec.ts
│   └── user.service.spec.ts
└── integration/
    ├── auth.routes.spec.ts
    └── user.routes.spec.ts
