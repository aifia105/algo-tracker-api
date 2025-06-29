# 🧠 Algo Tracker API

The backend service for the Algo Tracker app — a full-stack LeetCode progress and problem management tool for devs who don't just grind... they build.

## 🧱 Stack

- **Node.js**
- **Express**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **bcrypt (Password hashing)**
- **CORS / Helmet / Morgan (Security & Logging)**

## 🔐 Auth Flow

- Register with `username`, `email`, and `password`
- Login returns JWT (stored in localStorage/cookie by frontend)
- Protected routes validate tokens via middleware

## 🗃️ Folder Structure

📦algo-tracker-api
┣ 📂controllers
┣ 📂dtos
┣ 📂enums
┣ 📂middleware
┣ 📂models
┣ 📂services
┣ 📂utils
┣ 📄index.ts
┗ 📄.env (ignored)

```bash
git clone https://github.com/yourusername/algo-tracker-api
cd algo-tracker-api
npm install
npm run dev
```

Create a `.env` file:
```bash
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret
```

## 📜 License
MIT

