import React from 'react';

export default function Navbar({ user, onLogout, activeTab, setActiveTab }) {
  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 24px',
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
            color: 'white',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
          }}>
            L
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
            EduLMS <span style={{ color: '#4f46e5', fontSize: '0.85rem', fontWeight: 500 }}>Portal</span>
          </span>
        </div>

        {user && (
          <nav style={{ display: 'flex', gap: '8px' }}>
            {user.role === 'INSTRUCTOR' ? (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  style={{
                    background: activeTab === 'dashboard' ? '#e0e7ff' : 'transparent',
                    color: activeTab === 'dashboard' ? '#4f46e5' : '#64748b',
                    padding: '8px 14px',
                    fontWeight: 600,
                  }}
                >
                  Dashboard & Progress
                </button>
                <button
                  onClick={() => setActiveTab('courses')}
                  style={{
                    background: activeTab === 'courses' ? '#e0e7ff' : 'transparent',
                    color: activeTab === 'courses' ? '#4f46e5' : '#64748b',
                    padding: '8px 14px',
                    fontWeight: 600,
                  }}
                >
                  Courses & Activities
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  style={{
                    background: activeTab === 'students' ? '#e0e7ff' : 'transparent',
                    color: activeTab === 'students' ? '#4f46e5' : '#64748b',
                    padding: '8px 14px',
                    fontWeight: 600,
                  }}
                >
                  Student Management
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveTab('my-courses')}
                style={{
                  background: activeTab === 'my-courses' ? '#e0e7ff' : 'transparent',
                  color: activeTab === 'my-courses' ? '#4f46e5' : '#64748b',
                  padding: '8px 14px',
                  fontWeight: 600,
                }}
              >
                My Enrolled Courses
              </button>
            )}
          </nav>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user ? (
          <>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>{user.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                <span style={{
                  background: user.role === 'INSTRUCTOR' ? '#fef3c7' : '#dcfce7',
                  color: user.role === 'INSTRUCTOR' ? '#b45309' : '#15803d',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: 600,
                }}>
                  {user.role}
                </span>
                <span>{user.email}</span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="btn-secondary"
              style={{ fontSize: '0.85rem', padding: '6px 12px' }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Please sign in to proceed</span>
        )}
      </div>
    </header>
  );
}
