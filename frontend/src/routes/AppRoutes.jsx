import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/Common/ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Tasks from '../pages/Tasks';
import Habits from '../pages/Habits';
import Expenses from '../pages/Expenses';
import Notes from '../pages/Notes';
import Workouts from '../pages/Workouts';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected layout with nested routes via Outlet */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="habits" element={<Habits />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="notes" element={<Notes />} />
        <Route path="workouts" element={<Workouts />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
