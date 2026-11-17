import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import FirstLoginModal from './components/FirstLoginModal';
import InstructorDashboard from './components/InstructorDashboard';
import CourseManagement from './components/CourseManagement';
import StudentManagement from './components/StudentManagement';
import StudentPortal from './components/StudentPortal';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lms_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState(() => {
    return user && user.role === 'STUDENT' ? 'my-courses' : 'dashboard';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('lms_user', JSON.stringify(user));
      if (user.role === 'STUDENT' && activeTab !== 'my-courses') {
        setActiveTab('my-courses');
      } else if (user.role === 'INSTRUCTOR' && activeTab === 'my-courses') {
        setActiveTab('dashboard');
      }
    } else {
      localStorage.removeItem('lms_user');
    }
  }, [user]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('lms_user');
  };

  const handlePasswordChanged = () => {
    setUser((prev) => ({
      ...prev,
      isFirstLogin: false,
    }));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        user={user}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main style={{ flex: 1 }}>
        {/* Not logged in: Show Login / Register Modal */}
        {!user && <LoginModal onLoginSuccess={handleLoginSuccess} />}

        {/* Logged in student with First-Time Login flag: Force password update */}
        {user && user.isFirstLogin && (
          <FirstLoginModal
            user={user}
            onPasswordChanged={handlePasswordChanged}
          />
        )}

        {/* Authenticated Instructor Experience */}
        {user && user.role === 'INSTRUCTOR' && (
          <>
            {activeTab === 'dashboard' && <InstructorDashboard user={user} />}
            {activeTab === 'courses' && <CourseManagement user={user} />}
            {activeTab === 'students' && <StudentManagement />}
          </>
        )}

        {/* Authenticated Student Experience */}
        {user && user.role === 'STUDENT' && !user.isFirstLogin && (
          <StudentPortal user={user} />
        )}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '24px',
        borderTop: '1px solid #e2e8f0',
        color: '#94a3b8',
        fontSize: '0.85rem',
        background: '#ffffff',
        marginTop: 'auto',
      }}>
        Learning Management System (LMS) • Spring Boot + MySQL + React Architecture
      </footer>
    </div>
  );
}
