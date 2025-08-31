# Park Sarthi - Smart Parking Management Platform

## Overview

Park Sarthi is a comprehensive gamified parking management platform that simplifies the parking experience for users while providing business solutions for parking operators. The platform features real-time parking availability, pre-booking capabilities, traffic challan management, document storage, EV charging station integration, and a reward-based gamification system. Built as a full-stack web application with modern React frontend and Express backend, it integrates with external services like Mappls for location services, Firebase for authentication, and Google's Gemini AI for intelligent chatbot assistance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **State Management**: TanStack Query for server state management and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for REST API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Firebase Authentication with phone number verification
- **Session Management**: Express sessions with PostgreSQL store using connect-pg-simple

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon for scalable cloud database
- **Schema Management**: Drizzle Kit for database migrations and schema evolution
- **File Storage**: Firebase Storage for document uploads (licenses, RC, PUC certificates)
- **Session Store**: PostgreSQL-backed session storage for user authentication state

### Authentication and Authorization
- **Primary Auth**: Firebase Authentication with phone number and OTP verification
- **Session Management**: Server-side sessions stored in PostgreSQL
- **User Management**: Custom user profiles with points, levels, and achievement tracking
- **Authorization**: Role-based access for regular users vs business clients

### Gamification System
- **Points System**: Users earn points for various activities (bookings, referrals, etc.)
- **Level Progression**: Multi-tier level system with increasing benefits
- **Achievements**: Badge system for milestone rewards and engagement
- **Rewards**: Point redemption system for discounts and premium features

### API Structure
- **REST Endpoints**: Organized around resources (bookings, users, documents, business inquiries)
- **Error Handling**: Centralized error handling with appropriate HTTP status codes
- **Request Validation**: Zod schemas for type-safe request/response validation
- **Logging**: Structured API request/response logging for monitoring

### Real-time Features
- **Live Data**: Real-time parking availability updates
- **WebSocket Support**: Prepared infrastructure for real-time notifications
- **Optimistic Updates**: Client-side optimistic updates with server reconciliation

## External Dependencies

### Location Services
- **Mappls API**: Primary mapping and location service for Indian market with API key b963a6654470c7b9e0683f0a979ffa16
- **Features**: Real-time navigation, parking spot visualization, EV station locations, route optimization

### AI and Machine Learning
- **Google Gemini AI**: Conversational AI for customer support chatbot
- **Capabilities**: Context-aware responses, parking assistance, feature guidance, multilingual support

### Authentication Provider
- **Firebase Authentication**: Phone number verification and user management
- **Project**: iit-indore-22e05 Firebase project
- **Features**: OTP verification, secure token management, user profile integration

### Database and Infrastructure
- **Neon PostgreSQL**: Serverless PostgreSQL database for production scalability
- **Connection**: Configured via DATABASE_URL environment variable
- **Features**: Auto-scaling, connection pooling, backup management

### Third-party Integrations
- **Payment Gateway**: Prepared for integration with Indian payment providers
- **SMS Service**: Firebase handles OTP delivery for phone verification
- **Email Service**: Ready for transactional email integration
- **Push Notifications**: Firebase infrastructure prepared for mobile notifications

### Development and Deployment
- **Replit Platform**: Primary development and hosting environment
- **CDN**: Asset optimization and delivery
- **Monitoring**: Error tracking and performance monitoring capabilities
- **Analytics**: User behavior tracking and business intelligence preparation
