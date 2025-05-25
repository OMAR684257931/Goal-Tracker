# 🧠 GoalTracker API (Backend)

Smart Personal & Public Goal Management System — built with **NestJS**, **PostgreSQL**, and **Docker**.

This API handles:

* 🔐 Authentication (JWT)
* 🧹 Hierarchical goal creation (up to 2 levels)
* 🌍 Public goal sharing via `publicId`
* 📂 Full CRUD with user ownership enforcement
* 📑 API Documentation via Swagger

---

## 🚀 Stack

| Layer     | Tech                         |
| --------- | ---------------------------- |
| Framework | [NestJS](https://nestjs.com) |
| Database  | PostgreSQL + TypeORM         |
| Auth      | JWT-based Authentication     |
| Docs      | Swagger UI                   |
| Dev Tools | Docker, Mailhog, PgAdmin     |
| Testing   | Jest                         |

---

## 📁 Project Structure

```
src/
├── auth/           # Login, Register, JWT, Guard
├── goals/          # Goal entity, controller, service
├── users/          # User entity and service
├── seeder.ts       # Simple user seeding
├── main.ts         # App bootstrap
```

---

## 📦 Installation

### ▶️ Local Setup

```bash
# 1. Clone the project
git clone https://github.com/yourname/goaltracker-api.git
cd goaltracker-api

# 2. Start with Docker
docker-compose up --build
```

### 🌐 Access Services

| Service | URL                                                    |
| ------- | ------------------------------------------------------ |
| API     | [http://localhost:3000](http://localhost:3000)         |
| Swagger | [http://localhost:3000/api](http://localhost:3000/api/doc) |
| Mailhog | [http://localhost:8025](http://localhost:8025)         |
| PgAdmin | [http://localhost:5050](http://localhost:5050)         |

---

## 🔑 Authentication

Use the following endpoints to authenticate:

```http
POST /auth/register
POST /auth/login
GET  /auth/profile  (with Bearer token)
```

> Store the token in `localStorage` or `Authorization: Bearer <token>` for frontend.

---

## 🧹 Goals API

Each goal has:

```ts
{
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO
  isPublic: boolean;
  parentId?: string;
  order: number;
  publicId?: string;
  ownerId: string;
}
```

### Endpoints:

```http
GET    /goals              # Private goals for authenticated user
POST   /goals              # Create new goal (max depth: 2)
PUT    /goals/:id          # Update your goal
DELETE /goals/:id          # Delete your goal

GET    /goals/public-goals           # Public goals
GET    /goals/public-goals/:publicId # View a public goal by ID
```

---

## 🧪 Running Tests

```bash
# Unit tests
npm run test
```

All services like `GoalsService` are tested with mocks, including edge cases (unauthorized, not found, nesting logic).

---

## 🐳 Docker Setup

Ensure Docker is installed, then:

```bash
docker-compose up
```

### Environment (`.env` or docker-compose)

```
POSTGRES_DB=goaltracker
POSTGRES_USER=root
POSTGRES_PASSWORD=root
JWT_SECRET=supersecure
JWT_EXPIRATION=3600s
```

---

## ✅ Why PostgreSQL?

✅ Strong data integrity
✅ Native UUID & JSON support
✅ Used with TypeORM for full relation modeling
✅ Ideal for recursive/nested structure with self-relations

---

## 🔖 Features

* ⛓ JWT auth with route guards
* 👎 Parent-child goal nesting (2-level enforced)
* 🧐 Public ID sharing for public goals
* 🛡️ Authorization logic on update/delete
* 📑 Swagger API docs at `/api`
* ✅ Clean, testable service structure

---

## 📌 Known Limitations

* ❌ No email confirmation (but Mailhog ready)
* 📬 No pagination on public goals yet
* 🧱 Drag/drop logic handled only on frontend
* 🔒 No refresh tokens (only access token)

---

## 👨‍💼 Author

**Omar Eid**
Senior Full Stack Developer — Laravel | NestJS | Angular | Docker
🔗 [linkedin.com/in/omar-eid](https://linkedin.com/in/omar-eid)

---

