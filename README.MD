# 🌱 EcoFinds - Sustainable Second-Hand Marketplace

![Node.js](https://img.shields.io/badge/Node.js-v22.14.0-green.svg)
![React](https://img.shields.io/badge/React-19.1.1-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue.svg)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg)

> **Empowering Sustainable Consumption through a Second-Hand Marketplace**

EcoFinds is a modern, secure marketplace platform that promotes sustainable consumption by connecting buyers and sellers of pre-owned goods. Built with cutting-edge web technologies and featuring robust authentication and a beautiful user interface.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based auth system with refresh tokens
- 🛍️ **Product Marketplace** - Browse, list, create listings and purchase second-hand items
- 🛒 **Shopping Cart** - Add items, checkout card and view purchases
- 👤 **User Profiles** - Manage, update personal information and listings
- 📱 **Responsive Design** - Beautiful UI - not responsive cause we did'nt have time ;;
- 🔍 **Product Categories** - Organized browsing experience with search and category filters

## 🎬 Demo Video

Check out our **Secondhand Marketplace Web App Demo** to see EcoFinds in action!

[![Demo Video](https://img.shields.io/badge/🎬_Watch_Demo-41.8MB-red.svg?style=for-the-badge)](https://drive.google.com/drive/u/3/folders/1rFhS0XXSox2FDtv254tZ9375aDhLgP_v)

> 📹 **Video:** Secondhand Marketplace Web App Demo.mp4 (41.8 MB)

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v22.14.0 (recommended)
- **PostgreSQL**: Latest version
- **npm**: Latest version

### Installation

1. **Install PostgreSQL**
   ```bash
   brew install postgresql
   ```

2. **Clone and Install Dependencies**
   ```bash
   # Install server dependencies
   cd server && npm install
   
   # Install client dependencies
   cd ../client && npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://aishwarya@localhost:5432/ecofinds_db"
   JWT_SECRET="thisismysecretjwttoken"
   ```

4. **Run the Application**
   
   **Start Backend Server:**
   ```bash
   cd server && node index.js
   ```
   > 🌐 Server runs on `http://localhost:5001`
   
   **Start Frontend Client:**
   ```bash
   cd client && npm run dev
   ```
   > 🌐 Client runs on `http://localhost:5173`

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Database**: PostgreSQL
- **ORM**: Prisma (Schema management & structured SQL queries)
- **Authentication**: JWT tokens with refresh token support
- **Security**: All routes are authentication-protected
- **Port**: 5001

### Frontend
- **Framework**: React 19.1.1
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Port**: 5173

## 📊 Database Schema

Our PostgreSQL database is designed for scalability and data integrity:

<details>
<summary>🗄️ Click to view complete database schema</summary>

```sql
-- Users table - stores user information
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(256),
    last_name VARCHAR(256),
    email VARCHAR(256) UNIQUE NOT NULL,
    location VARCHAR(256),
    password_hash VARCHAR(256) NOT NULL,
    profile_picture_url TEXT,
    user_address TEXT NOT NULL,
    phone VARCHAR(20),
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    jwt_token VARCHAR(256),
    refresh_token VARCHAR(256)
);

-- Categories lookup table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Conditions lookup table
CREATE TABLE conditions (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) UNIQUE NOT NULL
);

-- Products table - stores all item details
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    condition_id INTEGER REFERENCES conditions(id),
    image_urls TEXT[],
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cart items table
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    UNIQUE (user_id, product_id)
);

-- Orders table - completed orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_price NUMERIC(10, 2) NOT NULL,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order items table - items within each order
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_at_purchase NUMERIC(10, 2) NOT NULL
);
```

</details>

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Refresh Tokens**: Enhanced security with token refresh mechanism
- **Protected Routes**: All API endpoints require authentication except login and signup.
- **Password Hashing**: Secure password storage
- **Data Validation**: Input validation and sanitization


## 📄 License

This project is part of the Odoo-X-NMIT Hackathon by **8-Bit Thugs**.
