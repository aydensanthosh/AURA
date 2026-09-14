import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Plus, Trash2, Flame, CheckCircle, AlertTriangle } from 'lucide-react';

const Modal = ({ onClose, children }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>{children}</div>
  </div>
);

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [checkingIn, setCheckingIn] = useState(null);

  useEffect(() => { fetchHabits(); }, []);

  const fetchHabits = async () => {
    try {
      const res = await api.get('/habits');
      setHabits(res.data);
    } finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const res = await api.post('/habits', { name });
    setHabits((h) => [res.data, ...h]);
    setName('');
    setShowModal(false);
  };

  const handleCheckIn = async (id) => {
    setCheckingIn(id);
    try {
      const res = await api.post(`/habits/${id}/checkin`);
      setHabits((h) => h.map((x) => (x._id === id ? res.data : x)));
    } catch (err) {
      alert(err.response?.data?.message || 'Check-in failed');
    } finally { setCheckingIn(null); }
  };

  const handleDelete = async (id) => {
    await api.delete(`/habits/${id}`);
    setHabits((h) => h.filter((x) => x._id !== id));
  };

  const isCheckedInToday = (habit) => {
    if (!habit.checkIns || habit.checkIns.length === 0) return false;
    const todayStr = new Date().toDateString();
    return habit.checkIns.some((c) => new Date(c).toDateString() === todayStr);
  };

  if (loading) return <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Loading habits...</div>;

  return (
    <div className="animate-fadeIn" style={{ '--color-primary': '#10b981', '--color-primary-dark': '#059669', '--color-secondary': '#34d399' }}>
      <div className="page-header">
        <div>
          <div className="page-title">Habits</div>
          <div className="page-subtitle">Track your daily consistency</div>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> New Habit</button>
      </div>

      {habits.length === 0 ? (
        <div className="empty-state glass-card">
          <Flame size={40} />
          <p style={{ fontWeight: 600 }}>No habits yet</p>
          <p style={{ fontSize: '0.875rem' }}>Start building your routines!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {habits.map((habit) => {
            const done = isCheckedInToday(habit);
            return (
              <div key={habit._id} className="glass-card animate-slideUp" style={{ 
                padding: '1.5rem', 
                position: 'relative', 
                overflow: 'hidden',
                background: habit.currentStreak > 0 ? 'linear-gradient(135deg, #f59e0b22 0%, #f59e0b08 100%)' : 'linear-gradient(135deg, #10b98122 0%, #10b98108 100%)',
                borderColor: habit.currentStreak > 0 ? '#f59e0b33' : '#10b98133'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)' }}>{habit.name}</h3>
                  <button className="btn-icon" onClick={() => handleDelete(habit._id)}><Trash2 size={16} color="var(--color-danger)" /></button>
                </div>

                {/* Streak row */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: habit.currentStreak > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)', fontWeight: 700, fontSize: '1.5rem' }}>
                      <Flame size={18} />
                      {habit.currentStreak}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Current</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--color-text)' }}>{habit.longestStreak}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Best</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--color-text)' }}>{habit.checkIns?.length || 0}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Total</div>
                  </div>
                </div>

                {/* Mini calendar — last 7 days */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
                  {Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    const checked = habit.checkIns?.some((c) => new Date(c).toDateString() === d.toDateString());
                    return (
                      <div key={i} title={d.toLocaleDateString()} style={{
                        flex: 1,
                        height: '28px',
                        borderRadius: '5px',
                        background: checked ? 'var(--color-success)' : 'var(--color-border)',
                        opacity: checked ? 1 : 0.4,
                        transition: 'all 0.2s',
                      }} />
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                  <span>7 days ago</span><span>Today</span>
                </div>

                <button
                  onClick={() => handleCheckIn(habit._id)}
                  disabled={done || checkingIn === habit._id}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '0.6rem',
                    border: 'none',
                    cursor: done ? 'not-allowed' : 'pointer',
                    background: done ? 'rgba(16,185,129,0.15)' : 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                    color: done ? 'var(--color-success)' : '#fff',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.25s ease',
                    boxShadow: done ? 'none' : '0 2px 12px rgba(99,102,241,0.3)',
                  }}
                >
                  <CheckCircle size={16} />
                  {done ? 'Done for Today ✓' : checkingIn === habit._id ? 'Checking in...' : 'Check In'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-text)' }}>New Habit</h2>
            <input className="input-field" placeholder="Habit name (e.g. Read 30 mins)*" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary"><Plus size={16} /> Add Habit</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Habits;
