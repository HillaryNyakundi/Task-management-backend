# 🚀 Task Management API (GraphQL + PostgreSQL + Sequelize)

A backend API for managing tasks and users using **GraphQL, Express.js, PostgreSQL, and Sequelize**.

---

## Project structure

📦 Task-management-backend
┣ 📂 docs/
┣ 📂 migrations/
┣ 📂 node_modules/
┣ 📂 seeders/
┣ 📂 src/
┃ ┣ 📂 config/
┃ ┣ 📂 graphql/
┃ ┣ 📂 models/
┃ ┣ 📂 tests/
┣ 📜 .env
┣ 📜 .gitignore
┣ 📜 jest.config.js
┣ 📜 jest.setup.js
┣ {} jsdoc.json
┣ 📜 package.json
┣ 📜 package-lock.json
┣ 📜 README.md
┣ 📜 server.js

## 🛠️ Project Setup

### **1️⃣ Install Dependencies**

```bash
git clone https://github.com/your-repo/task-management-backend.git
cd task-management-backend
npm install
```

### **2️⃣ Setup Environment Variables**

Create a `.env` file in the root directory:

```env
NODE_ENV=development
DATABASE_URL=postgres://username:password@localhost:5432/task_db
SESSION_SECRET=your_secret
```

### **3️⃣ Run the Server**

```bash
npm start
```

### **4️⃣ Run Tests**

```bash
npm test
```

---

## 📡 GraphQL API Documentation

### **User Signup**

#### **Mutation**

```graphql
mutation {
  signup(name: "John Doe", email: "john@example.com", password: "password123") {
    id
    name
    email
  }
}
```

#### **Response**

```json
{
  "data": {
    "signup": {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

### **User Login**

#### **Mutation**

```graphql
mutation {
  login(email: "john@example.com", password: "password123")
}
```

#### **Response**

```json
{
  "data": {
    "login": "Session token here"
  }
}
```

---

### **Create a Task**

#### **Mutation**

```graphql
mutation {
  createTask(
    title: "Complete Assignment"
    description: "Finish the GraphQL API"
    status: "Pending"
  ) {
    id
    title
    description
    status
  }
}
```

#### **Response**

```json
{
  "data": {
    "createTask": {
      "id": "1",
      "title": "Complete Assignment",
      "description": "Finish the GraphQL API",
      "status": "Pending"
    }
  }
}
```

---

### **Get All Tasks**

#### **Query**

```graphql
query {
  getTasks {
    id
    title
    description
    status
  }
}
```

#### **Response**

```json
{
  "data": {
    "getTasks": [
      {
        "id": "1",
        "title": "Complete Assignment",
        "description": "Finish the GraphQL API",
        "status": "Pending"
      }
    ]
  }
}
```

---

### **Update a Task**

#### **Mutation**

```graphql
mutation {
  updateTask(id: "1", title: "Updated Task Title", status: "Completed") {
    id
    title
    status
  }
}
```

#### **Response**

```json
{
  "data": {
    "updateTask": {
      "id": "1",
      "title": "Updated Task Title",
      "status": "Completed"
    }
  }
}
```

---

### **Delete a Task**

#### **Mutation**

```graphql
mutation {
  deleteTask(id: "1")
}
```

#### **Response**

```json
{
  "data": {
    "deleteTask": "Task deleted successfully"
  }
}
```

---

## **🔐 Security Best Practices**

- Use **environment variables** instead of hardcoded credentials.
- **Hash passwords** before storing them.
- **Validate all user input** to prevent SQL injection & XSS attacks.
- **Limit API requests** using rate limiting (e.g., `express-rate-limit`).
- **Enable CORS** only for trusted origins.

---

## 🚀 Deployment

- **Backend Hosted on Railway:** [https://your-api-url.com](https://your-api-url.com)
