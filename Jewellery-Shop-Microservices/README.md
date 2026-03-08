<div align="center">

# 💎 Lumière – Jewellery Shop

### A Premium MERN Microservices E-Commerce Platform

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**Lumière** is a full-stack jewellery e-commerce application built with the **MERN stack** and a **microservices architecture**. Each business domain runs as an independent service with its own database, orchestrated via Docker Compose, and served through an Nginx API gateway.

[Getting Started](#-quick-start) · [Architecture](#-architecture) · [API Reference](#-api-reference) · [Deployment](#-deployment)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🛍️ Customer Experience
- 🔍 Browse & search jewellery by category, metal type, and price
- 📦 View featured and curated collections
- ⭐ Read & write product reviews
- 📋 Place orders and track status in real-time
- 📈 Live gold & silver rate ticker
- 🔐 Secure registration & login with JWT

</td>
<td width="50%">

### 🛠️ Admin Dashboard
- 📊 Aggregated analytics across all services
- 🏷️ Full CRUD on products & categories
- 💰 Update gold/silver/platinum rates
- 📦 Manage & update order statuses
- 👥 View all registered customers
- 🗑️ Moderate & delete reviews

</td>
</tr>
</table>

---

## 🏗️ Architecture

The application follows a **microservices pattern** with **3-tier network isolation**. Traffic flows from the browser through Nginx, to backend services, and finally to isolated database containers. No layer can skip a tier.

| Network | Purpose | Members |
|:--------|:--------|:--------|
| `frontend-network` | Browser ↔ Gateway ↔ Frontend | API Gateway, Next.js Frontend |
| `backend-network` | Gateway ↔ Services | API Gateway, all 6 microservices |
| `database-network` | Services ↔ Databases | 5 backend services + their MongoDB instances |

> **🔒 Security:** Databases are completely isolated from the gateway and frontend — only their owning service can reach them.

```
  ┌──────────┐
  │ Browser  │
  └────┬─────┘
       │ :80
═══════╪══════════════════════════════════════════════  frontend-network
       │
  ┌────▼──────────────┐       ┌──────────────────┐
  │   API Gateway     │       │ Frontend (Next.js)│
  │   (Nginx)         │       │  :3000            │
  └────┬──────────────┘       └──────────────────┘
       │
═══════╪══════════════════════════════════════════════  backend-network
       │
  ┌────┴──────────────────────────────────────────┐
  │         │             │           │            │
  ▼         ▼             ▼           ▼            ▼
┌──────┐ ┌─────────┐ ┌────────┐ ┌────────┐ ┌────────┐   ┌──────────────┐
│ User │ │ Product │ │  Rate  │ │ Order  │ │ Review │   │ Admin :4006  │
│:4001 │ │  :4002  │ │ :4003  │ │ :4004  │ │ :4005  │   │ (aggregator) │
└──┬───┘ └───┬─────┘ └───┬────┘ └───┬────┘ └───┬────┘   └──────────────┘
   │         │            │          │           │
═══╪═════════╪════════════╪══════════╪═══════════╪════  database-network
   │         │            │          │           │
   ▼         ▼            ▼          ▼           ▼
┌──────┐ ┌─────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│Mongo │ │  Mongo  │ │ Mongo  │ │ Mongo  │ │ Mongo  │
│(user)│ │(product)│ │ (rate) │ │(order) │ │(review)│
└──────┘ └─────────┘ └────────┘ └────────┘ └────────┘
```

---

## 📂 Project Structure

```
Jewellery-Shop-Microservices/
├── 📄 docker-compose.yml          # Orchestrates all services
├── 📄 .env                        # Environment variables
├── 📄 DEPLOYMENT.md               # AWS EC2 deployment guide
│
├── 🖥️  frontend/                   # Next.js + Tailwind CSS
│   ├── src/
│   │   ├── pages/                 # index, login, register, collections, rates, my-orders, admin/
│   │   ├── components/            # Navbar, Footer, ProductCard, RatesTicker
│   │   ├── context/               # AuthContext (JWT state management)
│   │   ├── utils/                 # API helper (Axios instance)
│   │   └── styles/                # Global CSS
│   ├── Dockerfile
│   └── package.json
│
└── ⚙️  backend/
    ├── api-gateway/               # Nginx config & Dockerfile
    ├── user-service/              # Auth, registration, profiles
    ├── product-service/           # Products & categories CRUD
    ├── rate-service/              # Gold/silver/platinum rates
    ├── order-service/             # Customer orders & enquiries
    ├── review-service/            # Product reviews
    └── admin-service/             # Dashboard analytics aggregation
```

---

## 🧩 Services Overview

| Service | Port | Database | Responsibilities |
|:--------|:----:|:--------:|:-----------------|
| **API Gateway** | `80` | — | Nginx reverse proxy, request routing |
| **User Service** | `4001` | `jewellery-users` | JWT auth, registration, user profiles |
| **Product Service** | `4002` | `jewellery-products` | Product & category CRUD, filtering, search |
| **Rate Service** | `4003` | `jewellery-rates` | Gold / silver / platinum live rates |
| **Order Service** | `4004` | `jewellery-orders` | Customer orders, status tracking |
| **Review Service** | `4005` | `jewellery-reviews` | Product reviews & ratings |
| **Admin Service** | `4006` | — | Aggregated dashboard analytics |
| **Frontend** | `3000` | — | Next.js 14, React 18, Tailwind CSS |

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | 20.10+ |
| [Docker Compose](https://docs.docker.com/compose/install/) | 2.0+ |

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Jewellery-Shop-Microservices
```

### 2. Configure Environment

```bash
# Review and update the .env file
# At minimum, set a strong JWT_SECRET
nano .env
```

### 3. Build & Launch

```bash
docker-compose up -d --build
```

### 4. Seed Initial Data

```bash
# Seed default gold/silver/platinum rates
curl -X POST http://localhost/api/rates/seed
```

### 5. Open in Browser

```
http://localhost
```

> **🎉 That's it!** All 6 microservices, 5 databases, the frontend, and the API gateway are now running.

### ⏹️ Stop / Reset

```bash
# Stop all services (data preserved)
docker-compose down

# Stop and delete all data volumes
docker-compose down -v
```

---

## 💻 Local Development (Without Docker)

> **Note:** You'll need a local MongoDB instance running on `mongodb://localhost:27017`.

```bash
# ── Frontend ──
cd frontend && npm install && npm run dev

# ── Backend (open a separate terminal for each) ──
cd backend/user-service    && npm install && npm run dev   # :4001
cd backend/product-service && npm install && npm run dev   # :4002
cd backend/rate-service    && npm install && npm run dev   # :4003
cd backend/order-service   && npm install && npm run dev   # :4004
cd backend/review-service  && npm install && npm run dev   # :4005
cd backend/admin-service   && npm install && npm run dev   # :4006
```

Update `MONGO_URI` in each service's config to point to your local MongoDB.

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|:---------|:--------|:------------|
| `JWT_SECRET` | `lumiere_jwt_secret_key_2024` | **Change this in production!** Secret for signing JWTs |
| `MONGO_URI` | `mongodb://<service>-db:27017/...` | Per-service MongoDB URI (auto-configured in Docker) |
| `NEXT_PUBLIC_API_URL` | `http://localhost` | Public URL of the API gateway |

---

## 📡 API Reference

All endpoints are accessed through the API gateway at `http://localhost`.

<details>
<summary><strong>👤 User Service</strong> — <code>/api/users</code></summary>

| Method | Endpoint | Auth | Description |
|:------:|:---------|:----:|:------------|
| `POST` | `/api/users/register` | ❌ | Register a new account |
| `POST` | `/api/users/login` | ❌ | Login & receive JWT |
| `GET` | `/api/users/profile` | 🔒 | Get current user profile |
| `GET` | `/api/users/` | 🔒 Admin | List all users |

</details>

<details>
<summary><strong>💍 Product Service</strong> — <code>/api/products</code></summary>

| Method | Endpoint | Auth | Description |
|:------:|:---------|:----:|:------------|
| `GET` | `/api/products/` | ❌ | List products (filters: `category`, `metal`, `price`, `search`) |
| `GET` | `/api/products/featured` | ❌ | Get featured products |
| `POST` | `/api/products/` | 🔒 Admin | Create a product |
| `PUT` | `/api/products/:id` | 🔒 Admin | Update a product |
| `DELETE` | `/api/products/:id` | 🔒 Admin | Delete a product |

</details>

<details>
<summary><strong>🏷️ Category Service</strong> — <code>/api/categories</code></summary>

| Method | Endpoint | Auth | Description |
|:------:|:---------|:----:|:------------|
| `GET` | `/api/categories/` | ❌ | List all categories |
| `POST` | `/api/categories/` | 🔒 Admin | Create a category |
| `DELETE` | `/api/categories/:id` | 🔒 Admin | Delete a category |

</details>

<details>
<summary><strong>📈 Rate Service</strong> — <code>/api/rates</code></summary>

| Method | Endpoint | Auth | Description |
|:------:|:---------|:----:|:------------|
| `GET` | `/api/rates/` | ❌ | Get all metal rates |
| `PUT` | `/api/rates/` | 🔒 Admin | Update a metal rate |
| `POST` | `/api/rates/seed` | ❌ | Seed default rate data |

</details>

<details>
<summary><strong>📦 Order Service</strong> — <code>/api/orders</code></summary>

| Method | Endpoint | Auth | Description |
|:------:|:---------|:----:|:------------|
| `POST` | `/api/orders/` | 🔒 | Place a new order |
| `GET` | `/api/orders/` | 🔒 | Get my orders |
| `GET` | `/api/orders/all` | 🔒 Admin | Get all orders |
| `PUT` | `/api/orders/:id/status` | 🔒 Admin | Update order status |

</details>

<details>
<summary><strong>⭐ Review Service</strong> — <code>/api/reviews</code></summary>

| Method | Endpoint | Auth | Description |
|:------:|:---------|:----:|:------------|
| `POST` | `/api/reviews/` | 🔒 | Submit a review |
| `GET` | `/api/reviews/product/:id` | ❌ | Get reviews for a product |
| `DELETE` | `/api/reviews/:id` | 🔒 | Delete review (admin/owner) |

</details>

> **Legend:** ❌ = Public &nbsp;|&nbsp; 🔒 = Requires JWT &nbsp;|&nbsp; 🔒 Admin = Requires JWT + Admin role

---

## 🚢 Deployment

For production deployment on **AWS EC2 (Ubuntu)**, see the full step-by-step guide:

➡️ **[DEPLOYMENT.md](./DEPLOYMENT.md)**

**Quick summary:**
1. Launch an Ubuntu 22.04 `t2.medium`+ EC2 instance
2. Install Docker & Docker Compose
3. Clone the repo, configure `.env` with a strong `JWT_SECRET`
4. Run `docker compose up -d --build`
5. *(Optional)* Set up a custom domain and SSL with Certbot

---

## 🛡️ Tech Stack

| Layer | Technology |
|:------|:-----------|
| **Frontend** | Next.js 14, React 18, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB 7 (per-service isolation) |
| **API Gateway** | Nginx |
| **Auth** | JWT + bcrypt |
| **Containerization** | Docker, Docker Compose |
| **Deployment** | AWS EC2 (Ubuntu) |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ using the MERN Stack**

*Lumière — Where elegance meets technology*

</div>
