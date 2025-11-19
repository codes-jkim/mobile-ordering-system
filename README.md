# Mobile Ordering System

This project is a mobile ordering system built with Angular and Node.js (Express). Users can browse menus, add items to their cart, and place orders. Administrators can monitor sales through a dashboard and manage products and categories.

## 🚀 Live Demo

This application is deployed on [Render](https://render.com/). You can access the live version here:

**[https://mobile-ordering-system.onrender.com/products](https://mobile-ordering-system.onrender.com/products)**

*(Note: The free tier on Render may cause the initial load to be slow as the server spins up.)*

## ✨ Key Features

### 👤 User (Customer)
- Browse product lists by category
- View detailed product information
- Add, update, and remove items from the shopping cart
- Place an order

### 👨‍💼 Administrator
- **Security**: Secure login/authentication based on JWT
- **Dashboard**:
  - Visualize key metrics like total revenue, order count
  - Sales trend chart by period
  - Top-selling products by category
- **Product Management**:
  - View product list
  - Add, edit, and delete products (CRUD)
- **Category Management**:
  - View category list
  - Add, edit, and delete categories (CRUD)
  - Reorder categories via drag-and-drop
- **Settings**:
  - Change administrator password

## 🛠️ Tech Stack

### 💻 Frontend
- **Angular (v20)**: Main framework
- **Angular Material**: UI component library
- **TypeScript**: Primary development language
- **SCSS**: Styling
- **RxJS & Angular Signals**: State management and asynchronous processing
- **Chart.js / ng2-charts**: Data visualization
- **Jasmine & Karma**: Unit testing

### 🗄️ Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: MongoDB ODM (Object Data Modeling)
- **JWT (JSON Web Token)**: User authentication
