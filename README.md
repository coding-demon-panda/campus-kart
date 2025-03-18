# Campus Kart Backend

Campus Kart is a college-centric grocery delivery system that connects grocery sellers with students. Sellers can manage their stores and products, while students can browse, add items to their cart, and place orders—all through a secure and scalable set of RESTful APIs.

## Live 

Explore the live version of Campus Kart: 
[Campus Kart Live](https://campus-kart-frontend.vercel.app)

[Campus Kart Backend](https://campus-kart-backend.onrender.com)

## Live Demo

Explore the live version of Campus Kart: 

[5 minutes video](https://www.loom.com/share/6150927180c242d29aa4e1ad2cf6b4d4?sid=9fc08fee-9564-4aa7-bc43-d06101570ca1)

[46 seconds video](https://www.loom.com/share/014b528558fc4d18acc5a29307827a1b?sid=09a34462-da59-4938-9a17-ca9d0ad74461)

[3 minutes video](https://www.loom.com/share/1acee61bc6ed47d3b9b67fd5f92bda43?sid=979404b4-d10d-4e98-b870-da4ea8d60cf6)

## Table of Contents

- [Live-Website](#Live)
- [Live-Demo](#Live-Demo)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Frontend Routes](#frontend-routes)
- [REST API Endpoints](#rest-api-endpoints)
- [Technologies Used](#technologies-used)

## Installation

### Prerequisites

- Node.js (v14+)
- MongoDB instance (local or Atlas)
- npm or yarn package manager

## Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/coding-demon-panda/campus-kart.git
   ```

2. Environmental Variables:
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

3. Start the Backend Server:
   ```bash
   cd campus-kart
   cd campus-kart-backend
   nodemon app.js
   ```

4. Start the Frontend Application (In another terminal):
   ```bash
   cd campus-kart
   cd campus-kart-frontend
   npm run dev
   ```

5. Access the Application:
Open your browser and navigate to the frontend URL http://localhost:3000

6. Sign Up / Log In:
Sellers can sign up or log in to manage their products and orders.
   ```bash
   Sellers are provided a special feature wherein after registering with their shop name they get a unique subdomain tenant url.

   http://shop-name.localhost:3000/

   Further authenticated routes for the sellers are the navigations on the above url.
   ```

Students can sign up or log in to browse products, add items to their cart, and place orders.

## Features

### Core Features
- **Seller Portal:**
  - **Multitenancy** Provides Multitenancy of the BASE_URL for different shop owners.
  - **Store Registration & Authentication:** Secure seller signup, login, and logout functionality using JWT-based authentication.  
  - **Product Management:** Sellers can add, update, and delete products; manage inventory; view order history and customer reviews.  
  - **Promotional Tools:** Create and manage discounts and promotional offers.

- **Student Portal:**  
  - **User Registration & Authentication:** Students sign up and log in using their college IDs, ensuring an exclusive campus experience.  
  - **Product Browsing:** View and search products uploaded by sellers with advanced filtering by seller, price range, etc.  
  - **Cart & Order Management:** Students can add products to a cart, update quantities, and place orders with integrated payment options and delivery scheduling.  

- **Payment Integration:**  
  - Razorpay integration for secure payment processing.  
  - Payment order creation and verification.

- **File Uploads:**  
  - Sellers can upload product images using Multer and Cloudinary for secure and efficient file storage.

- **Additional Features:**  
  - Role-based access control for sellers, students, and admins.  
  - Health check API to monitor server uptime.  
  - Comprehensive logging and error handling.

## Frontend Routes
-- BASE_URL 
-- Development http://localhost:3000
-- Production https://campus-kart-frontend.vercel.app

### Unauthenticated Routes
1. **`{BASE_URL}/** 
   Landing Page

2. **`{BASE_URL}/home** 
   Home Page (common to both sellers and students)

3. **`{BASE_URL}/signup** 
   Signup Page for sellers to register their shops 

4. **`shop-name.{BASE_URL}/login** 
   Login Page for the sellers for their shop

5. **`{BASE_URL}/usersignup** 
   Signup Page for students to register with their college id 

6. **`{BASE_URL}/userlogin** 
   Login Page for the students 

7. **`{BASE_URL}/terms-conditions** 
   TNC Page for the webapp

### Seller Authenticated Routes
8. **`shop-name.{BASE_URL}/dashboard** 
   Dashboard showing summary of the sellers shop

9. **`shop-name.{BASE_URL}/order-pending** 
   Shows all the pending orders
   
10. **`shop-name.{BASE_URL}/order-history** 
   Shows the order history 

11. **`shop-name.{BASE_URL}/integrations** 
   Shows all the products provided by him with their details like price, description, name, quantity, etc.

12. **`shop-name.{BASE_URL}/promotions** 
   Shows the offers given by him on certain orders based on filters.

### Student Authenticated Routes
13. **`{BASE_URL}/students/dashboard** 
   Shows all the products provided by all the customers.

14. **`{BASE_URL}/students/cart** 
   Shows all the products in the cart with more functionalities like checkout, editing quantities, delete from cart etc.

15. **`{BASE_URL}/students/checkout** 
   Checkout page where a form with address(location autofill), payment mode, and delivery slot has to be filled.

16. **`{BASE_URL}/students/orders** 
   Shows all the checkouts done by him, the pending and the order history both.

## REST API Endpoints
-- BASE_URL 
-- Development http://localhost:8080
-- Production https://campus-kart-backend.onrender.com

### Authentication & User Management
1. **`POST {BASE_URL}/registration`**  
   Register a new seller.  
   **Input:** organisationName, userName, userEmailId, userPhoneNumberCountryCode, userPhoneNumber, userPassword

2. **`POST {BASE_URL}/login`**  
   Authenticate a seller and return a JWT token.  
   **Input:** email, password, organisationCname

3. **`POST {BASE_URL}/students/register`**  
   Register a new student.  
   **Input:** studentName, studentEmail, collegeId, studentPassword

4. **`POST {BASE_URL}/students/login`**  
   Authenticate a student and return a JWT token.  
   **Input:** studentEmail, studentPassword

### Product & Cart Management
5. **Seller Product APIs:**  
   - **`POST {BASE_URL}/seller/products`**: Add a new product.  
   - **`GET {BASE_URL}/seller/products`**: Get all products uploaded by a seller.  
   - **`PUT {BASE_URL}/seller/products/:id`**: Update a product.  
   - **`DELETE {BASE_URL}/seller/products/:id`**: Delete a product.

6. **Student Product API:**  
   - **`GET {BASE_URL}/products`**: Retrieve all products from all sellers.

7. **Cart APIs (Student):**  
   - **`POST {BASE_URL}/cart`**: Add an item to the cart.  
   - **`GET {BASE_URL}/cart`**: Retrieve all items in a student's cart.  
   - **`PUT {BASE_URL}/cart/:id`**: Update quantity of a cart item.  
   - **`DELETE {BASE_URL}/cart/:id`**: Remove a cart item.  
   - **`DELETE {BASE_URL}/cart/clear`**: Clear the student’s cart.

8. **Order APIs (Student):**  
   - **`POST {BASE_URL}/order`**: Create a new order and clear the cart.  
   - **`GET {BASE_URL}/students/orders`**: Retrieve all orders for a student.

### Payment Integration (Not completed yet)
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

### Backend:
- **Backend Framework:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Authentication:** JWT, bcrypt for password hashing
- **File Uploads:** Multer, Cloudinary
- **Email Service:** Nodemailer
- **Payment Integration:** Razorpay
- **Utilities:** dotenv, UUID, Crypto

### Frontend:
- **Frontend Framework:** React.js
- **Build Tool:** Vite
- **Styling:** Tailwind CSS, Flowbite
- **Routing:** React Router
- **HTTP Client:** Axios
- **Other Libraries:** SweetAlert, Lucide-react for icons
