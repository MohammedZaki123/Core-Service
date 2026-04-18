# Quick-Bite Core Service

## Overview

The **Core Service** is the backbone API for the Quick-Bite food ordering and delivery platform, built with **Node.js**, **Express**, and **TypeScript**. It provides comprehensive REST endpoints for managing restaurants, branches, products, users, orders, and authentication, following a clean, layered architecture pattern with Dependency Injection.

## Key Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (RBAC)
- **Restaurant Management**: Create, update, and manage restaurants and their branches
- **Product Catalog**: Manage restaurant products with pricing and availability
- **User Management**: Comprehensive user account management with multiple user roles (Customer, Restaurant Owner, Admin)
- **Customer Addresses**: Manage delivery addresses with geolocation support
- **Health Monitoring**: Service health check endpoints
- **Security**: CORS, Helmet.js, SQL injection prevention, and secure authentication
- **Pagination**: Cursor-based pagination for efficient data retrieval
- **Error Handling**: Centralized error handling with correlation IDs for tracking
- **Idempotency**: Allow clients to safely retry the operation without causing duplicate actions

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Knex.js ORM
- **Caching**: Redis
- **Email**: Mailjet integration for transactional emails
- **Validation**: class-validator and class-transformer
- **Security**: bcrypt, helmet, CORS

## Project Structure

```
src/
├── app/                  # Business logic layer
│   ├── auth/            # Authentication & password reset
│   ├── user/            # User management
│   ├── restaurant/       # Restaurant management
│   ├── branch/          # Restaurant branch management
│   ├── product/         # Product catalog
│   ├── customer address/ # Address management
│   ├── rbac/            # Role-based access control
│   └── health/          # Health check endpoints
├── lib/                 # Shared utilities & libraries
│   ├── auth/            # Auth middleware & JWT utilities
│   ├── cache/           # Redis caching layer
│   ├── config/          # Environment & configuration
│   ├── error/           # Error handling & logging
│   ├── di/              # Dependency injection container
│   └── ...
├── migrations/          # Database migrations
└── pkg/                 # External packages & utilities
```

---

