# Raadhyam Portal

## Platform

Raadhyam Portal is a web-based music learning and content management platform.

- `Frontend`: React + Vite single-page application for users and admin
- `Backend`: Node.js + Express REST API
- `Database`: MongoDB with Mongoose
- `Storage`: Cloudinary for media uploads

## Overview

Based on the current codebase, the project provides:
- Public pages: `Welcome`, `About`, `Contact`, and `Music Notes`
- Authentication: email/password login and Google OAuth login
- Admin module: create, update, and delete courses and music notes
- Upload workflow: file and thumbnail uploads through Cloudinary
- Secure APIs: JWT-based protected routes with single-session token enforcement

## Tech Stack

### Frontend
- React 19
- Vite 7
- React Router 7
- Axios
- Tailwind CSS 4

### Backend
- Node.js + Express 5
- MongoDB + Mongoose
- JWT authentication
- Passport Google OAuth 2.0
- Multer + Cloudinary (file uploads)

## Project Structure

```text
Raadhyam Potal/
  Backend/
    config/
    controllers/
    middlewares/
    models/
    routers/
    index.js
  Frontend/
    src/
    public/
    vite.config.js
```

## Main Features

- User registration and login
- Google Sign-In with redirect support
- Token-based auth with single-session enforcement (`currentToken` check)
- Admin CRUD for courses
- Admin CRUD for music notes
- Cloudinary-based file and thumbnail uploads
- Public music notes page for users

## API Summary

Base path: `/api`

### Auth Routes
- `POST /register/user`
- `POST /login/user`
- `GET /auth/google`
- `GET /auth/google/callback`
- `GET /check-auth` (protected)

### Public Content Routes
- `GET /music-notes`

### Admin Routes (Protected)
- `GET /admin/courses`
- `POST /admin/courses`
- `GET /admin/courses/:id`
- `PUT /admin/courses/:id`
- `DELETE /admin/courses/:id`
- `POST /admin/courses/generate-slug`
- `POST /admin/courses/validate`
- `POST /admin/upload`
- `POST /admin/upload/thumbnail`
- `GET /admin/music-notes`
- `POST /admin/music-notes`
- `GET /admin/music-notes/:id`
- `PUT /admin/music-notes/:id`
- `DELETE /admin/music-notes/:id`

## Frontend Routes

- `/`
- `/About-Us`
- `/Contact-Us`
- `/Notes`
- `/music-notes/:noteId`
- `/login`
- `/register`
- `/dashboard/admin`

## Environment Variables (Backend)

Create `Backend/.env` and set:

```env
MONGODB_URL=
PORT=5000

BREVO_API=
FROM_EMAIL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

JWT_SECRET=
SESSION_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
CLIENT_URL=
```

Example values for local development:
- `PORT=5000`
- `CLIENT_URL=http://localhost:5173`
- `GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback`

## Local Development Setup

### 1) Install dependencies

```bash
cd Backend
npm install

cd ../Frontend
npm install
```

### 2) Run backend

```bash
cd Backend
npm run dev
```

Backend starts at `http://localhost:5000`.

### 3) Run frontend

```bash
cd Frontend
npm run dev
```

Frontend starts at `http://localhost:5173` (default Vite port).

Note: `Frontend/vite.config.js` proxies `/api` requests to `http://localhost:5000`.

## Available Scripts

### Backend (`Backend/package.json`)
- `npm run dev` - Run server with nodemon
- `npm start` - Run server with nodemon

### Frontend (`Frontend/package.json`)
- `npm run dev` - Start Vite dev server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication Notes

- JWT token is issued on login and Google callback.
- Protected API routes accept token from `Authorization` header or `auth_token` cookie.
- Single active session is enforced: when a new login updates `currentToken`, old tokens become invalid.

## Deployment Notes

- Set `NODE_ENV=production` for secure cookie behavior in OAuth callback.
- Configure CORS and cookie settings for your frontend domain.
- Ensure Cloudinary and MongoDB credentials are set in environment variables.

## Known Improvement Areas

- Add API docs (OpenAPI/Swagger)
- Add automated tests (unit + integration)
- Add role-based guards for admin-only frontend routes
- Replace placeholder `Frontend/README.md` template with project-specific frontend docs

## License

No license file is currently defined in the repository.
New PR change
