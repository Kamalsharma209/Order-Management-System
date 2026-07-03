# Order Management System

A production-ready mini Order Management System built with Node.js, Express, React, MongoDB, and Tailwind CSS.

## Tech Stack

| Layer       | Technology                    |
| ----------- | ----------------------------- |
| Backend     | Node.js, Express.js           |
| Frontend    | React 18, Vite, Tailwind CSS  |
| Database    | MongoDB, Mongoose ODM         |
| Scheduler   | node-cron                     |
| Validation  | express-validator             |

---

## Features

- **Order CRUD** — Create, read, update, delete orders with auto-generated order IDs
- **Status Workflow** — PLACED → PROCESSING → READY_TO_SHIP with full history tracking
- **Automated Scheduler** — node-cron runs every 5 minutes to auto-promote order statuses
- **Secure Scheduler API** — Trigger scheduler on-demand with `x-secret-key` authentication
- **Status History** — Every status change is logged in a separate collection
- **Search & Pagination** — Search by Order ID / Customer Name, paginated results
- **Dashboard Analytics** — Cards showing total orders, status breakdown, payment split
- **Dark Mode** — Toggle between light and dark themes
- **Toast Notifications** — Real-time feedback for all actions
- **Race Condition Safe** — `findOneAndUpdate` prevents duplicate scheduler updates
- **Duplicate Prevention** — Unique index on `orderId` field
- **Centralized Error Handling** — Consistent error responses with proper status codes
- **Request Validation** — All inputs validated via express-validator

---

## Folder Structure

```
project
├── backend/
│   ├── src/
│   │   ├── config/           # DB connection, constants
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/        # Error handler, auth, async wrapper
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express route definitions
│   │   ├── scheduler/        # Cron job setup
│   │   ├── services/         # Business logic layer
│   │   ├── utils/            # Helpers (order ID generator)
│   │   ├── validations/      # express-validator rules
│   │   ├── app.js            # Express app setup
│   │   └── server.js         # Entry point
│   ├── .env                  # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios client & API functions
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React context (Toast)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Route pages
│   │   ├── utils/            # Formatters, constants
│   │   ├── App.jsx           # Root component with routing
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## Installation

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm

### 1. Clone & Install

```bash
git clone <repo-url>
cd project

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Variables

Create `backend/.env`:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/oms
SCHEDULER_SECRET=your-super-secret-key
NODE_ENV=development
```

### 3. Start MongoDB

```bash
mongod
# or use MongoDB Atlas connection string in .env
```

### 4. Run the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- Backend: `http://localhost:5001`
- Frontend: `http://localhost:3000`

---

## API Documentation

### Health Check

```
GET /api/health
```

### Orders

| Method | Endpoint              | Description           |
| ------ | --------------------- | --------------------- |
| POST   | /api/orders           | Create a new order    |
| GET    | /api/orders           | List all orders       |
| GET    | /api/orders/stats     | Get order statistics  |
| GET    | /api/orders/:id       | Get single order      |
| PUT    | /api/orders/:id       | Update an order       |
| DELETE | /api/orders/:id       | Delete an order       |

#### POST /api/orders

```json
{
  "customerName": "John Doe",
  "phoneNumber": "+91-9876543210",
  "productName": "Wireless Headphones",
  "amount": 2499,
  "paymentStatus": "PAID"
}
```

#### GET /api/orders?status=PLACED&page=1&limit=10&search=John

Query parameters:

| Param  | Type   | Description                          |
| ------ | ------ | ------------------------------------ |
| status | string | Filter by PLACED / PROCESSING / READY_TO_SHIP |
| page   | number | Page number (default: 1)             |
| limit  | number | Items per page (default: 10, max: 100) |
| search | string | Search by orderId or customerName    |

#### PUT /api/orders/:id

```json
{
  "orderStatus": "PROCESSING"
}
```

### Scheduler

| Method | Endpoint               | Description                          |
| ------ | ---------------------- | ------------------------------------ |
| POST   | /api/scheduler/run     | Manually trigger scheduler (protected) |
| GET    | /api/scheduler/logs    | Get scheduler execution logs         |

**POST /api/scheduler/run** requires header:

```
x-secret-key: <SCHEDULER_SECRET from .env>
```

### Response Format

```json
{
  "success": true,
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Order not found"
}
```

---

## Scheduler Setup

The cron job runs **every 5 minutes** using `node-cron`.

**Logic:**

| From Status | To Status       | Condition                             |
| ----------- | --------------- | ------------------------------------- |
| PLACED      | PROCESSING      | `createdAt` older than 10 minutes     |
| PROCESSING  | READY_TO_SHIP   | `updatedAt` older than 20 minutes     |

**Logging:** Every execution creates a `SchedulerLog` document tracking start/end time, orders checked, orders updated, and status.

**Manual Trigger:**
```bash
curl -X POST http://localhost:5001/api/scheduler/run \
  -H "x-secret-key: your-super-secret-key"
```

