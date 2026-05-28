# Authentication Flow Documentation

## Type Checking

Run `npm run check` to type-check the project. Note: there are pre-existing errors in legacy `AdminOld`/`LedenOld` code that can be ignored.

## Overview

This project implements a registration and login flow using:
- **Faroe** (Go auth server) - Handles authentication primitives
- **Backend API** (Python) - Manages user data and newuser pre-registration
- **Frontend** (React with React Router 7) - User interface

## Architecture

### Components

1. **tiauth-faroe** (Port 12770)
   - Go-based Faroe server distribution
   - Handles signup, signin, password reset, etc.
   - Uses external user store (our Python backend)
   - Sends verification emails via SMTP

2. **dodeka/backend** (Port 12780)
   - Python API server using hfree
   - Implements Faroe user store protocol
   - Manages newusers pre-registration flow
   - Provides session management endpoints

3. **dodekafrontend** (this repo)
   - React application with React Router 7
   - Consumes both Faroe and backend APIs
