# CloudCart — AWS Full-Stack E-Commerce Deployment

> A production-grade MERN stack e-commerce application deployed on AWS EC2 with Nginx reverse proxy, PM2 process management, Amazon S3 asset storage, IAM least-privilege policies, and CloudWatch monitoring.

---

## 1. Project Overview

**CloudCart** demonstrates production-style cloud engineering and full-stack software development. It bridges full-stack web development with real AWS DevOps practices:

- **Frontend:** React 18 SPA created with Vite, styled with vanilla CSS design system, state managed via Context API (`AuthContext`, `CartContext`), routed via React Router 6.
- **Backend:** Express.js REST API with modular controllers/services/routes, Mongoose ODM, JWT authentication, bcrypt password hashing, rate limiting, and centralized error handling.
- **Database:** MongoDB Atlas (M0 Free Tier) with compound indexes and text search.
- **AWS Infrastructure:** EC2 Ubuntu 22.04 LTS instance, Amazon S3 for product media storage, IAM Role (no hardcoded keys on server), and CloudWatch Logs & Metrics.
- **Production Server:** Nginx as reverse proxy & static file server (Port 80 → 5000), PM2 for zero-downtime process lifecycle management.

---

## 2. Key Features

### Customer Features
- **Authentication:** User registration, login, logout, JWT state persistence, profile editing.
- **Catalog Browsing:** Paginated product grid, category filtering pills, live keyword search, price/name sorting.
- **Product Details:** High-res image display, stock availability badge, category tags, S3 asset metadata badge.
- **Cart Management:** Add items, update quantities dynamically, calculate totals, remove items, clear cart.
- **Checkout & Orders:** Shipping address capture, atomic stock deduction, simulated instant payment, order receipt.
- **Order History:** List past orders with status badges (`processing`, `shipped`, `delivered`, `cancelled`), detailed item breakdown.

### Admin Features
- **Dashboard:** Metrics cards (Revenue, Total Orders, Active Products, Customers), order status summary breakdown, recent 5 orders table.
- **Product Management:** Full CRUD operations, drag-and-drop S3 image upload, automated S3 image object deletion upon product removal.
- **Order Management:** View all customer orders, filter by status, update order fulfillment status (with stock restoration on cancellation).

---

## 3. Architecture Overview

```
                      +---------------------------------------+
                      |             User Browser              |
                      +---------------------------------------+
                                          |
                                      HTTP (80)
                                          v
+-----------------------------------------------------------------------------------+
| AWS EC2 (Ubuntu 22.04 LTS)                                                         |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | Nginx Reverse Proxy (:80)                                                    |  |
|  |   - Serves React Static Build (/dist) for UI routes                          |  |
|  |   - Proxies /api/* requests to localhost:5000                                |  |
|  +-----------------------------------------------------------------------------+  |
|                                         |                                         |
|                                    localhost:5000                                 |
|                                         v                                         |
|  +-----------------------------------------------------------------------------+  |
|  | Node.js / Express API Server (Managed by PM2)                                |  |
|  |   - Helmet Security Headers | CORS | Rate Limiting                          |  |
|  |   - JWT Auth & RBAC Middleware | Winston Logging                           |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
       |                                      |                                  |
       v                                      v                                  v
+---------------+                    +------------------+              +--------------------+
| MongoDB Atlas |                    |  AWS S3 Bucket   |              |  AWS CloudWatch    |
| (M0 Cluster)  |                    | (Product Media)  |              | (Logs & Metrics)   |
+---------------+                    +------------------+              +--------------------+
```

---

## 4. Tech Stack

- **Frontend:** React 18, Vite, React Router DOM 6, Axios, React Icons, React Hot Toast
- **Backend:** Node.js 20, Express.js, Mongoose 8, bcryptjs, jsonwebtoken, Multer, Winston, Helmet, CORS, express-rate-limit
- **AWS Services:** AWS EC2, AWS S3, AWS IAM, AWS CloudWatch Logs & Metrics, AWS CLI
- **Infrastructure:** Ubuntu Linux 22.04, Nginx, PM2
- **Database:** MongoDB Atlas

---

## 5. Folder Structure

