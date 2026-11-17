import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Add Student Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [defaultPassword, setDefaultPassword] = useState('student123');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await api.getStudents();
      setStudents(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    setError('');

    try {
      await api.addStudent({
        name,
        email,
        defaultPassword,
        phone,
        bio,
      });
      setSuccessMsg(`Student "${name}" added successfully! Default password: "${defaultPassword}"`);
      setName('');
      setEmail('');
      setPhone('');
      setBio('');
      setShowAddModal(false);
      loadStudents();
    } catch (err) {
      alert('Error creating student: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a' }}>Student Management</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>
            Register new students with default credentials. Students will be prompted to reset their password upon first login.
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          ➕ Add New Student
        </button>
      </div>

      {successMsg && (
        <div style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
          ✅ {successMsg}
        </div>
      )}

      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
          ⚠️ {error}
        </div>
      )}

      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>
          Registered Student Directory ({students.length})
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading students...</div>
        ) : students.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>👨‍🎓</div>
            <h3 style={{ fontSize: '1.2rem', color: '#334155' }}>No students added yet</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>
              Click <strong>"+ Add New Student"</strong> above to register students and assign credentials.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student Info</th>
                  <th>Contact Details</th>
                  <th>Notes / Bio</th>
                  <th>Onboarding Status</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{student.name}</div>
                      <div style={{ fontSize: '0.82rem', color: '#4f46e5' }}>{student.email}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.9rem', color: '#334155' }}>
                        {student.phone ? `📞 ${student.phone}` : '—'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '240px' }}>
                        {student.bio || '—'}
                      </div>
                    </td>
                    <td>
                      {student.isFirstLogin ? (
                        <span className="badge badge-reading" title="Student has not yet logged in to set their permanent password">
                          ⏳ First Login Pending
                        </span>
                      ) : (
                        <span className="badge badge-completed" title="Student has activated their personal password">
                          ✓ Active Account
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '6px' }}>Add New Student</h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '16px' }}>
              The student will use the default password you assign here for their first login.
            </p>

            <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Student Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. maya.patel@student.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Default Temporary Password *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. student123"
                  value={defaultPassword}
                  onChange={(e) => setDefaultPassword(e.target.value)}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                  Student will be required to change this upon first login.
                </span>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Phone Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Notes / Bio (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Enrolled in 2026 CS cohort..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                >
                  {submitting ? 'Registering...' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
