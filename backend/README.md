# Vayukrishi Backend — Phase 1 & 2

Node.js + Express + TypeScript + MongoDB + Redis backend for the Vayukrishi
AgriTech platform. Covers backend foundation (Phase 1) and Authentication +
Users (Phase 2).

## Stack

- **Runtime:** Node.js 18+, TypeScript, Express.js
- **Database:** MongoDB (Mongoose)
- **Cache / session store:** Redis (`ioredis`)
- **Auth:** JWT access token (15m) + refresh token (7d), bcryptjs password hashing
- **Validation:** Zod
- **Security:** Helmet, CORS, express-rate-limit, express-mongo-sanitize
- **Logging:** Winston + Morgan

## 1. Install

```bash
npm install
```

> Note: this uses `bcryptjs` (pure JS) instead of `bcrypt` (native bindings).
> Functionally identical API, but no native build step required — works
> out of the box on Windows without build tools installed.

## 2. Configure environment

```powershell
Copy-Item .env.example .env
```

Edit `.env` and set real values, especially:

- `MONGO_URI` — your local or Atlas MongoDB connection string
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — long random strings
  (e.g. generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- `REDIS_HOST` / `REDIS_PORT` — your local Redis instance

## 3. Run MongoDB and Redis locally

If you don't already have them running, the quickest options on Windows are
Docker Desktop:

```powershell
docker run -d -p 27017:27017 --name vayukrishi-mongo mongo:7
docker run -d -p 6379:6379 --name vayukrishi-redis redis:7
```

## 4. Start the dev server

```bash
npm run dev
```

You should see:

```
✅ MongoDB connected: localhost/vayukrishi
✅ Redis connected
🚀 Vayukrishi API running on port 5000 [development]
   Health check: http://localhost:5000/health
   API base:     http://localhost:5000/api/v1
```

## 5. Build for production

```bash
npm run build
npm start
```

## API Reference

### Health

| Method | Route     | Auth | Description        |
|--------|-----------|------|---------------------|
| GET    | `/health` | No   | Liveness check      |

### Auth (`/api/v1/auth`)

| Method | Route      | Auth | Body                              |
|--------|------------|------|-------------------------------------|
| POST   | `/register`| No   | `{ name, phone, email, password, role?, language? }` |
| POST   | `/login`   | No   | `{ email, password }`              |
| POST   | `/refresh` | No   | `{ refreshToken }`                 |
| POST   | `/logout`  | Yes  | —                                   |
| GET    | `/me`      | Yes  | —                                   |

`role` defaults to `farmer` if omitted. Valid roles: `farmer`, `consultant`,
`fpo_manager`, `govt_officer`, `admin`.

`language` defaults to `en`. Valid: `en`, `hi`, `mr`, `gu`, `ta`, `kn`.

Protected routes (`logout`, `me`, and everything in Users) expect:

```
Authorization: Bearer <accessToken>
```

### Users (`/api/v1/users`)

| Method | Route       | Auth | Body                          |
|--------|-------------|------|--------------------------------|
| PATCH  | `/profile`  | Yes  | `{ name?, language? }` (at least one) |

## Response Shape

**Success:**
```json
{ "success": true, "data": {}, "message": "", "timestamp": "" }
```

**Error:**
```json
{ "success": false, "message": "", "error": {}, "timestamp": "" }
```

## Architecture Notes

- **Refresh token revocation:** refresh tokens are stored in Redis (with a
  TTL matching their JWT expiry) AND on the User document. `/refresh`
  checks both the JWT signature and that the token matches what's stored —
  this lets `/logout` truly revoke a refresh token, which a pure
  stateless-JWT scheme can't do.
- **`auth.model.ts`** re-exports the User model from the users module rather
  than declaring a second schema — there's one `users` collection, and auth
  and profile concerns both operate on it.
- **Module layering:** `routes → controllers → services → repositories → model`.
  Controllers stay thin (HTTP only); business logic lives in services;
  Mongoose queries are isolated in repositories so they're easy to mock in
  tests.
- **`asyncHandler`** wraps every controller so thrown errors/rejected
  promises are forwarded to Express's error pipeline automatically —
  no repeated try/catch blocks.
- Sensitive fields (`password`, `refreshToken`) are `select: false` on the
  schema and stripped again in `toJSON` as a second layer of defense.

## What's Next (not in this delivery)

- Tests (`src/tests/README.md` has a suggested setup)
- Farms / Market / Schemes / Notifications / Analytics / File Upload modules
- AI service integration (explicitly out of scope per the brief)
