import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import CourseLearningRoom from './CourseLearningRoom';

export default function StudentPortal({ user }) {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Selected course to study in learning room
  const [activeCourseId, setActiveCourseId] = useState(null);

  const loadEnrolledCourses = async () => {
    setLoading(true);
    try {
      const res = await api.getStudentCourses(user.id);
      setEnrolledCourses(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnrolledCourses();
  }, [user.id]);

  if (activeCourseId) {
    return (
      <CourseLearningRoom
        user={user}
        courseId={activeCourseId}
        onBack={() => {
          setActiveCourseId(null);
          loadEnrolledCourses();
        }}
      />
    );
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a' }}>
          Welcome back, {user.name}! 👋
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>
          Continue your coursework, complete activities, and track your learning progress.
        </p>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading your courses...</div>
      ) : enrolledCourses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎒</div>
          <h3 style={{ fontSize: '1.3rem', color: '#334155' }}>You are not enrolled in any courses yet</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>
            Please ask your instructor to assign you to your training courses.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {enrolledCourses.map((item) => (
            <div
              key={item.courseId}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge ${item.progressPercentage === 100 ? 'badge-completed' : 'badge-pending'}`}>
                    {item.progressPercentage === 100 ? '✓ Completed' : 'In Progress'}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4f46e5' }}>
                    ⏱️ {item.courseHours} Hours
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '14px 0 6px 0' }}>
                  {item.courseName}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
                  Enrolled on {new Date(item.enrolledAt).toLocaleDateString()}
                </p>

                {/* Progress bar */}
                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span style={{ color: '#334155' }}>Course Progress</span>
                    <span style={{ color: '#4f46e5' }}>{item.progressPercentage}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${item.progressPercentage}%`,
                        background: item.progressPercentage === 100 ? '#10b981' : undefined
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px' }}>
                    {item.completedActivities} of {item.totalActivities} activities completed
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => setActiveCourseId(item.courseId)}
                  className="btn-primary"
                  style={{ width: '100%', padding: '10px', fontSize: '0.95rem' }}
                >
                  {item.progressPercentage === 100 ? 'Review Course Material' : 'Continue Learning →'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
