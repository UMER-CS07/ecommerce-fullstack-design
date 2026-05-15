# Full-Stack Ecommerce MVP

A modern, full-stack B2B E-commerce marketplace built with **Ruby on Rails** and **React**. This project serves as a Minimum Viable Product (MVP) for Week 3, featuring secure authentication, administrative controls, and persistent user-specific shopping carts.

## 🚀 Features

- **User Authentication**: Secure Sign Up and Log In using Devise and JWT (JSON Web Tokens).
- **Admin Panel**: A restricted dashboard for administrators to perform full CRUD (Create, Read, Update, Delete) operations on the product inventory.
- **Private Cart Management**: Database-backed cart logic that persists per user across devices. Guests are restricted from adding items until logged in.
- **Product Discovery**: Search functionality, category filtering, and responsive Grid/List views.
- **Modern UI**: Professionally designed interface using Vanilla CSS and Tailwind, featuring a centered auth flow and premium marketplace aesthetics.

## 🛠 Tech Stack

- **Frontend**: React.js, Vite, Axios, React Router, Tailwind CSS.
- **Backend**: Ruby on Rails (API Mode), Devise, JWT.
- **Database**: MySQL.
- **Environment**: Node.js, Ruby 3.x.

## 📂 Project Structure

```text
ecommerce-fullstack-design/
├── frontend/             # React application (Vite)
└── backend/              # Rails API application
```

## ⚙️ Setup & Installation

### Backend
1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `bundle install`
3. Set up the database: `rails db:create db:migrate db:seed`
4. Start the server: `rails s` (Runs on port 3000)

### Frontend
1. Navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev` (Runs on port 5173)

---

## 👨‍💻 Developed By
[Your Name]
