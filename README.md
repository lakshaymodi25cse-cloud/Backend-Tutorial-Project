# Backend Tutorial Project (Node.js + Express + MongoDB)

> College Assignment for 3rd Evaluation | B.Tech Computer Science  
> Based on the tutorial: [Intro to Backend Web Development – Node.js & Express Tutorial for Beginners](https://www.youtube.com/watch?v=KOutPbKc9UM)

---

## 📌 Project Overview

This project is a modular, RESTful backend application built using **Node.js**, **Express.js**, and **MongoDB Atlas** with **Mongoose**. It implements the **Model-Route-Controller (MRC)** architectural pattern.

The API supports:
- Full **CRUD** operations for blog/forum posts (Create, Read, Update, Delete).
- User authentication with **password hashing and verification using `bcrypt`**.
- Input validation, MongoDB `ObjectId` checking, and custom error handling.
- Environment variable configuration with `dotenv`.

---

## 🛠️ Tech Stack

- **Runtime Environment:** [Node.js](https://nodejs.org/) (ES Modules)
- **Web Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas) (Cloud NoSQL Database)
- **Object Data Modeling (ODM):** [Mongoose](https://mongoosejs.com/)
- **Password Security:** [bcrypt](https://www.npmjs.com/package/bcrypt)
- **Environment Management:** [dotenv](https://www.npmjs.com/package/dotenv)
- **Development Utility:** [nodemon](https://www.npmjs.com/package/nodemon)

---

## 📂 Project Structure

```text
Backend-Tutorial-Project/
│
├── src/
│   ├── config/
│   │   ├── constants.js       # Centralized environment constants (PORT, MONGODB_URI)
│   │   └── database.js        # Mongoose connection configuration
│   ├── controllers/
│   │   ├── post.controller.js # CRUD business logic for Posts
│   │   └── user.controller.js # Registration & Login logic with bcrypt
│   ├── models/
│   │   ├── post.model.js      # Post Mongoose schema (title, content, timestamps)
│   │   └── user.model.js      # User Mongoose schema (username, email, password)
│   ├── routes/
│   │   ├── post.route.js      # Express routes for /api/posts
│   │   └── user.route.js      # Express routes for /api/users
│   ├── app.js                 # Express application setup, middlewares, and 404 handler
│   └── index.js               # Application entry point (DB connection & server listen)
│
├── .env                       # Local environment variables (IGNORED by Git)
├── .env.example               # Template for environment variables
├── .gitignore                 # Files and folders excluded from Git
├── package.json               # Dependencies and npm scripts
├── verify-api.js              # Automated end-to-end API test script
└── README.md                  # Project documentation
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd Backend-Tutorial-Project
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root directory (you can copy `.env.example`):

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=4000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/BackendDB?retryWrites=true&w=majority
```

> ⚠️ **Important MongoDB Atlas Configuration**:
> 1. In MongoDB Atlas, go to **Database Access** and verify your database user has **Read and write to any database** privileges.
> 2. If your password has special characters (`@`, `:`, `#`), ensure they are URL-encoded.
> 3. In MongoDB Atlas, go to **Network Access** and ensure your IP address is whitelisted (or choose `0.0.0.0/0` to allow connections from anywhere for testing).

---

## 🚀 Running the Server

### Development Mode (with hot-reloading via Nodemon):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

When started successfully, the terminal will display:
```text
MongoDB Connected Successfully: cluster0-shard-...
Server running on port 4000
```

---

## 🧪 Testing the APIs

You can run the automated verification script:
```bash
npm test
```
This tests all CRUD routes, password hashing, login, and error validations against your database.

---

## 📡 API Endpoints & Documentation

Base URL: `http://localhost:4000`

### 1. Health Check
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Checks if the backend server is running | `200 OK` |

---

### 2. Post APIs (CRUD Operations)

#### A. Create a Post
- **Endpoint:** `POST /api/posts`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "title": "My First Post",
    "content": "This is the content of my first post."
  }
  ```
- **Success Response (`201 Created`):**
  ```json
  {
    "_id": "673b5a1b...",
    "title": "My First Post",
    "content": "This is the content of my first post.",
    "createdAt": "2026-11-18T...",
    "updatedAt": "2026-11-18T..."
  }
  ```

#### B. Get All Posts
- **Endpoint:** `GET /api/posts`
- **Success Response (`200 OK`):**
  ```json
  [
    {
      "_id": "673b5a1b...",
      "title": "My First Post",
      "content": "This is the content of my first post.",
      "createdAt": "2026-11-18T..."
    }
  ]
  ```

#### C. Get Single Post by ID
- **Endpoint:** `GET /api/posts/:id`
- **Example:** `GET /api/posts/673b5a1b...`
- **Success Response (`200 OK`):** Returns the post object.
- **Error Response (`404 Not Found`):** `{"message": "Post not found"}`
- **Error Response (`400 Bad Request`):** `{"message": "Invalid post ID format"}`

#### D. Update a Post by ID
- **Endpoint:** `PUT /api/posts/:id`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content."
  }
  ```
- **Success Response (`200 OK`):** Returns the updated post object.

#### E. Delete a Post by ID
- **Endpoint:** `DELETE /api/posts/:id`
- **Success Response (`200 OK`):**
  ```json
  {
    "message": "Post deleted successfully"
  }
  ```

---

### 3. User Authentication APIs

#### A. Register User
- **Endpoint:** `POST /api/users/register`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Success Response (`201 Created`):**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "_id": "673b5c2a...",
      "username": "john_doe",
      "email": "john@example.com",
      "createdAt": "2026-11-18T..."
    }
  }
  ```
  *(Note: Password is never returned in response)*

#### B. User Login
- **Endpoint:** `POST /api/users/login`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Success Response (`200 OK`):**
  ```json
  {
    "message": "Login successful",
    "user": {
      "_id": "673b5c2a...",
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
  ```
- **Error Response (`400 Bad Request`):** `{"message": "Invalid email or password"}`

#### C. Get All Users (Excluding Passwords)
- **Endpoint:** `GET /api/users`
- **Success Response (`200 OK`):** Array of registered users without passwords.

---

## 🛡️ Error Handling & Status Codes

- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Validation failure, missing fields, invalid ID format, or bad credentials.
- `404 Not Found`: Resource or endpoint route not found.
- `500 Internal Server Error`: Unexpected server or database exception.

---

## 🔒 Security Best Practices Implemented

1. **Password Hashing:** Passwords are never saved in plain text; `bcrypt` salt rounds (10) are used before storing.
2. **Exclusion of Sensitive Data:** Password hashes are excluded from API responses using Mongoose projections (`.select("-password")`).
3. **Environment Security:** Sensitive credentials (like database connection string) are kept in `.env` and excluded from source control using `.gitignore`.
4. **Input Sanitization:** Using `trim: true` and Mongoose schema constraints to prevent whitespace errors.
