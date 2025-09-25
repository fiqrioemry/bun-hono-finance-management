# 💰 Finance Management API – Backend RESTful Service

A comprehensive finance management RESTful API built with Hono.js, providing secure user authentication, transaction management, and financial data tracking. This backend service features JWT authentication, OTP verification, real-time rate limiting, and cloud-based file storage, designed for scalability and security.

---

## 1. Project Overview

This finance management API enables users to track their financial transactions, manage categories, and maintain account balances. The system provides secure authentication with OTP verification, comprehensive transaction management with filtering capabilities, and user profile management with image upload support. Built with modern TypeScript and Bun runtime for optimal performance.

---

## 2. Project Requirements

- Enable secure user registration with OTP email verification
- Implement JWT-based authentication with refresh token support
- Allow users to manage transaction categories (income/expense)
- Provide comprehensive transaction tracking with filtering
- Support account balance management with real-time updates
- Implement rate limiting and security middleware
- Enable profile management with image upload to cloud storage
- Provide password reset functionality via email
- Support containerized deployment with Docker

---

## 3. The Challenge

Building a finance management API required solving several complex challenges:

- Implementing secure authentication with OTP verification and JWT tokens
- Managing real-time balance calculations with transaction consistency
- Handling file uploads securely with validation and cloud storage
- Implementing proper error handling and validation across all endpoints
- Ensuring data integrity with database transactions
- Setting up comprehensive middleware for security and logging
- Creating scalable architecture with proper separation of concerns

---

## 4. The Approach & Solution

The backend is built using Hono.js framework with TypeScript for type safety and better development experience. PostgreSQL with Prisma ORM handles structured data storage, while Redis manages session caching and rate limiting. JWT tokens provide secure authentication with refresh token rotation. Cloudinary handles media uploads with proper validation and transformation.

The architecture follows a modular approach with separate layers for controllers, services, middleware, and utilities. Each module (auth, users, categories, transactions) is self-contained with its own routes, controllers, services, and validation schemas.

---

## 5. Key Features

🔐 **Authentication System**
- Email-based registration with OTP verification
- JWT access & refresh token authentication
- Password reset via email links
- Session management with Redis caching

💰 **Transaction Management**
- Create, read, update, delete transactions
- Real-time balance calculation and updates
- Advanced filtering (date range, category, account, search)
- Transaction history with pagination

📊 **Category Management**
- Custom user categories (income/expense)
- Default system categories available
- Category validation and constraint checking
- CRUD operations with transaction protection

👤 **User Management**
- Profile management with image upload
- Secure password change functionality
- User session tracking and validation
- Account data with proper relationships

🛡️ **Security & Middleware**
- Rate limiting with Redis backend
- Input validation with Zod schemas
- File upload validation and sanitization
- Comprehensive error handling and logging

☁️ **Cloud Integration**
- Cloudinary image upload and transformation
- Email service integration (Nodemailer)
- Redis caching and session management
- Docker containerization support

---

## 6. Tech Stack

### 6.1 Runtime & Framework
- **Bun** (JavaScript runtime)
- **Hono.js** (Web framework)
- **TypeScript** (Type safety)

### 6.2 Database & ORM
- **PostgreSQL** (Primary database)
- **Prisma ORM** (Database toolkit)
- **Redis** (Caching & sessions)

### 6.3 Authentication & Security
- **JWT** (JSON Web Tokens)
- **bcryptjs** (Password hashing)
- **Zod** (Schema validation)
- **Rate limiting** (Redis-based)

### 6.4 External Services
- **Cloudinary** (Image storage)
- **Nodemailer** (Email service)
- **Pino** (Structured logging)

### 6.5 DevOps & Deployment
- **Docker** (Containerization)
- **Docker Compose** (Multi-service setup)

---

## 7. API Endpoints