---

## Database Design

### Collections

#### Orders

| Field         | Type   | Constraints                     |
| ------------- | ------ | ------------------------------- |
| orderId       | String | Unique, indexed, auto-generated |
| customerName  | String | Required                        |
| phoneNumber   | String | Required                        |
| productName   | String | Required                        |
| amount        | Number | Required, min 0                 |
| paymentStatus | String | ENUM: PAID / PENDING            |
| orderStatus   | String | ENUM: PLACED / PROCESSING / READY_TO_SHIP |
| createdAt     | Date   | Auto (timestamps)               |
| updatedAt     | Date   | Auto (timestamps)               |

Indexes:
- `{ orderId: 1 }` — unique
- `{ orderStatus: 1, createdAt: 1 }` — compound for scheduler queries
- `{ customerName: 'text', orderId: 'text' }` — text search

#### OrderStatusHistory

| Field          | Type   |
| -------------- | ------ |
| orderId        | String |
| previousStatus | String |
| newStatus      | String |
| changedAt      | Date   |

Indexes:
- `{ orderId: 1, changedAt: -1 }`

#### SchedulerLogs

| Field          | Type   |
| -------------- | ------ |
| startedAt      | Date   |
| endedAt        | Date   |
| checkedOrders  | Number |
| updatedOrders  | Number |
| status         | String |
| errorMessage   | String |

Indexes:
- `{ startedAt: -1 }`

---

## System Design

### Architecture

```
┌──────────────┐      ┌─────────────────┐      ┌──────────────┐
│   React App  │─────▶│  Express API    │─────▶│   MongoDB    │
 │  (Vite, 3000)│      │  (Port 5001)    │      │              │
└──────────────┘      └─────────────────┘      └──────────────┘
                              │
                      ┌───────┴───────┐
                      │  node-cron    │
                      │  (Every 5min) │
                      └───────────────┘
```

### Data Flow

1. **User** interacts with **React frontend** (port 3000)
2. Vite proxies `/api/*` requests to **Express backend** (port 5001)
3. Express validates input → calls **service layer** (business logic)
4. Service layer interacts with **Mongoose models** (MongoDB)
5. **node-cron** runs independently every 5 minutes, querying orders and updating statuses
6. Status changes automatically create **OrderStatusHistory** documents

---

## Scaling Strategy

### Database
- **Indexes** — Compound indexes for frequent query patterns (status + createdAt)
- **Text Index** — Search by orderId or customerName
- **Pagination** — Server-side skip/limit to avoid large payloads
- **Aggregation** — Stats computed via MongoDB aggregation pipeline (fast, no application-level loops)

### Backend
- **Stateless API** — No in-memory session state; scales horizontally
- **Service Layer** — Business logic isolated from controllers; easy to test and swap
- **Async Everywhere** — `asyncHandler` wraps all route handlers; no unhandled promise rejections
- **Centralized Error Handler** — Consistent error formatting; easy to integrate with monitoring

### Frontend
- **Component Reusability** — Shared `OrderTable`, `Pagination`, `SearchBar`, `LoadingSpinner`
- **Custom Hook** — `useOrders` encapsulates data fetching, loading, error state
- **Context** — Toast notifications via `ToastContext`
- **Vite Proxy** — No CORS issues in development; single deployable in production

### Production Deployment
- **Reverse Proxy** — Nginx/Caddy in front of Express
- **Process Manager** — PM2 or Docker for process management and auto-restart
- **MongoDB Atlas** — Managed database with auto-scaling
- **CDN** — Serve built frontend assets via CDN
- **Environment Config** — All secrets in environment variables, never in code

---

## Race Condition Handling

The scheduler uses **optimistic concurrency** via `findOneAndUpdate`:

```js
const result = await Order.findOneAndUpdate(
  { _id: order._id, orderStatus: 'PLACED' },   // condition check
  { $set: { orderStatus: 'PROCESSING' } },      // atomic update
  { new: true }
);
```

This ensures only **one** scheduler execution can update the same order at a time because:
1. The query includes the current `orderStatus` as a filter
2. Mongoose returns `null` if the document doesn't match the filter (already updated by another process)
3. The order is only processed if `result` is not null

For more advanced scenarios, MongoDB **transactions** can be used to atomically update the order and insert the history document.

---

## Duplicate Prevention

- **`orderId`** has a `unique: true` index in the Mongoose schema
- MongoDB enforces uniqueness at the database level — no race condition can create duplicates
- Error handler catches `E11000` duplicate key errors and returns a 409 status

---

## Frontend Routes

| Path            | Page            | Description              |
| --------------- | --------------- | ------------------------ |
| `/`             | Dashboard       | Stats cards + recent orders |
| `/orders`       | Orders          | Full order management    |
| `/scheduler-logs` | Scheduler Logs | Scheduler execution history |

---

## License

MIT
