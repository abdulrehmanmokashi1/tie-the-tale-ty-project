# 💍 TieTheTale — Wedding Planner

A full-stack wedding planning web app built with React + Node.js + MongoDB.

## Quick Start (Local Development)

### 1. Backend
```bash
cd backend
cp .env.example .env        # Fill in your MongoDB URI & JWT secret
npm install
npm run dev                 # Runs on http://localhost:5000
```

### 2. Seed the Database (first time only)
```bash
cd backend
npm run seed
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env        # Already points to localhost:5000
npm install
npm run dev                 # Runs on http://localhost:5173
```

## Project Structure
```
TieTheTale/
├── backend/          ← Node.js + Express API
└── frontend/         ← React + Vite + Tailwind CSS
```

## Deployment
- **Backend** → Render.com (free)
- **Frontend** → Vercel (free)
- **Database** → MongoDB Atlas (free)

See the deployment guide for step-by-step instructions.