```
cloudcart/
├── client/                          # React + Vite Frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── common/              # ProtectedRoute, AdminRoute
│   │   │   ├── layout/              # Navbar, Footer, Layout
│   │   │   └── product/             # ProductCard
│   │   ├── context/                 # AuthContext, CartContext
│   │   ├── pages/                   # Home, Products, Cart, Checkout, Orders, Admin...
│   │   ├── services/                # Axios API services (auth, product, cart, order, admin)
│   │   ├── App.jsx                  # Main routing configuration
│   │   ├── index.css                # Global CSS design system
│   │   └── main.jsx
│   ├── vite.config.js               # Vite config with /api dev proxy
│   └── package.json
│
├── server/                          # Node.js + Express Backend
│   ├── config/                      # db.js, s3.js, cloudwatch.js, index.js
│   ├── controllers/                 # auth, product, cart, order, admin controllers
│   ├── middleware/                  # auth, admin, upload, validate, rateLimiter, errorHandler
│   ├── models/                      # User, Product, Order, Cart (Mongoose schemas)
│   ├── routes/                      # auth, product, cart, order, admin routes
│   ├── services/                    # auth, product, cart, order, s3, admin services
│   ├── utils/                       # AppError, logger, validators
│   ├── server.js                    # Server entry point
│   └── package.json
│
├── infrastructure/                  # AWS & Deployment Artifacts
│   ├── iam/                         # policies.json (Least-privilege policy)
│   ├── nginx/                       # cloudcart.conf (Nginx site configuration)
│   ├── pm2/                         # ecosystem.config.js (PM2 runtime config)
│   └── scripts/                     # setup-ec2.sh, deploy.sh, cleanup-aws.sh
│
├── .env.example                     # Environment variable template
├── .gitignore
└── README.md
```

---

## 6. Local Setup Instructions

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- Git
- MongoDB Atlas cluster URL (or local MongoDB)

### Step 1: Clone Repository
```bash
git clone <your-repository-url>
cd cloudcart
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```
Fill in your credentials in `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/cloudcart?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_min_64_characters
AWS_REGION=us-east-1
AWS_S3_BUCKET=cloudcart-product-images-your-name
CORS_ORIGIN=http://localhost:5173
```

### Step 3: Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 4: Seed Database
Populate your local or Atlas MongoDB instance with default products and admin/customer accounts:
```bash
cd server
npm run db:seed
```

### Step 5: Run Locally
In terminal 1 (Backend):
```bash
cd server
npm run dev
```

In terminal 2 (Frontend):
```bash
cd client
npm run dev
```

Open your browser at `http://localhost:5173`.

### Default Demo Credentials
After seeding, you can use these accounts to sign in:
* **Administrator Account:**
  * **Email:** `admin@cloudcart.com`
  * **Password:** `Admin123!`
* **Customer Account:**
  * **Email:** `customer@cloudcart.com`
  * **Password:** `Customer123!`

---

## 7. Database Schemas

- **User Collection:** `name`, `email` (unique index), `password` (select: false), `role` (`consumer` | `admin`), timestamps.
- **Product Collection:** `name`, `description`, `price`, `category`, `stock`, `imageUrl`, `imageKey` (S3 object key), compound & text indexes.
- **Order Collection:** `user` (ref: User), `items` (embedded snapshot with `name`, `price`, `quantity`, `imageUrl`), `totalAmount`, `shippingAddress`, `paymentStatus`, `orderStatus`.
- **Cart Collection:** `user` (1:1 ref: User), `items` (`product` ref, `quantity`).

---

## 8. AWS S3 Image Upload Workflow

```
Admin Frontend -> Multipart POST /api/products -> Express Multer (Memory Storage) -> s3Service.uploadImage() -> AWS S3 PutObject -> Return S3 URL -> Save URL & Key in MongoDB
```

When a product is deleted or its image is updated, `s3Service.deleteImage(imageKey)` triggers a `DeleteObjectCommand` to purge the old image file from the S3 bucket.

---

## 9. AWS EC2 & Nginx & PM2 Deployment

### 1. Provision EC2 Instance
- **AMI:** Ubuntu 22.04 LTS
- **Instance Type:** `t2.micro` (Free Tier)
- **Security Group Inbound Rules:**
  - SSH (22): Your IP
  - HTTP (80): 0.0.0.0/0
