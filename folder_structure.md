aura/
├── client/                          # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/                     # Axios instance + API call functions
│   │   │   ├── axiosConfig.js
│   │   │   ├── taskApi.js
│   │   │   ├── habitApi.js
│   │   │   ├── expenseApi.js
│   │   │   ├── noteApi.js
│   │   │   └── workoutApi.js
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/               # Buttons, Modals, Loader, ProtectedRoute
│   │   │   ├── tasks/
│   │   │   ├── habits/
│   │   │   ├── expenses/
│   │   │   ├── notes/
│   │   │   ├── workouts/
│   │   │   └── dashboard/            # Chart components, summary cards
│   │   ├── context/                  # AuthContext (user, token, login/logout)
│   │   ├── hooks/                    # useAuth, useFetch, custom hooks
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── Habits.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── Notes.jsx
│   │   │   └── Workouts.jsx
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   ├── utils/                    # date formatting, streak helpers, etc.
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                           # Node/Express backend
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   ├── habitController.js
│   │   ├── expenseController.js
│   │   ├── noteController.js
│   │   ├── workoutController.js
│   │   └── dashboardController.js    # aggregation endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js         # verifies JWT, attaches req.user
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── Habit.js
│   │   ├── Expense.js
│   │   ├── Note.js
│   │   └── Workout.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── habitRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── noteRoutes.js
│   │   ├── workoutRoutes.js
│   │   └── dashboardRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── streakCalculator.js       # habit streak logic
│   ├── .env
│   ├── server.js                     # entry point, mounts routes/middleware
│   └── package.json
│
├── .gitignore
└── README.md