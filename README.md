# Rangrez Indian Kitchen

A colorful Indian restaurant website and reservation demo built with MongoDB, Express, React, and Node.js.

## Included

- Responsive Indian restaurant landing page with story, special offer, seven-photo gallery, private dining, and contact details
- Filterable menu with 10 Indian dishes, dietary labels, and INR prices
- Reservation form with date, time, party size, occasion, offer code, and contact details
- Newsletter signup
- Express REST API backed by MongoDB when `MONGODB_URI` is configured
- Demo mode with sample menu and in-memory reservation/newsletter submissions when MongoDB is not configured

## Run locally

Requirements: Node.js 20+ and npm. MongoDB is optional for the demo.

1. Install dependencies from this folder:

   ```bash
   npm install
   npm install --prefix frontend
   npm install --prefix backend
   ```

2. (Optional) Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`.

3. Start the frontend and API together:

   ```bash
   npm run dev
   ```

Open the Vite URL printed in the terminal (usually `http://localhost:5173`). The API runs at `http://localhost:5000`.

To use alternate ports when those defaults are busy, run the API and web commands in separate terminals:

```powershell
$env:PORT='5001'; npm run dev --prefix backend
$env:WEB_PORT='5174'; $env:API_PROXY_TARGET='http://localhost:5001'; npm run dev --prefix frontend
```

## API

- `GET /api/health` — API and database mode
- `GET /api/menu` — menu items, optionally filtered with `?category=Pasta`
- `POST /api/reservations` — create a reservation request
- `POST /api/newsletter` — subscribe an email address

Set `VITE_API_URL` in `frontend/.env` to use a different API origin. Restaurant details and sample copy can be edited in `frontend/src/App.jsx` and `frontend/src/data/menu.js`. The current Connaught Place address, phone number, email, and gallery photos are demo placeholders; swap in the restaurant's actual contact details and photos before launch.

To load the sample menu into a configured MongoDB database, run `npm run seed --prefix backend` after setting `backend/.env`. The seed command updates the sample dishes by name and leaves other menu records intact.

## Deploy to Render

The `render.yaml` Blueprint in this folder creates the Node API and React static site. In Render, create a Blueprint from the Git repository and set the Blueprint path to `Sorella-Ristorante/render.yaml`. To keep reservations and newsletter signups persistent, add `MONGODB_URI` to the API service in Render and provide a MongoDB Atlas connection string. If it is left unset, the site uses demo mode and submissions are held in memory only.
