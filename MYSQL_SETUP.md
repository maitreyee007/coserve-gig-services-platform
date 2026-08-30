# CoServe local setup

1. Install and start MySQL 8.
2. Copy `backend/.env.example` to `backend/.env` and set the MySQL credentials and a long `JWT_SECRET`.
3. Install dependencies and start the API:

```powershell
cd backend
npm install
npm start
```

The API creates the `coserve` database and core tables on first startup, then seeds demo services, users, cooperatives, and a verified worker. Demo passwords are `demo123`.

Start the existing Vite frontend in another terminal:

```powershell
npm run dev
```

The frontend uses `VITE_API_URL` when set and otherwise calls `http://localhost:5000/api`.

Core endpoints currently backed by MySQL:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/services` and `GET /api/services/:id`
- `GET /api/workers` and `GET /api/workers/:id`
- `POST /api/bookings`, `GET /api/bookings/my`, `PUT /api/bookings/:id/accept`, `PATCH /api/bookings/:id/status`, `PUT /api/bookings/:id/cancel`
- `POST /api/reviews`
- `GET /api/admin/dashboard`
