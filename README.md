# 📚 Inode — Course Management REST API

A RESTful API built with **Node.js**, **Express**, and **MongoDB** for managing courses and users. Features JWT-based authentication, role-based authorization, file uploads, pagination, and input validation.

---

## 🚀 Tech Stack

| Technology            | Purpose                          |
| --------------------- | -------------------------------- |
| **Express 5**         | Web framework & routing          |
| **MongoDB / Mongoose**| Database & ODM                   |
| **JSON Web Tokens**   | Authentication                   |
| **bcryptjs**          | Password hashing                 |
| **Multer**            | File (avatar) uploads            |
| **express-validator** | Request body validation          |
| **CORS**              | Cross-Origin Resource Sharing    |
| **dotenv**            | Environment variable management  |

---

## 📁 Project Structure

```
project/
├── controllers/
│   ├── courses.controllers.js   # CRUD operations for courses
│   └── users.controllers.js     # Register, login, delete & list users
├── middelwhare/
│   ├── allawed.to.js            # Role-based access control middleware
│   ├── asyncwarpper.js          # Async error-handling wrapper
│   └── verifyToken.js           # JWT token verification middleware
├── models/
│   ├── course.model.js          # Mongoose schema for courses
│   └── user.model.js            # Mongoose schema for users
├── utils/
│   ├── apperror.js              # Custom AppError class
│   ├── generate.jwt.js          # JWT generation helper
│   ├── httpStatusText.js        # HTTP status text constants
│   └── Roles.js                 # User role constants (ADMIN, USER, MANGER)
├── uploads/                     # Uploaded avatar images
├── .env                         # Environment variables
├── index.js                     # Application entry point
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** (local instance or Atlas cluster)

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd project

# 2. Install dependencies
npm install

# 3. Configure environment variables
#    Create a .env file in the root with the following:
MONGO_URL=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
PORT=4000

# 4. Start the development server
npm run run:dev
```

The server will start on **http://localhost:4000** (or the port specified in `.env`).

---

## 🔐 Authentication & Authorization

- **JWT Authentication** — Protected routes require a valid token in the `Authorization` header:
  ```
  Authorization: Bearer <token>
  ```
- **Role-Based Access Control** — Three roles are supported:
  | Role      | Permissions                              |
  | --------- | ---------------------------------------- |
  | `USER`    | View courses                             |
  | `MANGER`  | View, create & update courses            |
  | `ADMIN`   | Full access (all operations + user list) |

---

## 📡 API Endpoints

### 👤 Users

| Method   | Endpoint               | Auth     | Role   | Description                 |
| -------- | ---------------------- | -------- | ------ | --------------------------- |
| `POST`   | `/api/users/register`  | ❌ No    | —      | Register a new user (with avatar upload) |
| `POST`   | `/api/users/login`     | ❌ No    | —      | Login & receive JWT token   |
| `GET`    | `/api/users`           | ✅ Yes   | ADMIN  | Get all users (paginated)   |
| `DELETE` | `/api/users/delete`    | ✅ Yes   | —      | Delete own account          |

#### Register — `POST /api/users/register`

**Body** (`multipart/form-data`):
```json
{
  "firstName": "Omar",
  "lastName": "Hany",
  "email": "omar@example.com",
  "password": "securepassword",
  "role": "USER",
  "avatar": "<image file>"
}
```

#### Login — `POST /api/users/login`

**Body** (`application/json`):
```json
{
  "email": "omar@example.com",
  "password": "securepassword"
}
```

**Response**:
```json
{
  "status": "success",
  "data": { "...user object..." },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### 📖 Courses

| Method   | Endpoint                    | Auth     | Role           | Description          |
| -------- | --------------------------- | -------- | -------------- | -------------------- |
| `GET`    | `/api/courses`              | ✅ Yes   | Any            | Get all courses (paginated) |
| `GET`    | `/api/courses/:courseId`    | ✅ Yes   | Any            | Get a single course  |
| `POST`   | `/api/courses`              | ✅ Yes   | ADMIN, MANGER  | Create a new course  |
| `PATCH`  | `/api/courses/:courseId`    | ✅ Yes   | ADMIN, MANGER  | Update a course      |
| `DELETE` | `/api/courses/:courseId`    | ✅ Yes   | ADMIN          | Delete a course      |

#### Create Course — `POST /api/courses`

**Body** (`application/json`):
```json
{
  "title": "Node.js Advanced",
  "price": 49.99
}
```

#### Pagination

Both `GET /api/courses` and `GET /api/users` support pagination via query parameters:

```
GET /api/courses?page=2&limit=5
```

| Param   | Default | Description                |
| ------- | ------- | -------------------------- |
| `page`  | `1`     | Page number                |
| `limit` | `10`    | Number of items per page   |

---

## 🖼️ File Uploads

- Avatar images are uploaded during user registration via **Multer**.
- **Accepted formats**: `png`, `jpg`, `jpeg`, `avif`, `webp`
- **Max file size**: 1 MB
- Uploaded files are stored in the `uploads/` directory and served statically at `/uploads/<filename>`.

---

## 🛡️ Error Handling

The API uses a consistent JSON error response format:

```json
{
  "status": "fail",
  "data": null,
  "message": "Descriptive error message"
}
```

| Status    | Meaning                               |
| --------- | ------------------------------------- |
| `success` | Request completed successfully        |
| `fail`    | Client-side error (validation, auth)  |
| `error`   | Server-side error                     |

---

## 📜 Scripts

| Script          | Command              | Description                  |
| --------------- | -------------------- | ---------------------------- |
| `run:dev`       | `npm run run:dev`    | Start dev server with Nodemon |

---

## 📄 License

This project is licensed under the **ISC** License.
