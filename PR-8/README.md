# Admin Panel - Ch-12

A full-featured Node.js Admin Panel application with authentication, product management, category management, and more.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [API Routes](#api-routes)
- [Features Details](#features-details)

## Features

✨ **Core Features:**
- **Admin Authentication** - Secure login/logout with Passport.js local strategy
- **Password Management** - Change password, reset password with email verification
- **Email Verification** - OTP-based email verification system
- **Category Management** - Create, read, update, delete product categories
- **Subcategory Management** - Manage subcategories within categories
- **Extra Category Management** - Handle additional category types
- **Product Management** - Full CRUD operations for products with image uploads
- **Admin Management** - Manage multiple admin accounts
- **File Uploads** - Multer integration for image uploads
- **Session Management** - Secure session handling with express-session
- **Flash Messages** - User feedback with connect-flash
- **Responsive Dashboard** - Modern admin dashboard interface

## Tech Stack

- **Backend Framework:** Express.js 5.2.1
- **Database:** MongoDB (Mongoose 9.1.1)
- **Template Engine:** EJS 3.1.10
- **Authentication:** Passport.js with Local Strategy
- **File Upload:** Multer 2.0.2
- **Session Management:** express-session 1.19.0
- **Email Service:** Nodemailer 7.0.12
- **Runtime:** Node.js with Nodemon for development
- **Frontend Libraries:** Bootstrap 4, Chart.js, Owl Carousel

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB (local or cloud instance)

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd /Users/rushi/JioCloud/NODE-JS/PR-8
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables** (see Configuration section below)

4. **Start the development server:**
   ```bash
   npm start
   ```

The application will start on `http://localhost:8090`

## Configuration

### Database Configuration
Edit `config/db.config.js` to configure your MongoDB connection:
```javascript
// Update with your MongoDB connection string
const db_url = 'your_mongodb_connection_string';
```

### Session Configuration
Session settings in `server.js`:
- Session Name: `DarkAdminPanelSession`
- Secret Key: `dark@12345` (change this in production)
- Session Timeout: 24 hours

### Email Configuration
Configure Nodemailer in the authentication controller for email verification features.

## Project Structure

```
PR-8/
├── config/              # Configuration files
│   └── db.config.js     # MongoDB connection
├── controllers/         # Request handlers
│   ├── admin.controller.js
│   ├── auth.controller.js
│   ├── category.controller.js
│   ├── product.controller.js
│   ├── subcategory.controller.js
│   └── extraCategory.controller.js
├── Middleware/          # Custom middlewares
│   ├── passport.local.middleware.js
│   ├── connectFlash.middleware.js
│   ├── multer.middleware.js
│   └── product.multer.middleware.js
├── model/               # Database schemas
│   ├── admin.model.js
│   ├── category.model.js
│   ├── product.model.js
│   ├── subcategory.model.js
│   └── extracategory.model.js
├── routes/              # API routes
│   ├── index.js
│   ├── admin.routes.js
│   ├── category.routes.js
│   ├── product.routes.js
│   └── subcategory.routes.js
├── views/               # EJS templates
│   ├── dashboard.ejs
│   ├── header.ejs
│   ├── footer.ejs
│   ├── admin/           # Admin management pages
│   ├── auth/            # Authentication pages
│   ├── category/        # Category management pages
│   ├── product/         # Product management pages
│   ├── subcategory/     # Subcategory management pages
│   └── profile/         # User profile pages
├── public/              # Static assets
│   ├── css/
│   ├── js/
│   └── lib/
├── uploads/             # User uploaded files
│   ├── admin/
│   ├── category/
│   └── product/
├── server.js            # Main application file
└── package.json         # Project dependencies
```

## Usage

### Starting the Server

**Development mode with auto-reload:**
```bash
npm start
```

The server will be available at `http://localhost:8090`

### Default Routes

- **Login Page:** `/`
- **Dashboard:** `/dashboard`
- **Logout:** `/logout`
- **Change Password:** `/changepasswordpage`

## API Routes

### Authentication Routes
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Login page |
| POST | `/login` | Login process |
| GET | `/logout` | Logout |
| GET | `/changepasswordpage` | Change password page |
| POST | `/changepassword` | Change password |
| POST | `/verify-email` | Verify email with OTP |
| GET | `/otppage` | OTP verification page |
| POST | `/otpverify` | Verify OTP |
| GET | `/dashboard` | Admin dashboard |

### Admin Routes
- `/admin` - Admin management endpoints

### Category Routes
- `/category` - Category management endpoints

### Product Routes
- `/product` - Product management endpoints

### Subcategory Routes
- `/subcategory` - Subcategory management endpoints

### Extra Category Routes
- `/extracategory` - Extra category management endpoints

## Features Details

### Authentication
- Secure login using Passport.js Local Strategy
- Password encryption and verification
- Session-based authentication
- Logout functionality

### Email Verification
- OTP-based email verification using Nodemailer
- Password reset via email
- Email verification during authentication

### File Management
- Product image uploads using Multer
- Category image uploads
- Admin profile images
- Organized upload directories

### Dashboard
- Centralized admin dashboard
- Charts and statistics
- Quick access to all management features

### Admin Management
- Create, read, update, delete admin accounts
- Admin role management
- Activity tracking

### Product Management
- Full CRUD operations
- Multiple image uploads
- Categorization
- Stock management

### Category Management
- Main category management
- Subcategory organization
- Extra categories
- Hierarchical structure

## Security Features

- Password hashing and encryption
- Session-based authentication
- CSRF protection via flash messages
- Input validation and sanitization
- Secure cookie handling
- File upload validation

## Future Enhancements

- Role-based access control (RBAC)
- API documentation with Swagger
- Unit and integration tests
- Analytics and reporting
- Multi-language support
- Two-factor authentication (2FA)

## License

ISC

## Author

Created for learning and development purposes.

---

For more information or support, please refer to the project documentation or contact the development team.
