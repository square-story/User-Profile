# User Profile Management System

A robust, full-stack User Profile Management System built with a secure, scalable architecture. This project features a **Next.js** frontend with **Shadcn/UI** and an **Express** backend using **Clean Architecture** and **InversifyJS** for dependency injection.

Designed for production readiness, it includes JWT cookie-based authentication, RBAC (Role-Based Access Control), email notifications, and a serverless-ready deployment structure for Vercel.

## 🚀 Key Features

### 🔐 Authentication & Security
*   **Secure Auth**: JWT-based authentication using HTTP-only cookies (Access & Refresh tokens).
*   **RBAC**: Role-Based Access Control protecting Admin routes (`adminMiddleware`).
*   **Security Headers**: Integrated `helmet` and CORS configuration for security.
*   **Password Hashing**: `bcryptjs` for secure password storage.

### 👤 User Profile Management
*   **Profile Operations**: View, edit, and update user profiles.
*   **Avatar Management**: (Planned/Implemented) Support for profile pictures.
*   **Password Management**: Change password and "Forgot Password" flows integrated with email.

### 📧 Notifications & Emails
*   **Email System**: `Nodemailer` integration for sending verification, password reset, and login alert emails.
*   **In-App Notifications**: Real-time accessible notifications stored in MongoDB (Capped Collections for efficiency).

### 🛠 Architecture & Code Quality
*   **Clean Architecture**: Backend organized into *Controllers*, *Services*, and *Repositories* with *Dependency Injection* (InversifyJS).
*   **Type Safety**: Full TypeScript support across both frontend and backend.
*   **Centralized Frontend Services**: API calls abstracted into `authService`, `profileService`, etc.
*   **Modern UI**: Built with `Next.js 15` (App Router), `Tailwind CSS`, and `Shadcn/UI` components (Tabs, Cards, Forms).

---

## 🏗 Tech Stack

### Frontend (`apps/frontend`)
*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **State Management**: Zustand
*   **Styling**: Tailwind CSS, Shadcn/UI (Radix UI)
*   **Form Handling**: React Hook Form + Zod validation
*   **API Client**: Axios

### Backend (`apps/backend`)
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Language**: TypeScript
*   **Database**: MongoDB (Mongoose), using connection caching for Serverless.
*   **DI Container**: InversifyJS
*   **Email**: Nodemailer

---

## 📂 Project Structure

This is a monorepo setup containing both frontend and backend applications.

```
User-Profile/
├── apps/
│   ├── backend/                 # Express Server
│   │   ├── src/
│   │   │   ├── config/          # Environment & Database config
│   │   │   ├── controllers/     # Request handlers
│   │   │   ├── services/        # Business logic
│   │   │   ├── repositories/    # Data access layer
│   │   │   ├── models/          # Mongoose schemas
│   │   │   ├── middlewares/     # Auth & Error handling
│   │   │   ├── interfaces/      # Type definitions (SOLID)
│   │   │   └── app.ts           # App setup
│   │   ├── api/                 # Vercel Serverless Entry point
│   │   └── vercel.json          # Deployment config
│   │
│   └── frontend/                # Next.js Client
│       ├── src/
│       │   ├── app/             # App Router pages
│       │   ├── components/      # Reusable UI components
│       │   ├── features/        # Feature-based modular components
│       │   ├── services/        # API service modules
│       │   ├── store/           # Zustand stores
│       │   └── lib/             # Utilities (Axios, etc.)
```

---

## ⚡ Getting Started

### Prerequisites
*   Node.js (v18+)
*   PNPM (Package Manager)
*   MongoDB Instance (Local or Atlas)

### 1. Installation

```bash
# Install dependencies for root (if configured) or individual apps
cd apps/backend && pnpm install
cd ../../apps/frontend && pnpm install
```

### 2. Environment Setup

Create `.env` files in both `apps/backend` and `apps/frontend`.

**Backend (`apps/backend/.env`)**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/user-profile
JWT_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
ALLOWED_ORIGINS=http://localhost:3000
```

**Frontend (`apps/frontend/.env`)**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api
```

### 3. Running Locally

**Backend**
```bash
cd apps/backend
pnpm dev
# Server runs on http://localhost:5000
```

**Frontend**
```bash
cd apps/frontend
pnpm dev
# Client runs on http://localhost:3000
```

---

## 📜 API Documentation (Overview)

The backend exposes a RESTful API. Key endpoints include:

*   **Auth**:
    *   `POST /api/auth/register` - Create account
    *   `POST /api/auth/login` - Sign in (Sets HttpOnly cookies)
    *   `POST /api/auth/logout` - Sign out
    *   `POST /api/auth/refresh` - Refresh access token
    *   `POST /api/auth/forgot-password` - Request reset link
*   **Profile**:
    *   `GET /api/profile` - Get current user profile
    *   `PUT /api/profile` - Update profile details
*   **Admin** (Protected):
    *   `GET /api/admin/users` - List all users
    *   `PATCH /api/admin/users/:id/status` - Block/Unblock user
