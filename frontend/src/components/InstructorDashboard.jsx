import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function InstructorDashboard({ user }) {
  const [progressList, setProgressList] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Quick enrollment modal state
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [progRes, stuRes, crsRes] = await Promise.all([
        api.getInstructorDashboardProgress(user.id),
        api.getStudents(),
        api.getCourses(user.id),
      ]);
      setProgressList(progRes.data || []);
      setStudents(stuRes.data || []);
      setCourses(crsRes.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user.id]);

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedCourseId) return;

    setEnrollLoading(true);
    setEnrollMsg('');
    try {
      await api.enrollStudent(Number(selectedStudentId), Number(selectedCourseId));
      setEnrollMsg('Student enrolled successfully!');
      setTimeout(() => {
        setShowEnrollModal(false);
        setEnrollMsg('');
        loadData();
      }, 1000);
    } catch (err) {
      setEnrollMsg('Error: ' + err.message);
    } finally {
      setEnrollLoading(false);
    }
  };

  const avgProgress = progressList.length === 0 ? 0 :
    Math.round(progressList.reduce((acc, curr) => acc + curr.progressPercentage, 0) / progressList.length);

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a' }}>Instructor Dashboard</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>
            Monitor real-time student learning progression, completed activities, and course enrollments.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={loadData} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            🔄 Refresh
          </button>
          <button onClick={() => setShowEnrollModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            ➕ Assign Student to Course
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card">
          <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Students</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginTop: '6px' }}>{students.length}</div>
          <div style={{ color: '#10b981', fontSize: '0.8rem', marginTop: '4px' }}>Active in system</div>
        </div>

        <div className="card">
          <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Courses Created</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#4f46e5', marginTop: '6px' }}>{courses.length}</div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>With interactive activities</div>
        </div>

        <div className="card">
          <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Course Enrollments</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0ea5e9', marginTop: '6px' }}>{progressList.length}</div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>Total assignments</div>
        </div>

        <div className="card">
          <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Avg Completion Rate</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: avgProgress > 50 ? '#10b981' : '#f59e0b', marginTop: '6px' }}>
            {avgProgress}%
          </div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>Across all courses</div>
        </div>
      </div>

      {/* Student Progress Monitoring Table */}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>
          Student Course Progress Tracking
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading student progress data...</div>
        ) : progressList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📚</div>
            <p style={{ fontWeight: 600, color: '#334155' }}>No student enrollments yet.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>
              Add a student in the <strong>Student Management</strong> tab, then click <strong>"Assign Student to Course"</strong> above!
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course Assigned</th>
                  <th>Activities Completed</th>
                  <th style={{ width: '220px' }}>Progress</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {progressList.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.studentName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.studentEmail}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{item.courseName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.courseHours} hrs total</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.completedActivities}</span>
                      <span style={{ color: '#64748b' }}> / {item.totalActivities} activities</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                        <span>{item.progressPercentage}%</span>
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
                    </td>
                    <td>
                      <span className={`badge ${item.progressPercentage === 100 ? 'badge-completed' : 'badge-pending'}`}>
                        {item.enrollmentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Enroll Modal */}
      {showEnrollModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>Assign Student to Course</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '16px' }}>
              Select a student and a course to grant them access to course activities.
            </p>

            {enrollMsg && (
              <div style={{
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '14px',
                fontSize: '0.85rem',
                background: enrollMsg.startsWith('Error') ? '#fef2f2' : '#f0fdf4',
                color: enrollMsg.startsWith('Error') ? '#dc2626' : '#15803d',
              }}>
                {enrollMsg}
              </div>
            )}

            <form onSubmit={handleEnroll} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Select Student
                </label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Select Course
                </label>
                <select
                  required
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.hours} hrs)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={enrollLoading}
                  className="btn-primary"
                >
                  {enrollLoading ? 'Assigning...' : 'Assign Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
