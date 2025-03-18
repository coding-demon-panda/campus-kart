# Campus Kart Backend

Campus Kart is a college-centric grocery delivery system that connects grocery sellers with students. Sellers can manage their stores and products, while students can browse, add items to their cart, and place orders—all through a secure and scalable set of RESTful APIs.

## Live

Explore the live version of Campus Kart:

- [Campus Kart Live](https://campus-kart-frontend.vercel.app)
- [Campus Kart Backend](https://campus-kart-backend.onrender.com)

## Live Demo

- [5 minutes video](https://www.loom.com/share/6150927180c242d29aa4e1ad2cf6b4d4?sid=9fc08fee-9564-4aa7-bc43-d06101570ca1)
- [46 seconds video](https://www.loom.com/share/014b528558fc4d18acc5a29307827a1b?sid=09a34462-da59-4938-9a17-ca9d0ad74461)
- [3 minutes video](https://www.loom.com/share/1acee61bc6ed47d3b9b67fd5f92bda43?sid=979404b4-d10d-4e98-b870-da4ea8d60cf6)

## Table of Contents

- [Live](#live)
- [Live Demo](#live-demo)
- [Installation](#installation)
- [Features](#features)
- [Frontend Routes](#frontend-routes)
- [REST API Endpoints](#rest-api-endpoints)
- [Technologies Used](#technologies-used)

## Installation

### Prerequisites

- Node.js (v14+)
- MongoDB instance (local or Atlas)
- npm or yarn package manager

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/coding-demon-panda/campus-kart.git
   ```

2. Create a `.env` file in the backend directory and include the following:
   ```bash
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ATLASDB_URL=your_mongodb_connection_string
   SECRET=your_session_secret
   JWT_SECRET=your_jwt_secret
   ```

3. Start the backend server:
   ```bash
   cd campus-kart/campus-kart-backend
   nodemon app.js
   ```

4. Start the frontend application (in another terminal):
   ```bash
   cd campus-kart/campus-kart-frontend
   npm run dev
   ```

5. Access the application at:
   ```
   http://localhost:3000
   ```

6. **Sign Up / Log In:**
   - Sellers receive a unique subdomain after registering with their shop name:
     ```
     http://shop-name.localhost:3000/
     ```
   - Students can sign up and log in to browse products, add items to their cart, and place orders.

## Features

### Core Features

**Seller Portal:**
- **Multitenancy:** Unique BASE_URL for each shop.
- **Store Registration & Authentication:** JWT-based signup, login, and logout.
- **Product Management:** Add, update, delete products; manage inventory; view order history.
- **Promotions:** Manage discounts and special offers.

**Student Portal:**
- **User Registration & Authentication:** Secure student sign up with college ID verification.
- **Product Browsing:** Search and filter products.
- **Cart & Order Management:** Add to cart, checkout, and manage orders.

**Payments:**
- Razorpay integration for payment processing.

**File Uploads:**
- Secure image uploads via Multer and Cloudinary.

**Additional Features:**
- Role-based access control.
- Health check APIs.
- Comprehensive logging and error handling.

## Frontend Routes

### Base URL
- Development: `http://localhost:3000`
- Production: `https://campus-kart-frontend.vercel.app`

### Unauthenticated Routes
1. `/` — Landing Page
2. `/home` — Common Home Page
3. `/signup` — Seller signup
4. `shop-name.{BASE_URL}/login` — Seller login
5. `/usersignup` — Student signup
6. `/userlogin` — Student login
7. `/terms-conditions` — Terms & Conditions

### Seller Authenticated Routes
8. `shop-name.{BASE_URL}/dashboard` — Seller Dashboard
9. `shop-name.{BASE_URL}/order-pending` — Pending Orders
10. `shop-name.{BASE_URL}/order-history` — Order History
11. `shop-name.{BASE_URL}/integrations` — Product Management
12. `shop-name.{BASE_URL}/promotions` — Promotions

### Student Authenticated Routes
13. `/students/dashboard` — Product Listings
14. `/students/cart` — Cart Page
15. `/students/checkout` — Checkout Page
16. `/students/orders` — Order History

## REST API Endpoints

### Base URL
- Development: `http://localhost:8080`
- Production: `https://campus-kart-backend.onrender.com`

### Authentication & User Management
1. `POST /registration` — Register a new seller.
2. `POST /login` — Seller login.
3. `POST /students/register` — Register a new student.
4. `POST /students/login` — Student login.

### Product & Cart Management
**Seller APIs:**
- `POST /seller/products` — Add product.
- `GET /seller/products` — View seller's products.
- `PUT /seller/products/:id` — Update product.
- `DELETE /seller/products/:id` — Delete product.

**Student APIs:**
- `GET /products` — List all products.

**Cart APIs:**
- `POST /cart` — Add to cart.
- `GET /cart` — View cart.
- `PUT /cart/:id` — Update cart item.
- `DELETE /cart/:id` — Delete cart item.
- `DELETE /cart/clear` — Clear cart.

**Order APIs:**
- `POST /order` — Create order.
- `GET /students/orders` — View student orders.

### Payment Integration (Coming Soon)
- `POST /api/payments/create-order` — Create Razorpay order.
- `POST /api/payments/verify` — Verify payment.

### Miscellaneous
- `POST /api/upload` — Upload product images.
- `GET /api/health` — Server health check.

## Technologies Used

### Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT & bcrypt
- Multer & Cloudinary
- Nodemailer
- Razorpay integration
- dotenv, UUID, crypto

### Frontend:
- React.js
- Vite
- Tailwind CSS
- Flowbite
- React Router
- Axios
- SweetAlert
- Lucide-react

