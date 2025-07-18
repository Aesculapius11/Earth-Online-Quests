import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskPage from './pages/TaskPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <div className="animated-gradient-bg" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TaskPage />
              </ProtectedRoute>
            }
          />
          {/* 自动根据token跳转 */}
          <Route
            path="/"
            element={
              localStorage.getItem('token')
                ? <Navigate to="/tasks" />
                : <Navigate to="/login" />
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;