### 7.1 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/verify-otp` | Verify OTP and activate account |
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/logout` | User logout |
| POST | `/api/v1/auth/refresh-token` | Refresh access token |
| GET | `/api/v1/auth/get-session` | Get current user session |
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| POST | `/api/v1/auth/reset-password` | Reset password with token |

### 7.2 User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/profile` | Get user profile |
| PUT | `/api/v1/users/profile` | Update user profile with image |

### 7.3 Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/categories` | Get all categories (user + system) |
| POST | `/api/v1/categories` | Create new category |
| PUT | `/api/v1/categories/:id` | Update category |
| DELETE | `/api/v1/categories/:id` | Delete category |

### 7.4 Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/transactions` | Get transactions with filters |
| POST | `/api/v1/transactions` | Create new transaction |

**Query Parameters for Transactions:**
- `startDate` - Filter by start date (YYYY-MM-DD)
- `endDate` - Filter by end date (YYYY-MM-DD)
- `search` - Search in description, merchant name/location
- `accountId` - Filter by account ID
- `categoryId` - Filter by category ID
- `type` - Filter by type (INCOME/EXPENSE)
- `page` - Pagination page number
- `limit` - Items per page limit

### 7.5 Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API welcome message |
| GET | `/health` | Health check endpoint |

---

## 8. Database Schema

### 8.1 Core Models

**User**
```typescript
model User {
  id             String    @id @default(uuid())
  email          String    @unique
  image          String    
  hashedPassword String
  name           String
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  categories     Category[]
  accounts       Account[]
}
```

**Category**
```typescript
model Category {
  id           String          @id @default(uuid())
  userId       String?  
  name         String
  type         TransactionType
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt
  transactions Transaction[]
  user         User?           @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Account**
```typescript
model Account {
  id           String        @id @default(uuid())
  userId       String
  name         String
  type         AccountType
  balance      Float         @default(0)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  transactions Transaction[]
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Transaction**
```typescript
model Transaction {
  id               String          @id @default(uuid())
  accountId        String
  categoryId       String
  amount           Float
  type             TransactionType
  description      String?
  initialBalance   Float           @default(0)
  finalBalance     Float           @default(0)
  merchantName     String?
  merchantLocation String?
  transactionTime  String
  transactionDate  DateTime        @default(now())
  createdAt        DateTime        @default(now())
  account          Account         @relation(fields: [accountId], references: [id], onDelete: Cascade)
  category         Category        @relation(fields: [categoryId], references: [id], onDelete: Cascade)
}
```

---

## 9. Project Structure

```
📁 src/
├── 📁 config/           # Configuration files
│   ├── cloudinary.ts    # Cloudinary setup
│   ├── database.ts      # Prisma client
│   ├── logger.ts        # Pino logger
│   ├── mailer.ts        # Nodemailer setup
│   └── redis.ts         # Redis client
├── 📁 middlewares/      # Middleware functions
│   ├── auth.ts          # JWT authentication
│   ├── errors.ts        # Error handling
│   ├── limitter.ts      # Rate limiting
│   ├── logging.ts       # Request logging
│   ├── uploader.ts      # File upload validation
│   └── validation.ts    # Zod validation
├── 📁 modules/          # Feature modules
│   ├── 📁 auth/         # Authentication module
│   ├── 📁 categories/   # Categories module
│   ├── 📁 transactions/ # Transactions module
│   └── 📁 users/        # Users module
├── 📁 utils/            # Utility functions
│   ├── constant.ts      # Environment constants
│   ├── generate.ts      # Password & token generation
│   ├── http-response.tsx# HTTP response helpers
│   ├── jwt.ts           # JWT utilities
│   ├── mailer.ts        # Email templates
│   └── uploader.ts      # Cloudinary upload
├── index.ts             # Application entry point
└── routes.ts            # Route configuration

📁 prisma/
├── migrations/          # Database migrations
├── schema.prisma        # Database schema
└── seed.ts             # Database seeding

📁 root files
├── docker-compose.yml   # Docker compose config
├── Dockerfile          # Docker configuration
├── deploy.sh           # Deployment script
└── package.json        # Dependencies
```

---

## 10. Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
SERVER_PORT=8000
SERVER_URL=http://localhost:8000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
APP_NAME="Finance Management API"

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/finance_db"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT Secrets
ACCESS_TOKEN_SECRET="your-super-secure-access-secret-key-here"
REFRESH_TOKEN_SECRET="your-super-secure-refresh-secret-key-here"
ACCESS_EXPIRES_IN="15m"
REFRESH_EXPIRES_IN="7d"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
CLOUD_FOLDER="finance-app"

# Email Configuration (Gmail SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

---

## 11. Installation & Setup

### 11.1 Prerequisites
- **Bun** (latest version)
- **PostgreSQL** (14+)
- **Redis** (6+)
- **Docker** (optional)

### 11.2 Local Development

1. **Clone Repository**
```bash
git clone https://github.com/fiqrioemry/bun-hono-finance-management.git
cd bun-hono-finance-management
```

2. **Install Dependencies**
```bash
bun install
```

3. **Setup Environment**
```bash
cp .env.example .env
# Edit .env file with your configuration
```

4. **Database Setup**
```bash
# Generate Prisma client
bunx prisma generate

# Run migrations
bunx prisma migrate dev

# Seed database (optional)
bunx prisma db seed
```

5. **Start Development Server**
```bash
bun run dev
```

The API will be available at `http://localhost:8000`

### 11.3 Docker Deployment

1. **Using Docker Compose**
```bash
# Build and start services
docker-compose up -d --build

# Run migrations in container
docker exec finance-management-hono-backend bunx prisma migrate deploy

# Seed database (optional)
docker exec finance-management-hono-backend bunx prisma db seed
```

2. **Using Deployment Script**
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 12. API Usage Examples

### 12.1 Authentication Flow

**Register User**
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "confirmPassword": "securePassword123"
  }'
