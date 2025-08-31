# Park Sarthi - Smart Parking Management Platform

## Overview

Park Sarthi is a comprehensive gamified parking management platform that simplifies the parking experience for users while providing business solutions for parking operators. The platform features real-time parking slot booking, document management, vehicle services, gamification elements, and AI-powered assistance. Built as a modern web application with a React frontend and Express backend, it integrates Firebase authentication, PostgreSQL database, and Mappls mapping services to deliver a complete parking ecosystem.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development experience
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **State Management**: TanStack Query for server state management and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing 
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: Radix UI primitives with custom styling for professional design consistency

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for REST API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: Dedicated storage layer with memory-based implementation for development
- **API Structure**: RESTful endpoints organized by resource domains (users, bookings, documents, business inquiries)
- **Error Handling**: Centralized error handling middleware with structured logging

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon for scalable cloud database operations
- **Schema Management**: Drizzle Kit for database migrations and schema evolution
- **ORM**: Drizzle ORM for type-safe database queries and operations
- **Connection Pooling**: Neon serverless connection pooling for efficient database access

### Authentication and Authorization
- **Primary Auth**: Firebase Authentication with phone number and email verification
- **Session Management**: Custom storage layer managing user sessions and authentication state
- **User Profiles**: Comprehensive user management with points, levels, achievements, and wallet tracking
- **Role-based Access**: Differentiation between regular users and business clients

### Gamification System
- **Points System**: Users earn points for various activities (bookings, referrals, interactions)
- **Level Progression**: Multi-tier level system with increasing benefits and rewards
- **Achievement System**: Badge-based achievements for milestone rewards and user engagement
- **Wallet Integration**: Point-based wallet system for payments and reward redemption
- **Tier Management**: Bronze, silver, gold, platinum tiers with progressive benefits

### Real-time Features
- **Live Parking Availability**: Dynamic slot availability updates across multiple locations
- **Real-time Booking**: Instant booking confirmations and slot status changes
- **Location Tracking**: GPS-based services for parking spot navigation and proximity detection
- **Push Notifications**: Real-time updates for bookings, payments, and system notifications

## External Dependencies

### Core Services
- **Firebase**: Authentication, storage, and real-time database capabilities
- **Neon PostgreSQL**: Cloud-hosted PostgreSQL database with serverless features
- **Google AI (Gemini)**: AI-powered chatbot assistance and natural language processing

### Mapping and Location
- **Mappls (MapMyIndia)**: Indian mapping service for navigation, directions, and location services
- **Geolocation APIs**: Browser-based location services for parking spot discovery

### Payment and Communication
- **EmailJS**: Client-side email services for contact forms and notifications
- **Nodemailer**: Server-side email delivery for business communications
- **Payment Gateway Integration**: Wallet-based payment system with point redemption

### Development and Deployment
- **Vite**: Frontend build tool with hot module replacement and optimized bundling
- **Drizzle Kit**: Database migration and schema management tool
- **Replit**: Development and deployment platform with integrated development tools

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Headless component library for accessible UI components
- **Font Awesome**: Icon library for consistent visual elements
- **Google Fonts**: Typography system with Inter font family

### Utility Libraries
- **Zod**: Schema validation for type-safe API requests and responses
- **React Hook Form**: Form state management with validation
- **React Query**: Server state management and caching
- **Wouter**: Lightweight routing library for single-page application navigation