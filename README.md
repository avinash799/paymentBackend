# 🚀 Payment Processing System (Node.js Backend Assignment)

## 📌 Overview

This project is a backend system that simulates a real-world **payment processing workflow**. It is built using Node.js and follows a modular, scalable architecture.

It supports payment initiation, status tracking, asynchronous processing, and retry mechanisms for failed transactions.

---

## 🎯 Features

- Create payment requests
- Track payment lifecycle:
  - Pending → Processing → Success / Failed
- Retry mechanism for failed payments
- RESTful API design
- Swagger API documentation
- Modular architecture (Controller, Service, Routes)
- Centralized error handling

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Redis (optional for queue/caching)
- RabbitMQ (optional for async processing)
- Swagger (API documentation)
- dotenv

---
## ⚙️ Setup Instructions

1. Clone the repository
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd <PROJECT_FOLDER>

2. Install dependencies
npm install

3. Create environment variables

Create a .env file in the root directory:

PORT=3000
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=your_redis_url
RABBITMQ_URL=your_rabbitmq_url


4. Run the application
Development mode:
npm run dev

Production mode:
npm start

📘 API Documentation

Swagger UI:

http://localhost:3000/api-docs

Or deployed URL:

https://paymentbackend-rn7l.onrender.com/api-docs/
