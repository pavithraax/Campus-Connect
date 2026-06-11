<div align="center">

# Campus Connect

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-FB015B?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

A full-stack campus event management platform. Students discover and RSVP to events, participate in discussions, and track their activity — while admins manage events and monitor engagement from a dedicated dashboard.

</div>

---

## Overview

Campus Connect is built around two distinct user roles. Students get a personalized feed of campus events with filtering, an RSVP system, a comment thread per event for Q&A, a calendar view, and a profile page. Admins get full CRUD over events, a dashboard with engagement metrics, and a directory of all registered students.

The app uses JWT-based authentication so sessions persist across page refreshes without a backend session store. Passwords are hashed with bcryptjs before storage. Profile picture uploads are handled server-side by Multer and served as static files. The frontend supports a dark and light theme, with preference saved to localStorage.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 19 | Component-based UI with hooks |
| Animations | Framer Motion | Page transitions and card animations |
| Calendar | react-big-calendar | Interactive monthly/weekly event view |
| Styling | Custom CSS — dark + light themes | Full design control, no component library |
| Backend | Node.js + Express 5 | Lightweight REST API |
| Database | MongoDB + Mongoose | Flexible document model for events and users |
| Auth | JWT + bcryptjs | Stateless sessions, secure password storage |
| File Uploads | Multer | Profile picture handling with type validation |
| Notifications | react-hot-toast | Non-blocking in-app feedback |

---

## Features

**Students**
- Register and log in with role-based access
- Browse events with search and time filters (Today, This Week, This Month, Past)
- RSVP to events and track enrollment history on the home dashboard
- Comment on events for Q&A
- View all events on an interactive calendar
- Update display name, password, and profile picture
- Toggle between dark and light mode

**Admins**
- Create events with title, description, date, location, and tags
- Edit and delete events
- View the full list of students enrolled in each event
- Dashboard showing total events, total RSVPs, and average RSVPs per event
- Browse all registered users on the Explore page

---

## Project Structure

```
campus-connect/
├── backend/
│   ├── server.js              # Express app — schemas, routes, middleware
│   ├── uploads/               # Stored profile pictures (git-ignored)
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx         # Navigation bar with active page highlight
│       │   ├── EventCard.jsx      # Event card with RSVP and comment toggle
│       │   ├── EventForm.jsx      # Admin form for creating and editing events
│       │   ├── CommentSection.jsx # Per-event comment thread
│       │   └── Loader.jsx
│       ├── pages/
│       │   ├── HomePage.jsx       # Dashboard — student stats or admin overview
│       │   ├── EventPage.jsx      # Event list with search and filters
│       │   ├── ExplorePage.jsx    # Trending events (student) / user directory (admin)
│       │   ├── CalendarPage.jsx   # Calendar view of all events
│       │   └── ProfilePage.jsx    # Profile settings and picture upload
│       ├── utils/
│       │   └── api.js             # Fetch wrapper that attaches JWT headers
│       ├── App.jsx                # Root — auth state, routing, theme
│       ├── App.css                # Dark theme
│       └── light-theme.css        # Light theme overrides
│
├── .gitignore
├── package.json                   # Root scripts using concurrently
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or above
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string
- [Git](https://git-scm.com/)

### 1. Clone the repository

```bash
git clone https://github.com/pavithraax/Campus-Connect.git
cd Campus-Connect
```

### 2. Configure environment variables

**Backend** — copy the template and fill in your values:

```bash
cd backend
cp .env.example .env   # use 'copy' on Windows
```

```env
MONGO_URI=mongodb://127.0.0.1:27017/campus-connect
JWT_SECRET=your_long_random_secret_here
PORT=5000
FRONTEND_ORIGIN=http://localhost:3000
```

**Frontend** — copy the template:

```bash
cd ../frontend
cp .env.example .env   # use 'copy' on Windows
```

```env
REACT_APP_API_BASE=http://localhost:5000
```

### 3. Install dependencies

From the project root, this installs both frontend and backend in one command:

```bash
cd ..
npm run install:all
```

### 4. Start the development server

```bash
npm run dev
```

This runs the backend on `http://localhost:5000` and the frontend on `http://localhost:3000` concurrently. Open the frontend URL in your browser.

To run them separately:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start
```

---

## API Reference

Base URL: `http://localhost:5000`

**Auth**

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/signup` | Register a new student or admin account | None |
| POST | `/api/login` | Authenticate and receive a JWT | None |

**Events**

| Method | Endpoint | Description | Role |
|---|---|---|---|
| GET | `/api/events` | Fetch all events with RSVP and comment data | Public |
| POST | `/api/events/create` | Create a new event | Admin |
| PUT | `/api/events/:id` | Update an event | Admin |
| DELETE | `/api/events/:id` | Delete an event and its associated comments | Admin |
| POST | `/api/events/:id/rsvp` | RSVP to an event | Student |
| DELETE | `/api/events/:id/rsvp` | Cancel an RSVP | Student |
| POST | `/api/events/:id/comment` | Post a comment on an event | Any |

**Profile**

| Method | Endpoint | Description | Role |
|---|---|---|---|
| GET | `/api/users` | List all registered students | Admin |
| PUT | `/api/profile/name` | Update display name | Any |
| PUT | `/api/profile/password` | Change password | Any |
| POST | `/api/profile/picture` | Upload a profile picture | Any |

---

## Team

| Name | Contact |
|---|---|
| Aarya Tedla | aaryatedla@gmail.com |
| Pavithraa | pavithraa2007@gmail.com |
| Tanisha Mathur | 9019969870 |

---

*Built as a full-stack engineering project. For educational use.*
