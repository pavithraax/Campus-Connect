# 🎓 Campus Connect

A full-stack web application that connects students and administrators around campus events. Students can discover events, RSVP, and join discussions. Admins can create, edit, and manage events and track engagement.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

## ✨ Features

### Students
- 🔐 Register and log in as a **Student**
- 📅 Browse all campus events with search and filters (Today / This Week / This Month / Past)
- ✅ **RSVP** to events and track enrolled vs. attended events
- 💬 Join **Q&A discussions** on each event via comments
- 🗓️ View all events on an interactive **Calendar**
- 👤 Update profile name, password, and profile picture
- 🌗 Toggle **dark / light mode**

### Admins
- 🛠️ Log in as **Admin**
- ➕ **Create** events with title, description, date, location, and tags
- ✏️ **Edit** and 🗑️ **Delete** events
- 👥 View enrolled student list per event
- 📊 Dashboard overview — total events, total RSVPs, average RSVPs per event
- 🔍 Explore page to view all registered users

---

## 🛠️ Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 19, Framer Motion, react-big-calendar     |
| Styling   | Custom CSS (dark/light theme), Lucide icons     |
| Backend   | Node.js, Express 5                              |
| Database  | MongoDB with Mongoose ODM                       |
| Auth      | JWT (JSON Web Tokens) + bcryptjs                |
| Uploads   | Multer (profile picture storage)                |
| Toasts    | react-hot-toast                                 |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) running locally **or** a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/campus-connect.git
cd campus-connect
```

### 2. Configure environment variables

**Backend:**
```bash
cd backend
cp .env.example .env
# Open .env and set your MONGO_URI and JWT_SECRET
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# Set REACT_APP_API_BASE=http://localhost:5000 (default)
```

### 3. Install dependencies

From the **project root**:
```bash
npm run install:all
```

Or manually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Run the app

**Option A — Run both together (recommended):**
```bash
# From project root
npm run dev
```

**Option B — Run separately:**
```bash
# Terminal 1 — Backend (http://localhost:5000)
cd backend && npm run dev

# Terminal 2 — Frontend (http://localhost:3000)
cd frontend && npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
campus-connect/
├── backend/
│   ├── server.js          # Express app — all routes, schemas, middleware
│   ├── uploads/           # Profile picture storage (git-ignored)
│   ├── .env.example       # Environment variable template
│   └── package.json
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx         # Navigation with active-link highlight
│       │   ├── EventCard.jsx      # Event card with RSVP, comments
│       │   ├── EventForm.jsx      # Admin create/edit form
│       │   ├── CommentSection.jsx # Q&A discussion per event
│       │   └── Loader.jsx
│       ├── pages/
│       │   ├── HomePage.jsx       # Dashboard (student stats / admin overview)
│       │   ├── EventPage.jsx      # Event list with search & filters
│       │   ├── ExplorePage.jsx    # Trending events / User directory (admin)
│       │   ├── CalendarPage.jsx   # Calendar view of all events
│       │   └── ProfilePage.jsx    # Profile settings
│       ├── utils/
│       │   └── api.js             # Centralised fetch wrapper
│       ├── App.jsx                # Root component, auth, routing state
│       ├── App.css                # Dark theme styles
│       └── light-theme.css        # Light theme overrides
│
├── .gitignore
├── package.json           # Root scripts (dev, install:all)
└── README.md
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint       | Description             | Auth |
|--------|---------------|-------------------------|------|
| POST   | `/api/signup` | Register a new user     | No   |
| POST   | `/api/login`  | Login and get JWT token | No   |

### Events
| Method | Endpoint                   | Description               | Auth   |
|--------|---------------------------|---------------------------|--------|
| GET    | `/api/events`             | Get all events (populated)| No     |
| POST   | `/api/events/create`      | Create event              | Admin  |
| PUT    | `/api/events/:id`         | Edit event                | Admin  |
| DELETE | `/api/events/:id`         | Delete event + comments   | Admin  |
| POST   | `/api/events/:id/rsvp`    | RSVP to event             | Student|
| DELETE | `/api/events/:id/rsvp`    | Cancel RSVP               | Student|
| POST   | `/api/events/:id/comment` | Post a comment            | Any    |

### Profile
| Method | Endpoint                | Description              | Auth |
|--------|------------------------|--------------------------|------|
| GET    | `/api/users`           | List all students        | Admin|
| PUT    | `/api/profile/name`    | Update display name      | Any  |
| PUT    | `/api/profile/password`| Change password          | Any  |
| POST   | `/api/profile/picture` | Upload profile picture   | Any  |

---

## 🐛 Bug Fixes (from original code)

| # | Bug | Fix Applied |
|---|-----|-------------|
| 1 | `event.location.toLowerCase()` crash when location is `null` | Added `(event.location \|\| "")` guard in EventPage search filter |
| 2 | RSVP check used `r.id` / `r._id` inconsistently, causing enrolled state to never match | Unified to `r?._id?.toString() === currentUserId?.toString()` |
| 3 | Auth login card was pushed under navbar due to `margin-top: 100px` on `<main>` | Separated auth and dashboard layouts — auth uses flex-center, dashboard uses `.page-content` |
| 4 | `backend/uploads/` directory not created at startup — multer crashes on first upload | Added `fs.mkdirSync` with `{ recursive: true }` at server startup |
| 5 | Deleting an event left orphaned Comment documents in the database | `Comment.deleteMany({ event: eventId })` called before event deletion |
| 6 | Empty 3rd email `<a href="mailto:">` in ProfilePage contact section | Removed empty entry |
| 7 | No file type validation on profile picture upload | Added `mimetype.startsWith('image/')` filter in multer config |
| 8 | No password length validation before hashing | Added `minLength: 6` check on both client and server |

---

## 👥 Team

- **Aarya Tedla** — aaryatedla@gmail.com
- **Pavithraa** — pavithraa2007@gmail.com
- **Mathur** — 9019969870

---

## 📄 License

This project is for educational purposes. All rights reserved by the team.
