import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Plus, Trash2, Dumbbell, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

const Modal = ({ onClose, children }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-box" style={{ maxWidth: '580px', maxHeight: '85vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>{children}</div>
  </div>
);

const emptyExercise = () => ({ name: '', sets: [{ reps: '', weight: '' }] });

const WorkoutForm = ({ initial, onSubmit, onClose }) => {
  const [form, setForm] = useState(
    initial
      ? { ...initial, date: initial.date ? initial.date.slice(0, 10) : '' }
      : { name: '', date: new Date().toISOString().split('T')[0], exercises: [emptyExercise()] }
  );

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addExercise = () => setForm((f) => ({ ...f, exercises: [...f.exercises, emptyExercise()] }));
  const removeExercise = (i) => setForm((f) => ({ ...f, exercises: f.exercises.filter((_, j) => j !== i) }));
  const setExerciseName = (i, v) => setForm((f) => {
    const ex = [...f.exercises];
    ex[i] = { ...ex[i], name: v };
    return { ...f, exercises: ex };
  });

  const addSet = (i) => setForm((f) => {
    const ex = [...f.exercises];
    const currentSets = ex[i].sets;
    const lastSet = currentSets.length > 0 ? currentSets[currentSets.length - 1] : { reps: '', weight: '' };
    ex[i] = { ...ex[i], sets: [...currentSets, { reps: lastSet.reps, weight: lastSet.weight }] };
    return { ...f, exercises: ex };
  });
  const removeSet = (ei, si) => setForm((f) => {
    const ex = [...f.exercises];
    ex[ei] = { ...ex[ei], sets: ex[ei].sets.filter((_, j) => j !== si) };
    return { ...f, exercises: ex };
  });
  const setSetVal = (ei, si, k, v) => setForm((f) => {
    const ex = [...f.exercises];
    const sets = [...ex[ei].sets];
    sets[si] = { ...sets[si], [k]: v };
    ex[ei] = { ...ex[ei], sets };
    return { ...f, exercises: ex };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert reps/weight to numbers
    const exercises = form.exercises.map((ex) => ({
      ...ex,
      sets: ex.sets.map((s) => ({ reps: Number(s.reps), weight: Number(s.weight) })),
    }));
    onSubmit({ ...form, exercises });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2 style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-text)' }}>{initial ? 'Edit Workout' : 'Log Workout'}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Workout Name*</label>
          <input className="input-field" placeholder="e.g. Push Day" value={form.name} onChange={(e) => setField('name', e.target.value)} required />
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Date</label>
          <input className="input-field" type="date" value={form.date} max={new Date().toISOString().split('T')[0]} onChange={(e) => setField('date', e.target.value)} />
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text)' }}>Exercises</span>
          <button type="button" onClick={addExercise} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}><Plus size={14} /> Add Exercise</button>
        </div>

        {form.exercises.map((ex, ei) => (
          <div key={ei} style={{ background: 'var(--color-border)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
              <input className="input-field" placeholder="Exercise name*" value={ex.name} onChange={(e) => setExerciseName(ei, e.target.value)} required style={{ flex: 1 }} />
              {form.exercises.length > 1 && (
                <button type="button" className="btn-icon" onClick={() => removeExercise(ei)}><Trash2 size={15} color="var(--color-danger)" /></button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem', paddingLeft: '0.25rem' }}>
              <span>Reps</span><span>Weight (kg)</span><span></span>
            </div>
            {ex.sets.map((s, si) => (
              <div key={si} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <input className="input-field" type="number" min="0" placeholder="12" value={s.reps} onChange={(e) => setSetVal(ei, si, 'reps', e.target.value)} style={{ padding: '0.4rem 0.6rem' }} required />
                <input className="input-field" type="number" min="0" step="0.5" placeholder="60" value={s.weight} onChange={(e) => setSetVal(ei, si, 'weight', e.target.value)} style={{ padding: '0.4rem 0.6rem' }} required />
                {ex.sets.length > 1 && (
                  <button type="button" className="btn-icon" onClick={() => removeSet(ei, si)}><Trash2 size={14} /></button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addSet(ei)} style={{ fontSize: '0.75rem', marginTop: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Plus size={13} /> Add Set
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn-primary"><Dumbbell size={16} /> {initial ? 'Save' : 'Log Workout'}</button>
      </div>
    </form>
  );
};

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [sortBy, setSortBy] = useState('date_desc');

  useEffect(() => { fetchWorkouts(); }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await api.get('/workouts');
      setWorkouts(res.data);
    } finally { setLoading(false); }
  };

  const handleCreate = async (form) => {
    const res = await api.post('/workouts', form);
    setWorkouts((w) => [res.data, ...w]);
    setShowModal(false);
  };

  const handleUpdate = async (form) => {
    const res = await api.put(`/workouts/${editing._id}`, form);
    setWorkouts((w) => w.map((x) => (x._id === editing._id ? res.data : x)));
    setEditing(null);
  };

  const handleDelete = async (id) => {
    await api.delete(`/workouts/${id}`);
    setWorkouts((w) => w.filter((x) => x._id !== id));
  };

  const totalVolume = (workout) =>
    workout.exercises.reduce((s, ex) => s + ex.sets.reduce((ss, set) => ss + set.reps * set.weight, 0), 0);

  const sortedWorkouts = [...workouts].sort((a, b) => {
    if (sortBy === 'date_desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'date_asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'volume_desc') return totalVolume(b) - totalVolume(a);
    if (sortBy === 'volume_asc') return totalVolume(a) - totalVolume(b);
    return 0;
  });

  if (loading) return <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Loading workouts...</div>;

  return (
    <div className="animate-fadeIn" style={{ '--color-primary': '#eab308', '--color-primary-dark': '#ca8a04', '--color-secondary': '#fde047' }}>
      <div className="page-header">
        <div>
          <div className="page-title">Workouts</div>
          <div className="page-subtitle">{workouts.length} session{workouts.length !== 1 ? 's' : ''} logged</div>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Log Workout</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <select 
          className="input-field" 
          style={{ padding: '0.4rem 2rem 0.4rem 0.75rem', fontSize: '0.8rem', minWidth: '150px' }}
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date_desc">Sort: Newest First</option>
          <option value="date_asc">Sort: Oldest First</option>
          <option value="volume_desc">Sort: Highest Volume</option>
          <option value="volume_asc">Sort: Lowest Volume</option>
        </select>
      </div>

      {workouts.length === 0 ? (
        <div className="empty-state glass-card">
          <Dumbbell size={40} />
          <p style={{ fontWeight: 600 }}>No workouts logged yet</p>
          <p style={{ fontSize: '0.875rem' }}>Start tracking your training!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sortedWorkouts.map((w) => (
            <div key={w._id} className="glass-card animate-slideUp" style={{ overflow: 'hidden' }}>
              {/* Header row */}
              <div
                style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                onClick={() => setExpanded((p) => (p === w._id ? null : w._id))}
              >
                <div style={{ padding: '0.625rem', borderRadius: '0.75rem', background: 'rgba(99,102,241,0.15)', color: 'var(--color-primary)', flexShrink: 0 }}>
                  <Dumbbell size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)' }}>{w.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
                    <span>{new Date(w.date).toLocaleDateString()}</span>
                    <span>{w.exercises.length} exercise{w.exercises.length !== 1 ? 's' : ''}</span>
                    <span>{totalVolume(w).toLocaleString()} kg total</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                  <button className="btn-icon" onClick={() => setEditing(w)} title="Edit">✏️</button>
                  <button className="btn-icon" onClick={() => handleDelete(w._id)} title="Delete"><Trash2 size={15} color="var(--color-danger)" /></button>
                  <div style={{ color: 'var(--color-text-muted)', marginLeft: '0.25rem' }} onClick={(e) => { e.stopPropagation(); setExpanded((p) => (p === w._id ? null : w._id)); }}>
                    {expanded === w._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
              </div>

              {/* Expanded exercise list */}
              {expanded === w._id && (
                <div style={{ borderTop: '1px solid var(--color-border)', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {w.exercises.map((ex, i) => (
                    <div key={i}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)', display: 'inline-block' }} />
                        {ex.name}
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                        <thead>
                          <tr style={{ color: 'var(--color-text-muted)' }}>
                            <th style={{ textAlign: 'left', paddingBottom: '0.3rem', fontWeight: 500 }}>Set</th>
                            <th style={{ textAlign: 'left', fontWeight: 500 }}>Reps</th>
                            <th style={{ textAlign: 'left', fontWeight: 500 }}>Weight</th>
                            <th style={{ textAlign: 'left', fontWeight: 500 }}>Volume</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ex.sets.map((s, si) => (
                            <tr key={si} style={{ borderTop: '1px solid var(--color-border)' }}>
                              <td style={{ padding: '0.3rem 0', color: 'var(--color-text-muted)' }}>#{si + 1}</td>
                              <td style={{ color: 'var(--color-text)', fontWeight: 600 }}>{s.reps}</td>
                              <td style={{ color: 'var(--color-text)', fontWeight: 600 }}>{s.weight} kg</td>
                              <td style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{(s.reps * s.weight).toLocaleString()} kg</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && <Modal onClose={() => setShowModal(false)}><WorkoutForm onSubmit={handleCreate} onClose={() => setShowModal(false)} /></Modal>}
      {editing && <Modal onClose={() => setEditing(null)}><WorkoutForm initial={editing} onSubmit={handleUpdate} onClose={() => setEditing(null)} /></Modal>}
    </div>
  );
};

export default Workouts;
