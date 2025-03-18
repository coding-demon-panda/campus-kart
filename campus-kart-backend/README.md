# Campus Kart Backend

Campus Kart is a college-centric grocery delivery system that connects grocery sellers with students. Sellers can manage their stores and products, while students can browse, add items to their cart, and place orders—all through a secure and scalable set of RESTful APIs.

## Live 

Explore the live version of Campus Kart: [Campus Kart Live](https://campus-kart-frontend.vercel.app)

## Live Demo

Explore the live version of Campus Kart: [Campus Kart Live](https://www.loom.com/share/06c0747f330e4c758975fecedde1462d?sid=d4430d4e-e382-463e-ac62-770291000fb5)

## Table of Contents

- [Features](#features)
- [REST API Endpoints](#rest-api-endpoints)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Folder Structure](#folder-structure)
- [Usage](#usage)

## Features

### Core Features
- **Seller Portal:**  
  - **Store Registration & Authentication:** Secure seller signup, login, and logout functionality using JWT-based authentication.  
  - **Product Management:** Sellers can add, update, and delete products; manage inventory; view order history and customer reviews.  
  - **Promotional Tools:** Create and manage discounts and promotional offers.

- **Student Portal:**  
  - **User Registration & Authentication:** Students sign up and log in using their college IDs, ensuring an exclusive campus experience.  
  - **Product Browsing:** View and search products uploaded by sellers with advanced filtering by seller, price range, etc.  
  - **Cart & Order Management:** Students can add products to a cart, update quantities, and place orders with integrated payment options and delivery scheduling.  
  - **Order Tracking:** Real-time tracking of order status and delivery details.

- **Payment Integration:**  
  - Razorpay integration for secure payment processing.  
  - Payment order creation and verification.

- **File Uploads:**  
  - Sellers can upload product images using Multer and Cloudinary for secure and efficient file storage.

- **Additional Features:**  
  - Role-based access control for sellers, students, and admins.  
  - Health check API to monitor server uptime.  
  - Comprehensive logging and error handling.

## REST API Endpoints

### Authentication & User Management
1. **`POST /api/auth/registration`**  
   Register a new seller.  
   **Input:** organisationName, userName, userEmailId, userPhoneNumberCountryCode, userPhoneNumber, userPassword

2. **`POST /api/auth/login`**  
   Authenticate a seller and return a JWT token.  
   **Input:** email, password, organisationCname

3. **`POST /api/students/signup`**  
   Register a new student.  
   **Input:** studentName, studentEmail, collegeId, studentPassword

4. **`POST /api/students/login`**  
   Authenticate a student and return a JWT token.  
   **Input:** studentEmail, studentPassword

### Product & Cart Management
5. **Seller Product APIs:**  
   - **`POST /api/seller/products`**: Add a new product.  
   - **`GET /api/seller/products`**: Get all products uploaded by a seller.  
   - **`PUT /api/seller/products/:id`**: Update a product.  
   - **`DELETE /api/seller/products/:id`**: Delete a product.

6. **Student Product API:**  
   - **`GET /api/products`**: Retrieve all products from all sellers.

7. **Cart APIs (Student):**  
   - **`POST /api/cart`**: Add an item to the cart.  
   - **`GET /api/cart`**: Retrieve all items in a student's cart.  
   - **`PUT /api/cart/:id`**: Update quantity of a cart item.  
   - **`DELETE /api/cart/:id`**: Remove a cart item.  
   - **`DELETE /api/cart/clear`**: Clear the student’s cart.

8. **Order APIs (Student):**  
   - **`POST /api/order`**: Create a new order and clear the cart.  
   - **`GET /api/students/orders`**: Retrieve all orders for a student.

### Payment Integration
9. **`POST /api/payments/create-order`**  
   Create a payment order using Razorpay.  
   **Input:** amount, currency, order details

10. **`POST /api/payments/verify`**  
    Verify payment after completion.  
    **Input:** orderId, paymentId, signature

### Miscellaneous
11. **`POST /api/upload`**  
    Upload files (e.g., product images) using Multer and Cloudinary.  
    **Input:** file  
12. **`GET /api/health`**  
    Health check endpoint to verify server status.

## Technologies Used

- **Backend Framework:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Authentication:** JWT, bcrypt for password hashing
- **File Uploads:** Multer, Cloudinary
- **Email Service:** Nodemailer
- **Payment Integration:** Razorpay
- **Utilities:** dotenv, UUID, Crypto

## Installation

### Prerequisites

- Node.js (v14+)
- MongoDB instance (local or Atlas)
- npm or yarn package manager

### Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/CampusKart.git
   cd CampusKart/backend
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Envirnment Variables:**
  Create a .env file in the backend directory and include the following:
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
4. **Start the Backend Server:**
   ```bash
   npm start
   ```
The backend server will run on http://localhost:8080.

## Folder Structure

### Backend 

```bash
backend/
│
├── config/                    # Configuration files (database, environment variables)
│   ├── db.js                  # Database connection setup
│   └── config.js              # General app configuration
│
├── controllers/               # API route handlers
│   ├── authController.js      # Handles authentication for sellers and students
│   ├── productController.js   # Manages seller product operations
│   ├── orderController.js     # Handles order creation and management (also clears cart)
│   └── paymentController.js   # Manages payment processing and integration with Razorpay
│
├── middleware/                # Custom middleware (authentication, error handling)
│   ├── verifyJWT.js           # JWT verification middleware
│   └── errorMiddleware.js     # Global error handling middleware
│
├── models/                    # Mongoose models
│   ├── userModel.js           # User model for sellers and students
│   ├── productModel.js        # Product model
│   ├── cartItemModel.js       # Cart item model
│   └── orderModel.js          # Order model
│
├── routes/                    # Express route definitions
│   ├── authRoutes.js          # Routes for authentication (signup, login, etc.)
│   ├── productRoutes.js       # Seller product management routes
│   ├── cartRoutes.js          # Cart management routes
│   ├── orderRoutes.js         # Order creation and retrieval routes\n   └── paymentRoutes.js       # Payment integration routes
│
├── services/                  # Business logic and helper functions
│   ├── authService.js         # JWT generation and authentication logic
│   ├── paymentService.js      # Razorpay integration and payment verification logic
│   └── fileUploadService.js   # File upload logic using Multer and Cloudinary
│
├── utils/                     # Utility functions and helpers
│   ├── jwtUtils.js            # Helper functions for JWT operations
│   └── logger.js              # Logger for error and request logging
│
├── .env                       # Environment variables
├── .gitignore                 # Git ignore file
├── server.js                  # Entry point for the backend server
└── package.json               # Backend dependencies and scripts
```

### Frontend
```bash
frontend/
│
├── public/                    # Public assets (images, fonts, etc.)
│   ├── index.html             # Main HTML file
│   └── favicon.ico            # Favicon
│
├── src/                       # Source code for React app
│   ├── assets/                # Static assets (images, icons, etc.)
│   ├── components/            # Reusable components (Header, Footer, Toast, etc.)
│   ├── context/               # React context for global state management
│   ├── hooks/                 # Custom hooks
│   ├── pages/                 # Application pages (Home, Login, Signup, Dashboard, etc.)
│   ├── redux/                 # Redux store, actions, and reducers
│   ├── services/              # API service calls (authService, productService, etc.)
│   ├── styles/                # Tailwind CSS configuration and custom styles
│   ├── utils/                 # Utility functions (formatDate, validation, etc.)
│   ├── App.js                 # Main React component
│   └── index.js               # Entry point for React app
├── .env                       # Environment variables for frontend
├── .gitignore                 # Git ignore file
├── package.json               # Frontend dependencies and scripts
└── tailwind.config.js         # Tailwind CSS configuration
```

## Usage
```bash
1. Start the Backend Server:

cd CampusKart/backend
nodemon app.js

2. Start the Frontend Application:

cd CampusKart/frontend
npm run dev

3. Access the Application:
Open your browser and navigate to the frontend URL http://localhost:3000

4. Sign Up / Log In:
Sellers can sign up or log in to manage their products and orders.
Students can sign up or log in to browse products, add items to their cart, and place orders.