# 📁 Project File Structure - DevPost Manager

This document explains the folder and file structure of the DevPost Manager project. The project is structured into two main parts: the client (frontend) and the server (backend). This modular separation helps in maintaining clarity and scalability.

---

## 🗂️ Root Directory

```
devpost-manager/
├── client/          # Frontend using HTML, CSS, JS
├── server/          # Backend using Node.js and Express
├── docs/            # Project documentation and design files
├── scripts/         # Scripts for DB setup, deployment, etc.
├── .env             # Environment variables (NEVER push to GitHub)
└── README.md        # Project overview and setup instructions
```

---

## 📁 client/ – Frontend

**Purpose:** Handles all user interface and browser-side logic.

```
client/
├── index.html           # Main entry point (landing page)
├── css/
│   └── style.css        # Main stylesheet
├── js/
│   ├── main.js          # Generic JavaScript (UI behaviors, init)
│   ├── auth.js          # Login, Signup, Logout handling
│   ├── github.js        # GitHub OAuth and API integration
│   ├── postGenerator.js # Post creation logic based on GitHub data
│   └── postPublisher.js # Logic for publishing posts to LinkedIn/X
├── pages/
│   └── dashboard.html   # User dashboard or other static pages
└── assets/
    └── [images, icons, fonts, etc.]
```

> You can later break this into modules or components if the frontend grows.

---

## 🧠 server/ – Backend

**Purpose:** Handles API endpoints, database logic, GitHub & social integrations.

```
server/
├── src/
│   ├── config/             # Configurations like DB, GitHub OAuth
│   │   └── githubOAuth.ts  # GitHub client ID, secret config
│   ├── controllers/        # Route logic handlers
│   │   ├── authController.ts
│   │   ├── githubController.ts
│   │   └── postController.ts
│   ├── middlewares/        # Middleware functions (auth, errors, CORS)
│   ├── models/             # DB models (User, Post, Activity)
│   ├── routes/             # Express route files
│   │   ├── authRoutes.ts
│   │   ├── githubRoutes.ts
│   │   └── postRoutes.ts
│   ├── services/           # External APIs or business logic
│   │   ├── githubService.ts
│   │   ├── postService.ts
│   │   └── publisherService.ts
│   ├── utils/              # Utility functions
│   ├── app.ts              # Express app configuration
│   └── server.ts           # Entry point (listen on port)
├── package.json            # Backend dependencies
└── .env                    # Server environment variables
```

> Use `.env` for sensitive variables like DB URIs, GitHub tokens, etc.

---

## 📚 docs/ – Documentation

**Purpose:** Contains planning, diagrams, and documentation.

```
docs/
├── file-structure.md      # (This file)
├── api-design.md          # Optional: API contract between frontend and backend
├── tech-stack.md          # Tools and libraries used
└── post-templates.md      # Optional: Sample post formats or ideas
```

---

## ⚙️ scripts/ – Automation & Tools

**Purpose:** Useful for automating setup, deployment, or DB resets.

```
scripts/
├── init-db.sh             # Shell script to initialize the DB
└── deploy.sh              # Optional deployment script
```

---

## ✅ Best Practices

- Stick to **Single Responsibility Principle** – one file does one thing.
- Separate **concerns**: UI (HTML/CSS/JS), logic (controllers/services), and data (models).
- Keep `env` files **out of version control** (use `.gitignore`).
- Write clear comments and meaningful commit messages.
- Document any major architectural decision in `docs/`.

---

## 🚀 Future Tips

- Consider using **ES6 Modules** in frontend JS for better maintainability.
- For larger scale, you can later migrate frontend to **React** or backend to **NestJS**.
