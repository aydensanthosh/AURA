# AURA (All-in-one Unified Routine Assistant) 🌟

AURA is a sleek, modern, and unified personal command center built with the MERN stack (MongoDB, Express, React, Node.js). It consolidates your most important daily tracking tools into a single, beautiful glassmorphism interface.

Why use 4 different apps for your tasks, habits, finances, and gym progress when you can track it all in one unified dashboard?

## ✨ Features & Modules Deep Dive

AURA is split into several focused modules, each accessible from the main navigation sidebar. Every page dynamically adjusts the application's core color palette to match its theme.

### 📊 Unified Dashboard (Command Center)
The dashboard acts as the heartbeat of AURA. It aggregates data from all other modules to give you a true "Life at a single view."
- **Stat Cards**: Instantly see your pending tasks, active habit streaks, net financial balance, and how many times you've worked out this week.
- **Visual Analytics**: Interactive Recharts visualize your financial spending breakdown across categories.
- **Activity Rings**: If you haven't tracked expenses recently, it intelligently swaps to an SVG activity ring showing your weekly workout progress against your goal.
- **Latest Note**: Surface your most recently captured thought or idea right on the home screen.

### 📋 Tasks 
A robust to-do list manager designed for prioritizing what matters today.
- Log new tasks with titles, descriptions, and priority levels (High, Medium, Low).
- Tasks are color-coded based on priority and feature inline status toggling (Pending to Completed).
- Quick actions for editing and deleting tasks ensure your list is always relevant.

### 🔁 Habits
Build consistency and gamify your daily routines.
- Create daily habits (e.g., "Read 30 mins", "Run for 1km").
- **Streak Tracking**: AURA calculates and displays your *Current Streak* and *All-Time Best Streak* for every habit.
- Active streak habits visually glow with a warm orange gradient to remind you not to break the chain.
- A mini 7-day calendar view for each habit visualizes your recent consistency at a glance.

### 💰 Finances
Take control of your cash flow with an intuitive ledger and powerful charts.
- **Income & Expenses**: Log transactions dynamically as either income or an expense.
- **Net Balance Calculation**: Instantly calculates your Net Balance, Total Income, and Total Spend for the current month.
- **Category Tracking**: Tag expenses (e.g., Food, Health, Entertainment) and visualize where your money goes via dynamic Bar and Pie charts.

### 🏋️ Workouts
Ditch the messy gym notebooks.
- Log custom workouts (e.g., "Push Day", "Legs") on specific dates.
- Add multiple exercises per workout, and log individual sets, reps, and weight lifted for each exercise.
- AURA automatically calculates your **Total Volume** (reps × weight) for each exercise and the entire session.
- Expandable accordion cards keep the UI clean while letting you dive deep into previous workout metrics.

### 📝 Notes & 🎨 Theming
- **Notes Module**: Capture long-form thoughts, ideas, or brain dumps. Add custom tags that automatically generate distinct colors for easy visual sorting.
- **Dark & Light Mode**: Seamlessly switch between a sleek, deep-space dark mode and a crisp, clean light mode. The glassmorphism cards and custom shadows dynamically adapt to maintain a premium feel.
- **Secure Authentication**: Full JWT-based user login and registration system.

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- Tailwind CSS (Utility architecture)
- Vanilla CSS (Glassmorphism & custom variables)
- Recharts (Data visualization)
- Lucide React (Iconography)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Database & ODM)
- JSON Web Tokens (JWT) & bcrypt (Authentication & Security)

## 🚀 How to Run the Project Locally

### 1. Clone the Repository
Start by cloning the repository to your local machine:
```bash
git clone https://github.com/aydensanthosh/aura.git
cd aura
```

### 2. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16 or higher) and [MongoDB](https://www.mongodb.com/) installed (or use a free MongoDB Atlas cluster).

### 3. Environment Variables
Create a `.env` file in the `backend/` directory with the following keys:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### 4. Backend Setup
Open a terminal, navigate to the backend folder, and start the server:
```bash
cd backend
npm install
npm run dev
```
*(The backend API will run on `http://localhost:5000`)*

### 5. Frontend Setup
Open a second terminal, navigate to the frontend folder, and start the React app:
```bash
cd frontend
npm install
npm run dev
```
*(The frontend will automatically open at `http://localhost:5173`)*

---

## 🎮 How to Use AURA

Once both servers are running, follow these steps to get started:

1. **Create an Account**: Open the app in your browser and click "Sign Up." Create a secure account—your data will be safely stored and linked only to you via JWT authentication.
2. **Set Up Habits**: Navigate to the **Habits** page (green theme) first. Create a few daily habits you want to track (e.g., "Drink Water", "Read").
3. **Log Your Day**: Head to the **Tasks** page (blue theme) to jot down your immediate to-dos. You can mark their priorities.
4. **Track Your Money**: Use the **Finances** page (terracotta theme) to log any money you spend or receive today.
5. **View Your Life**: Go back to the **Dashboard**. You will now see your unified command center populated with your habit streaks, tasks due today, and a visual breakdown of your finances!

## 🔮 Roadmap / Upcoming Features
- [ ] Timeframe filtering for the dashboard (This Week, This Month, This Year).
- [ ] Workout progression line charts (tracking strength over time).
- [ ] Mobile-responsive sidebar (hamburger menu).
- [ ] CSV data export for finances and habits.

---
*Built as part of the 100-Day Code Challenge.*