```

**Verify OTP**
```bash
curl -X POST http://localhost:8000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "otp": "123456"
  }'
```

### 12.2 Transaction Management

**Create Transaction**
```bash
curl -X POST http://localhost:8000/api/v1/transactions \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=your-jwt-token" \
  -d '{
    "accountId": "uuid-account-id",
    "categoryId": "uuid-category-id",
    "amount": 100.00,
    "type": "EXPENSE",
    "description": "Grocery shopping",
    "transactionDate": "2025-01-15"
  }'
```

**Get Transactions with Filters**
```bash
curl "http://localhost:8000/api/v1/transactions?startDate=2025-01-01&endDate=2025-01-31&type=EXPENSE&page=1&limit=10" \
  -H "Cookie: accessToken=your-jwt-token"
```

---

## 13. Testing

### 13.1 Running Tests
```bash
# Run unit tests
bun test

# Run tests with coverage
bun test --coverage

# Run specific test file
bun test auth.test.ts
```

### 13.2 API Testing
Use tools like **Postman**, **Insomnia**, or **curl** to test the API endpoints. Import the provided collection for easier testing.

---

## 14. Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 15. Performance & Monitoring

### 15.1 Logging
The application uses structured logging with Pino:
- Request/response logging
- Error tracking with stack traces
- Performance monitoring
- Security event logging

### 15.2 Rate Limiting
- Global rate limit: 100 requests per minute per IP/user
- Authentication endpoints: Stricter limits
- Configurable per endpoint

---

## 📩 16. Contact & Support

- 🧑‍💻 **Developer**: Ahmad Fiqri Oemry
- ✉️ **Email**: fiqrioemry@gmail.com | ahmadfiqrioemry@gmail.com  
- 🔗 **LinkedIn**: [linkedin.com/in/ahmadfiqrioemry](https://linkedin.com/in/ahmadfiqrioemry)
- 🌐 **Website**: [ahmadfiqrioemry.com](https://ahmadfiqrioemry.com)
- 📱 **GitHub**: [github.com/fiqrioemry](https://github.com/fiqrioemry)

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**⭐ If you find this project useful, please give it a star on GitHub!**