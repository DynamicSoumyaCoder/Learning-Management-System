import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function CourseManagement({ user }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Create Course Modal
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [name, setName] = useState('');
  const [hours, setHours] = useState('');
  const [category, setCategory] = useState('Software Engineering');
  const [description, setDescription] = useState('');
  const [creatingCourse, setCreatingCourse] = useState(false);

  // Activity Management
  const [selectedCourseForActivity, setSelectedCourseForActivity] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Add Activity Modal
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [actTitle, setActTitle] = useState('');
  const [actType, setActType] = useState('VIDEO');
  const [actDuration, setActDuration] = useState('30');
  const [actContent, setActContent] = useState('');
  const [actDescription, setActDescription] = useState('');
  const [creatingActivity, setCreatingActivity] = useState(false);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await api.getCourses(user.id);
      setCourses(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [user.id]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setCreatingCourse(true);
    try {
      await api.createCourse({
        name,
        hours: parseFloat(hours),
        category,
        description,
        instructorId: user.id,
      });
      setShowCourseModal(false);
      setName('');
      setHours('');
      setDescription('');
      loadCourses();
    } catch (err) {
      alert('Error creating course: ' + err.message);
    } finally {
      setCreatingCourse(false);
    }
  };

  const handleOpenActivities = async (course) => {
    setSelectedCourseForActivity(course);
    setLoadingActivities(true);
    try {
      const res = await api.getCourseActivities(course.id);
      setActivities(res.data || []);
    } catch (err) {
      alert('Error fetching activities: ' + err.message);
    } finally {
      setLoadingActivities(false);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!selectedCourseForActivity) return;
    setCreatingActivity(true);
    try {
      await api.addActivity(selectedCourseForActivity.id, {
        title: actTitle,
        activityType: actType,
        durationMinutes: parseInt(actDuration, 10),
        description: actDescription,
        content: actContent,
      });
      setShowActivityModal(false);
      setActTitle('');
      setActContent('');
      setActDescription('');
      // Reload activities and courses
      handleOpenActivities(selectedCourseForActivity);
      loadCourses();
    } catch (err) {
      alert('Error adding activity: ' + err.message);
    } finally {
      setCreatingActivity(false);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    try {
      await api.deleteActivity(activityId);
      handleOpenActivities(selectedCourseForActivity);
      loadCourses();
    } catch (err) {
      alert('Error deleting activity: ' + err.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Delete this course? All associated activities will also be removed.')) return;
    try {
      await api.deleteCourse(courseId);
      if (selectedCourseForActivity && selectedCourseForActivity.id === courseId) {
        setSelectedCourseForActivity(null);
      }
      loadCourses();
    } catch (err) {
      alert('Error deleting course: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a' }}>Courses & Activities</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>
            Build structured courses with custom duration (hours) and attach interactive learning activities.
          </p>
        </div>
        <button onClick={() => setShowCourseModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          ➕ Create New Course
        </button>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>📖</div>
          <h3 style={{ fontSize: '1.2rem', color: '#334155' }}>No courses created yet</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>Get started by creating your first course above!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedCourseForActivity ? '1fr 1fr' : 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {/* Courses List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a' }}>
              Your Course Portfolio ({courses.length})
            </h2>
            {courses.map((course) => {
              const isSelected = selectedCourseForActivity && selectedCourseForActivity.id === course.id;
              return (
                <div
                  key={course.id}
                  className="card"
                  style={{
                    border: isSelected ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span className="badge badge-reading">{course.category || 'Course'}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4f46e5', background: '#e0e7ff', padding: '2px 8px', borderRadius: '6px' }}>
                        ⏱️ {course.hours} Hours
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#0f172a', margin: '12px 0 6px 0' }}>
                      {course.name}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.4, marginBottom: '16px' }}>
                      {course.description || 'No description provided.'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>
                      📝 {course.activityCount || 0} Activities
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenActivities(course)}
                        className={isSelected ? 'btn-primary' : 'btn-secondary'}
                        style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                      >
                        {isSelected ? 'Viewing Activities' : 'Manage Activities'}
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        style={{ background: '#fee2e2', color: '#dc2626', fontSize: '0.85rem', padding: '6px 10px' }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activities Drawer for Selected Course */}
          {selectedCourseForActivity && (
            <div className="card" style={{ height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#0f172a' }}>
                    Activities for "{selectedCourseForActivity.name}"
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Total: {activities.length} activity(ies)
                  </span>
                </div>
                <button
                  onClick={() => setShowActivityModal(true)}
                  className="btn-primary"
                  style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                >
                  ➕ Add Activity
                </button>
              </div>

              {loadingActivities ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>Loading activities...</div>
              ) : activities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                  <p>No activities added to this course yet.</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Click "+ Add Activity" above to add videos, reading materials, or assignments.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activities.map((act, idx) => (
                    <div
                      key={act.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: '#f8fafc',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>#{idx + 1}</span>
                          <span className={`badge badge-${act.activityType.toLowerCase()}`}>
                            {act.activityType}
                          </span>
                          <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>
                            {act.title}
                          </span>
                        </div>
                        {act.description && (
                          <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                            {act.description}
                          </div>
                        )}
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                          ⏱️ {act.durationMinutes || 0} mins {act.content && '• 🔗 Content attached'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteActivity(act.id)}
                        style={{ background: 'none', color: '#ef4444', padding: '6px', fontSize: '1rem' }}
                        title="Delete Activity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Create Course Modal */}
      {showCourseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '6px' }}>Create New Course</h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '16px' }}>
              Define the course title, estimated duration in hours, and curriculum description.
            </p>

            <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Course Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masterclass in Spring Boot & React"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Duration (Hours) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    placeholder="e.g. 40.0"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Web Development"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Summary of learning outcomes, prerequisites, and syllabus..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingCourse}
                  className="btn-primary"
                >
                  {creatingCourse ? 'Saving Course...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {showActivityModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '6px' }}>
              Add Activity to "{selectedCourseForActivity.name}"
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '16px' }}>
              Create a lesson, lecture video, reading resource, or assignment.
            </p>

            <form onSubmit={handleAddActivity} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Activity Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lesson 1: Understanding Spring Boot Architecture"
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Activity Type *
                  </label>
                  <select
                    value={actType}
                    onChange={(e) => setActType(e.target.value)}
                  >
                    <option value="VIDEO">Video Lecture</option>
                    <option value="READING">Reading Material</option>
                    <option value="ASSIGNMENT">Student Assignment</option>
                    <option value="QUIZ">Quiz / Assessment</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="30"
                    value={actDuration}
                    onChange={(e) => setActDuration(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Description / Notes
                </label>
                <input
                  type="text"
                  placeholder="Short explanation of what students will learn"
                  value={actDescription}
                  onChange={(e) => setActDescription(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Content / Link / Instructions
                </label>
                <textarea
                  rows="3"
                  placeholder="Paste YouTube/Vimeo link, reading article text, or assignment questions..."
                  value={actContent}
                  onChange={(e) => setActContent(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowActivityModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingActivity}
                  className="btn-primary"
                >
                  {creatingActivity ? 'Adding Activity...' : 'Add Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
