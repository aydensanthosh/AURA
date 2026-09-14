require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // body-parser is included in express now

// Basic Route
app.get('/', (req, res) => {
  res.send('AURA API is running...');
});

// Routes will be mounted here
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/habits', require('./routes/habitRoutes'));
app.use('/api/workouts', require('./routes/workoutRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
