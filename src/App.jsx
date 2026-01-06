import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Suspense, lazy } from 'react';
const Login = lazy(() => import('./pages/Login/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const About = lazy(() => import('./pages/About/About'));
const EditAbout = lazy(() => import('./pages/About/EditAbout'));
const News = lazy(() => import('./pages/News/News'));
const EditNews = lazy(() => import('./pages/News/EditNews'));
const Gallery = lazy(() => import('./pages/Gallery/Gallery'));
const EditGallery = lazy(() => import('./pages/Gallery/EditGallery'));
const EditVideoGallery = lazy(() => import('./pages/Gallery/EditVideoGallery'));
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about/edit/:id"
              element={
                <ProtectedRoute>
                  <EditAbout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/news"
              element={
                <ProtectedRoute>
                  <News />
                </ProtectedRoute>
              }
            />
            <Route
              path="/news/edit/:id"
              element={
                <ProtectedRoute>
                  <EditNews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gallery"
              element={
                <ProtectedRoute>
                  <Gallery />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gallery/edit/:id"
              element={
                <ProtectedRoute>
                  <EditGallery />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gallery/videos/edit/:id"
              element={
                <ProtectedRoute>
                  <EditVideoGallery />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;