- **Attach IAM Role:** `cloudcart-ec2-role`

### 2. Run Setup Script on EC2
```bash
ssh -i your-key.pem ubuntu@<ec2-ip>
curl -O https://raw.githubusercontent.com/<user>/<repo>/main/infrastructure/scripts/setup-ec2.sh
chmod +x setup-ec2.sh
./setup-ec2.sh
```

### 3. Deploy Application
```bash
git clone <repo-url> /home/ubuntu/cloudcart
cd /home/ubuntu/cloudcart
cp .env.example .env # Fill production env variables
chmod +x infrastructure/scripts/deploy.sh
./infrastructure/scripts/deploy.sh
```

---

## 10. IAM Security & Least Privilege

The EC2 instance uses an **IAM Role** (`cloudcart-ec2-role`) instead of storing permanent AWS access keys on the instance.

Permission breakdown in `infrastructure/iam/policies.json`:
- `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject`, `s3:PutObjectAcl` restricted strictly to `arn:aws:s3:::cloudcart-bucket/*`.
- `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents` restricted to `arn:aws:logs:*:*:log-group:/cloudcart/*`.

---

## 11. CloudWatch Monitoring & Logs

- **Application Logs:** In production (`NODE_ENV=production`), Winston logs are pushed asynchronously to CloudWatch Log Group `/cloudcart/application`.
- **EC2 Metrics:** CPU Utilization monitored via AWS CloudWatch.
- **Alarm Rule:** Triggers when EC2 CPU utilization exceeds 80% for 5 consecutive minutes.

---

## 12. API Reference Summary

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Authenticate user & get JWT |
| GET | `/api/auth/me` | Authenticated | Get current user profile |
| GET | `/api/products` | Public | List products (paginated, filterable) |
| GET | `/api/products/:id` | Public | Get product details |
| POST | `/api/products` | Admin | Create product + S3 image upload |
| PUT | `/api/products/:id` | Admin | Update product details/image |
| DELETE | `/api/products/:id` | Admin | Delete product + remove S3 image |
| GET | `/api/cart` | Authenticated | Get user cart |
| POST | `/api/cart` | Authenticated | Add item to cart |
| PUT | `/api/cart/:productId` | Authenticated | Update item quantity |
| DELETE | `/api/cart/:productId` | Authenticated | Remove item from cart |
| POST | `/api/orders` | Authenticated | Checkout cart & create order |
| GET | `/api/orders` | Authenticated | Get user order history |
| GET | `/api/admin/stats` | Admin | Dashboard metrics & sales statistics |
| GET | `/api/admin/orders` | Admin | List all customer orders |
| PUT | `/api/admin/orders/:id/status` | Admin | Update order status |

---

## 13. AWS Resource Cleanup Guide

To ensure **zero ongoing AWS charges**, execute the following cleanup commands after testing:

```bash
# 1. Delete S3 Bucket and all contents
aws s3 rb s3://YOUR_S3_BUCKET_NAME --force

# 2. Delete CloudWatch Log Group & Alarms
aws logs delete-log-group --log-group-name /cloudcart/application
aws cloudwatch delete-alarms --alarm-names cloudcart-cpu-alarm

# 3. Disassociate and Release Elastic IP
aws ec2 disassociate-address --association-id YOUR_ASSOC_ID
aws ec2 release-address --allocation-id YOUR_ALLOC_ID

# 4. Terminate EC2 Instance
aws ec2 terminate-instances --instance-ids YOUR_INSTANCE_ID

# 5. Delete IAM Role & Policies
aws iam detach-role-policy --role-name cloudcart-ec2-role --policy-arn YOUR_POLICY_ARN
aws iam remove-role-from-instance-profile --instance-profile-name cloudcart-ec2-profile --role-name cloudcart-ec2-role
aws iam delete-instance-profile --instance-profile-name cloudcart-ec2-profile
aws iam delete-policy --policy-arn YOUR_POLICY_ARN
aws iam delete-role --role-name cloudcart-ec2-role
```

---

## 14. License & Author

Built as a production-style AWS Cloud & DevOps Architecture project demonstrating MERN full-stack skills.
