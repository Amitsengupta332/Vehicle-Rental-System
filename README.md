# 🚗 Vehicle Rental Management System – Backend API

A fully functional backend system for managing vehicle rentals, built using **Node.js**, **Express.js**, **TypeScript**, and **PostgreSQL**.  
This project includes authentication, user roles, vehicles, bookings, validations, and business logic — meeting all assignment requirements.

---

## 🌐 Live Deployment  
🔗 **Base API URL:**  
https://assinment-2-vehicle-renting-system.vercel.app/

---

## 📦 GitHub Repository  
🔗 https://github.com/Amitsengupta332/Vehicle-Rental-System

---

## ✨ Key Features

### 🔐 Authentication
- User Signup & Signin  
- Password hashing (bcryptJS)  
- JWT-based authentication  
- Role-based access control (Admin, Customer)

### 👥 Users Module
- Admin → View all users  
- Admin → Update/delete any user  
- Customer → Update own profile only  
- Restriction: Cannot delete users with active bookings  

### 🚗 Vehicles Module
- Admin → Create, update, delete vehicles  
- Public → View all vehicles  
- Public → View single vehicle  
- Auto availability update when booking/return happens  

### 📅 Bookings Module
- Customer/Admin → Create a booking  
- Customer → Cancel booking before start date  
- Admin → Mark bookings as returned  
- Auto vehicle availability update  
- Price auto-calculated based on days × daily rate  
- Admin → View all bookings  
- Customer → View only own bookings  

---

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|----------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| TypeScript | Type-safe backend |
| PostgreSQL | Main database |
| bcryptjs | Password hashing |
| jsonwebtoken | Authentication |
| dotenv | Environment management |
| tsx | Dev runtime |

---

## 🗂️ Project Structure

```txt
src/
├── app.ts
├── server.ts
├── config/
│   ├── db.ts
│   └── index.ts
├── middleware/
│   └── auth.ts
├── modules/
│   ├── auth/
│   ├── users/
│   ├── vehicles/
│   └── bookings/
├── types/
│   └── roles.ts
└── utils/



⚙️ Run Locally
1️⃣ Install dependencies
npm install

2️⃣ Create .env file
CONNECTION_STR=your_postgres_connection_string
JWT_SECRET=your_jwt_secret_here

3️⃣ Start development server
npm run dev

4️⃣ Production build
npm run build
npm start
