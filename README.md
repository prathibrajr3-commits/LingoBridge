Read [](file:///c%3A/Users/DELL7420/OneDrive/Documents/GitHub/ProgettoBCC/README.md)

Read [](file:///c%3A/Users/DELL7420/OneDrive/Documents/GitHub/ProgettoBCC/src/models.py#1-1), lines 1 to 50

Read [](file:///c%3A/Users/DELL7420/OneDrive/Documents/GitHub/ProgettoBCC/src/routes/main/dashboard.py)

Read [](file:///c%3A/Users/DELL7420/OneDrive/Documents/GitHub/ProgettoBCC/requirements.txt)

Here's an explanation of your **ProgettoBCC** project:

## **Project Overview**
This is a **Flask-based web application** for managing events and user interactions, likely designed for a Banking/Financial institution (BCC = Banca Credito Cooperativo, an Italian cooperative bank).

## **Key Features:**

### 1. **User Management**
- User registration and login system
- Role-based access (regular users and admin users)
- Email validation
- Secure password hashing

### 2. **Event Management**
- Add, delete, and manage events
- View events by day, week, or month
- Calendar-based interface

### 3. **Admin Dashboard**
- Admin-only statistics and event management
- Separate admin routes and interface

### 4. **Interactive Features**
- Operator dashboard
- Chat functionality
- Q&A system (question routes)
- Responsive UI with Tailwind CSS

## **Technology Stack:**
- **Backend:** Flask (Python web framework)
- **Database:** MySQL
- **Frontend:** HTML templates, CSS (Tailwind), JavaScript
- **Authentication:** Flask-Login
- **Containerization:** Docker & Docker Compose
- **Testing:** Pytest

## **Architecture:**
```
Routes: Main (login/dashboard), API (events/chat/questions), Admin (stats)
      ↓
Models: User system with role-based access
      ↓
Database: MySQL for data persistence
      ↓
Frontend: HTML templates + CSS/JS for UI
```

**In simple terms:** It's an event management system with user authentication, role-based access, and calendar functionality, likely for banking operations or customer management.

Would you like me to create a more detailed README documenting all features, API endpoints, and setup instructions?
