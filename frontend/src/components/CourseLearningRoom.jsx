import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function CourseLearningRoom({ user, courseId, onBack }) {
  const [learningRoom, setLearningRoom] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');

  const loadLearningRoom = async (selectId = null) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getCourseLearningRoom(user.id, courseId);
      const data = res.data;
      setLearningRoom(data);

      if (data && data.activities && data.activities.length > 0) {
        if (selectId) {
          const found = data.activities.find((a) => a.id === selectId);
          setSelectedActivity(found || data.activities[0]);
        } else if (!selectedActivity) {
          // Default to first pending activity, or first activity
          const firstPending = data.activities.find((a) => !a.isCompleted);
          setSelectedActivity(firstPending || data.activities[0]);
        } else {
          const updatedSelected = data.activities.find((a) => a.id === selectedActivity.id);
          setSelectedActivity(updatedSelected || data.activities[0]);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLearningRoom();
  }, [user.id, courseId]);

  const handleMarkComplete = async () => {
    if (!selectedActivity || selectedActivity.isCompleted) return;

    setCompleting(true);
    try {
      await api.completeActivity(user.id, selectedActivity.id);
      await loadLearningRoom(selectedActivity.id);
    } catch (err) {
      alert('Error updating progress: ' + err.message);
    } finally {
      setCompleting(false);
    }
  };

  if (loading && !learningRoom) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
        Loading classroom content...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={onBack} className="btn-secondary" style={{ marginBottom: '16px' }}>
          ← Back to Courses
        </button>
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '16px', borderRadius: '8px' }}>
          ⚠️ {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={onBack} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          ← Back to My Courses
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Overall Course Progress</span>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#4f46e5' }}>
              {learningRoom.completedActivities} / {learningRoom.totalActivities} Completed ({learningRoom.progressPercentage}%)
            </div>
          </div>
          <div style={{ width: '120px' }}>
            <div className="progress-bar-container" style={{ height: '12px' }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${learningRoom.progressPercentage}%`,
                  background: learningRoom.progressPercentage === 100 ? '#10b981' : undefined
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {learningRoom.isFullyCompleted && (
        <div style={{
          background: 'linear-gradient(90deg, #10b981, #059669)',
          color: 'white',
          padding: '16px 20px',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: 'var(--shadow)',
        }}>
          <span style={{ fontSize: '24px' }}>🎉</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Congratulations! You have completed this course!</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
              All {learningRoom.totalActivities} activities have been marked as completed. Your instructor has been notified on their progress dashboard.
            </div>
          </div>
        </div>
      )}

      {/* Classroom Layout: Sidebar + Main Viewer */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px' }}>
        {/* Left Sidebar: Activities Checklist */}
        <div className="card" style={{ padding: '20px', height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
            Course Syllabus
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '16px' }}>
            {learningRoom.courseName} ({learningRoom.hours} hrs)
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {learningRoom.activities && learningRoom.activities.map((act, index) => {
              const isSelected = selectedActivity && selectedActivity.id === act.id;
              return (
                <div
                  key={act.id}
                  onClick={() => setSelectedActivity(act)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                    background: isSelected ? '#f5f3ff' : act.isCompleted ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge badge-${act.activityType.toLowerCase()}`}>
                      {act.activityType}
                    </span>
                    {act.isCompleted ? (
                      <span style={{ color: '#15803d', fontWeight: 700, fontSize: '0.85rem' }}>
                        ✓ Completed
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                        ○ Pending
                      </span>
                    )}
                  </div>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.92rem', marginTop: '6px' }}>
                    {index + 1}. {act.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    ⏱️ {act.durationMinutes || 0} mins
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Viewer */}
        <div className="card" style={{ padding: '28px', minHeight: 'calc(100vh - 200px)' }}>
          {selectedActivity ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span className={`badge badge-${selectedActivity.activityType.toLowerCase()}`}>
                    {selectedActivity.activityType}
                  </span>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', marginTop: '8px' }}>
                    {selectedActivity.title}
                  </h2>
                  <div style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>
                    Estimated Time: <strong>{selectedActivity.durationMinutes || 0} minutes</strong> • Instructor: <strong>{learningRoom.instructorName}</strong>
                  </div>
                </div>

                <div>
                  {selectedActivity.isCompleted ? (
                    <div style={{
                      background: '#dcfce7',
                      color: '#15803d',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}>
                      ✓ Activity Completed
                    </div>
                  ) : (
                    <button
                      onClick={handleMarkComplete}
                      disabled={completing}
                      className="btn-success"
                      style={{ padding: '10px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      {completing ? 'Updating...' : '✓ Mark as Completed'}
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              {selectedActivity.description && (
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  <strong>Objective:</strong> {selectedActivity.description}
                </div>
              )}

              {/* Learning Content */}
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>
                  Lesson Resource / Material:
                </h4>
                {selectedActivity.content ? (
                  selectedActivity.content.startsWith('http://') || selectedActivity.content.startsWith('https://') ? (
                    <div style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '24px',
                      textAlign: 'center',
                      background: '#faf5ff',
                    }}>
                      <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔗</div>
                      <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>External Learning Link / Video:</div>
                      <a
                        href={selectedActivity.content}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#4f46e5', fontWeight: 600, wordBreak: 'break-all', textDecoration: 'underline' }}
                      >
                        {selectedActivity.content}
                      </a>
                    </div>
                  ) : (
                    <div style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '20px',
                      whiteSpace: 'pre-wrap',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      color: '#334155',
                    }}>
                      {selectedActivity.content}
                    </div>
                  )
                ) : (
                  <p style={{ color: '#64748b' }}>No special link or instructions attached for this activity.</p>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              Select an activity from the syllabus to start learning.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
