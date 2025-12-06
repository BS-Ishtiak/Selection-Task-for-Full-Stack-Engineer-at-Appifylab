# Social Media Type App

**Project Summary**

The application implements a simple social feed where users can register, log in, create posts (with optional image uploads), and interact through likes and comments. The codebase is split into a TypeScript Express.js backend and a TypeScript Next.js frontend.

**Tech Stack**

- **Backend:** Node.js, Express, TypeScript, PostgreSQL, JWT authentication, Multer for file uploads
- **Frontend:** Next.js (React), TypeScript, custom components under `frontend/src/components`
- **Database:** PostgreSQL (schema SQL available under `backend/sql/001_create_tables.sql`)

**Key Features**

- **User authentication:** Registration and login with password hashing and JWT-based sessions.
- **Posts feed:** Create, list, and view posts with text and optional image uploads.
- **Interactions:** Add comments and likes to posts.
- **File uploads:** Images are handled via `multer` and served from `backend/public/uploads`.
- **API-first:** REST endpoints for auth, posts, comments, likes, and token management.

**Repository Structure (high level)**

- `backend/` — Express API server (TypeScript)
	- `src/index.ts` — application entry
	- `src/controllers/` — request handlers (posts, comments, likes, auth, tokens)
	- `src/db/` — database access modules
	- `src/routes/` — route definitions (`auth.ts`, `routes.ts`)
	- `public/uploads/` — uploaded media
	- `sql/001_create_tables.sql` — database schema
- `frontend/` — Next.js frontend (TypeScript)
	- `src/components/` — React components (`PostCard`, `PostComposer`, etc.)
	- `src/app/` — pages and routes
	- `src/lib/api.ts` — API helper functions

**Prerequisites**

- Node.js (v16+ recommended)
- npm (or yarn)
- PostgreSQL database

**Local setup and run (development)**

1. Backend

```powershell
cd backend
npm install
# Create a .env file with the required variables, for example:
# DATABASE_URL=postgres://user:password@localhost:5432/dbname
# JWT_SECRET=your_jwt_secret
# PORT=4000
npm run dev
```

2. Database

Use the provided SQL to create tables:

```powershell
# Example using psql (adjust user/db as needed):
psql -U <db_user> -d <db_name> -f backend/sql/001_create_tables.sql
```

3. Frontend

```powershell
cd frontend
npm install
npm run dev
# Frontend typically serves on http://localhost:3000
```

4. Configuration and environment

- Ensure the backend `DATABASE_URL`, `JWT_SECRET`, and `PORT` environment variables are set before starting the backend.
- Uploaded files are stored in `backend/public/uploads` and are served by the backend static middleware.

**API Overview (examples)**

- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — log in and receive a JWT
- `GET /api/posts` — list posts
- `POST /api/posts` — create a post (multipart/form-data for images)
- `POST /api/comments` — add a comment to a post
- `POST /api/likes` — toggle/add a like for a post
- `POST /api/token` — token refresh / management

Note: Exact paths/parameters are implemented in `backend/src/routes` and handled by `backend/src/controllers`.

**Development Notes**

- The backend uses `nodemon` and `ts-node` for a smooth TypeScript development experience (`npm run dev`).
- Authentication is implemented with JWTs; protect frontend routes by checking the token in `frontend/src/context/AuthContext.tsx`.
- Multer handles file uploads; ensure `backend/public/uploads` is writable.

**Contributing / Extending**

- To add a new API resource, create a controller in `backend/src/controllers`, expose routes in `backend/src/routes`, and add DB helpers under `backend/src/db`.
- Frontend components live in `frontend/src/components` and pages under `frontend/src/app` — follow the existing component patterns for consistency.


