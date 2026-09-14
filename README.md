# Let's generate a high-quality, professional, modern, developer-friendly README.md file
# reflecting the AURA PRD specifications.

readme_content = """# ⚡ AURA — All-in-one Unified Routine Assistant

> A personal life management dashboard consolidating tasks, habits, expenses, notes, and workouts into a single, unified view. Built with the **MERN** stack as a 100 Days of Code capstone project.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Stack](https://img.shields.io/badge/Stack-MERN-61DAFB.svg)](https://react.dev/)


---

## 📌 Problem & Motivation

Most people fragment their daily routine across 4–5 isolated applications: Todoist for to-dos, a habit tracker, a budgeting app, Apple Notes or Notion for journaling, and a fitness logger. This fragmentation increases context switching, obscures the holistic picture of one's day/week, and drains consistency.

**AURA** solves this by unifying all core personal productivity verticals under a single authenticated account and high-level dashboard powered by high-performance MongoDB aggregation pipelines.

---

## 🚀 Key Modules & Features

### 1. 📋 Tasks & Priorities
- Full CRUD operations with priority tags (`Low`, `Medium`, `High`), due dates, and custom categories.
- Filtering by status (`Pending` / `Completed`), priority, and category; sorted dynamically by due date.
- Dashboard quick-view for overdue items and tasks due today.

### 2. 🔁 Habit Tracker & Streaks
- Daily check-in system with automatic streak calculations (current streak & longest historical streak).
- Instant visibility on dashboard for today's incomplete habits and ongoing momentum.

### 3. 💸 Lightweight Expense Log
- Fast transaction logging (amount, category, note, timestamp).
- Monthly spending rollups and category breakdowns computed server-side via MongoDB aggregation.
- Top category identification and monthly total spend display.

### 4. 📝 Notes & Reflection
- Quick freeform journaling and scratchpad with tag support.
- Full-text MongoDB search indexing across note titles and content bodies.
- Highlights latest note directly on the home dashboard.

### 5. 🏋️ Workout Session & Volume Tracker
- Structured session logging with nested documents for exercises and sets (`reps`, `weight`).
- Reusable workout templates (e.g., Push / Pull / Legs).
- Progress tracking over time (e.g., bench press max over time)

### 6. 📊 Unified Dashboard
- Aggregated multi-resource dashboard combining live data from all 5 modules in a single trip.
- Interactive visualizations: Expense breakdown pie/bar chart and workout progression line charts.
- Sub-500ms response targets powered by dedicated backend aggregation endpoints.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React (Vite), Tailwind CSS, React Router | Fast, responsive UI with zero-friction navigation |
| **Data Visualization** | Recharts | Smooth, interactive SVG charting for workouts and expenses |
| **HTTP Client** | Axios | Configured with auth interceptors for JWT injection |
| **Backend** | Node.js, Express.js | RESTful API server with modular routers |
| **Database** | MongoDB Atlas, Mongoose ODM | Document store supporting subdocs & aggregation pipelines |
| **Auth & Security** | JWT (JSON Web Tokens), bcryptjs | Stateless authorization, password hashing, user scoping |
| **Deployment** | Vercel (Frontend), Render / Railway (Backend) | CI/CD linked deployments |

---

## 🗄️ High-Level Data Model

```text
User (Parent)
 │
 ├── Task       ─── references user_id
 ├── Habit      ─── references user_id [checkins: date[]]
 ├── Expense    ─── references user_id
 ├── Note       ─── references user_id (text indexed)
 └── Workout    ─── references user_id
                     └── exercises: [{ name, sets: [{ reps, weight }] }] (embedded)