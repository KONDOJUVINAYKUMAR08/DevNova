# 💎 Lumière – Jewellery Shop (MERN Microservices)

A full-stack jewellery shop web application built with **MERN stack** and **Microservices architecture**, containerized with **Docker**.

## Architecture

```
┌──────────────┐      ┌─────────────────────────────────────────────────┐
│              │      │              Backend Network                    │
│   Browser    │──────│  ┌─────────────┐                                │
│              │      │  │ API Gateway │                                │
│              │      │  │   (Nginx)   │                                │
└──────────────┘      │  │   :80       │                                │
                      │  └──────┬──────┘                                │
    Frontend          │         │                                       │
    Network           │    ┌────┼────┬─────┬─────┬─────┐               │
                      │    │    │    │     │     │     │               │
                      │  ┌─┴─┐┌─┴─┐┌─┴─┐ ┌─┴─┐┌─┴─┐┌─┴─┐           │
                      │  │USR││PRD││RTE│ │ORD││REV││ADM│           │
                      │  │4001│4002│4003│ │4004│4005│4006│           │
                      │  └─┬─┘└─┬─┘└─┬─┘ └─┬─┘└─┬─┘└───┘           │
                      │    │    │    │     │     │                    │
                      │  ┌─┴─┐┌─┴─┐┌─┴─┐ ┌─┴─┐┌─┴─┐                │
                      │  │DB1││DB2││DB3│ │DB4││DB5│  (MongoDB)      │
                      │  └───┘└───┘└───┘ └───┘└───┘                │
                      └─────────────────────────────────────────────────┘
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| API Gateway | 80 | Nginx reverse proxy |
| User Service | 4001 | Auth (JWT), registration, profiles |
| Product Service | 4002 | Jewellery CRUD, categories |
| Rate Service | 4003 | Gold/silver rate management |
| Order Service | 4004 | Customer orders/enquiries |
| Review Service | 4005 | Product reviews |
| Admin Service | 4006 | Dashboard analytics aggregation |
| Frontend | 3000 | Next.js + Tailwind CSS |

## Quick Start

### Prerequisites
- Docker & Docker Compose

### Run
```bash
# Clone and navigate
cd My_project

# Start all services
docker-compose up -d --build

# Open browser
# http://localhost
```

### Stop
```bash
docker-compose down
```

### Reset (with data)
```bash
docker-compose down -v
```

## Development (without Docker)

```bash
# Frontend
cd frontend && npm install && npm run dev

# Each backend service (in separate terminals)
cd backend/user-service && npm install && npm run dev
cd backend/product-service && npm install && npm run dev
# ... repeat for rate, order, review, admin services
```

> **Note:** For local dev without Docker, update MongoDB connection strings in each service to point to your local MongoDB instance.

## Environment Variables

Copy `.env` and adjust values:

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Secret key for JWT tokens |
| `MONGO_URI_*` | MongoDB connection strings |
| `NEXT_PUBLIC_API_URL` | API Gateway URL for frontend |

## Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (per-service isolation)
- **Gateway:** Nginx
- **Containerization:** Docker, Docker Compose
- **Auth:** JWT with bcrypt

## API Endpoints

### User Service (`/api/users`)
- `POST /register` – Register
- `POST /login` – Login
- `GET /profile` – Get profile (auth)
- `GET /` – List all users (admin)

### Product Service (`/api/products`)
- `GET /` – List (filters: category, metal, price, search)
- `GET /featured` – Featured products
- `POST /` – Create (admin)
- `PUT /:id` – Update (admin)
- `DELETE /:id` – Delete (admin)

### Category Service (`/api/categories`)
- `GET /` – List all
- `POST /` – Create (admin)
- `DELETE /:id` – Delete (admin)

### Rate Service (`/api/rates`)
- `GET /` – All rates
- `PUT /` – Update rate (admin)
- `POST /seed` – Seed defaults

### Order Service (`/api/orders`)
- `POST /` – Create order (auth)
- `GET /` – My orders (auth)
- `GET /all` – All orders (admin)
- `PUT /:id/status` – Update status (admin)

### Review Service (`/api/reviews`)
- `POST /` – Create review (auth)
- `GET /product/:id` – Product reviews
- `DELETE /:id` – Delete (admin/owner)
