import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Plus, Trash2, CheckCircle2, Circle, Calendar, Tag, AlertTriangle } from 'lucide-react';

const PRIORITIES = ['low', 'medium', 'high'];
const CATEGORIES = ['Work', 'Personal', 'Health', 'Learning', 'Finance', 'Other'];

const priorityColor = (p) => ({ high: 'badge-high', medium: 'badge-medium', low: 'badge-low' }[p]);
const statusIcon = (s) => s === 'complete' ? <CheckCircle2 size={18} color="var(--color-success)" /> : <Circle size={18} color="var(--color-text-muted)" />;
const isTaskMissing = (task) => task.status !== 'complete' && task.dueDate && new Date(task.dueDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

const Modal = ({ onClose, children }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const TaskForm = ({ initial, onSubmit, onClose }) => {
  const [form, setForm] = useState(
    initial || { title: '', description: '', dueDate: new Date().toISOString().split('T')[0], priority: 'medium', category: '' }
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2 style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>
        {initial ? 'Edit Task' : 'New Task'}
      </h2>
      <input className="input-field" placeholder="Title*" value={form.title} onChange={(e) => set('title', e.target.value)} required />
      <textarea className="input-field" placeholder="Description (optional)" value={form.description} onChange={(e) => set('description', e.target.value)} style={{ minHeight: '80px', resize: 'vertical' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Priority</label>
          <select className="input-field" value={form.priority} onChange={(e) => set('priority', e.target.value)}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Category</label>
          <select className="input-field" value={form.category} onChange={(e) => set('category', e.target.value)}>
            <option value="">— None —</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Due Date</label>
        <input className="input-field" type="date" value={form.dueDate ? form.dueDate.slice(0, 10) : ''} onChange={(e) => set('dueDate', e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn-primary"><Plus size={16} /> {initial ? 'Save' : 'Add Task'}</button>
      </div>
    </form>
  );
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('both');

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } finally { setLoading(false); }
  };

  const handleCreate = async (form) => {
    const res = await api.post('/tasks', form);
    setTasks((t) => [res.data, ...t]);
    setShowModal(false);
  };

  const handleUpdate = async (form) => {
    const res = await api.put(`/tasks/${editing._id}`, form);
    setTasks((t) => t.map((x) => (x._id === editing._id ? res.data : x)));
    setEditing(null);
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'pending' ? 'complete' : 'pending';
    const res = await api.put(`/tasks/${task._id}`, { status: newStatus });
    setTasks((t) => t.map((x) => (x._id === task._id ? res.data : x)));
  };

  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks((t) => t.filter((x) => x._id !== id));
  };

  const missingTasks = tasks.filter(isTaskMissing);
  const filtered = filter === 'all'
    ? tasks
    : filter === 'missing'
      ? missingTasks
      : tasks.filter((t) => t.status === filter);

  const priorityValue = (p) => p === 'high' ? 3 : p === 'medium' ? 2 : 1;

  const sortedTasks = [...filtered].sort((a, b) => {
    if (sortBy === 'date_asc') return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
    if (sortBy === 'date_desc') return new Date(b.dueDate || 0) - new Date(a.dueDate || 0);
    if (sortBy === 'priority_desc') return priorityValue(b.priority) - priorityValue(a.priority);
    if (sortBy === 'priority_asc') return priorityValue(a.priority) - priorityValue(b.priority);
    if (sortBy === 'both') {
      const pDiff = priorityValue(b.priority) - priorityValue(a.priority);
      if (pDiff !== 0) return pDiff;
      return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
    }
    return 0;
  });

  if (loading) return <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Loading tasks...</div>;

  return (
    <div className="animate-fadeIn" style={{ '--color-primary': '#3b82f6', '--color-primary-dark': '#2563eb', '--color-secondary': '#60a5fa' }}>
      <div className="page-header">
        <div>
          <div className="page-title">Tasks</div>
          <div className="page-subtitle">
            {tasks.filter(t => t.status === 'pending').length} pending · {tasks.filter(t => t.status === 'complete').length} completed · {missingTasks.length} missing
          </div>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> New Task</button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'pending', 'complete', 'missing'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '0.4rem 1rem',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: filter === f ? 'var(--color-primary)' : 'var(--color-border)',
              color: filter === f ? '#fff' : 'var(--color-text-muted)',
              transition: 'all 0.2s',
            }}>
              {f === 'missing' ? 'Missing' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        
        <select 
          className="input-field" 
          style={{ padding: '0.4rem 2rem 0.4rem 0.75rem', fontSize: '0.8rem', minWidth: '150px' }}
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="both">Sort: Priority & Date</option>
          <option value="date_asc">Sort: Earliest Due</option>
          <option value="date_desc">Sort: Latest Due</option>
          <option value="priority_desc">Sort: Highest Priority</option>
          <option value="priority_asc">Sort: Lowest Priority</option>
        </select>
      </div>
      {/* Task List */}
      {filtered.length === 0 ? (
        <div className="empty-state glass-card">
          <AlertTriangle size={40} />
          <p style={{ fontWeight: 600 }}>No tasks here</p>
          <p style={{ fontSize: '0.875rem' }}>Click "New Task" to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {sortedTasks.map((task) => {
            const missing = isTaskMissing(task);
            return (
              <div key={task._id} className="glass-card animate-slideUp" style={{
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                opacity: task.status === 'complete' ? 0.65 : 1,
                borderColor: missing ? 'rgba(239,68,68,0.35)' : undefined,
                background: missing ? 'rgba(239,68,68,0.05)' : undefined,
              }}>
                <button className="btn-icon" onClick={() => toggleStatus(task)} title="Toggle complete">
                  {statusIcon(task.status)}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', textDecoration: task.status === 'complete' ? 'line-through' : 'none', color: 'var(--color-text)' }}>{task.title}</span>
                    <span className={`badge ${priorityColor(task.priority)}`}>{task.priority}</span>
                    {missing && <span className="badge" style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5' }}>Missing</span>}
                    {task.category && <span className="badge" style={{ background: 'var(--color-border)', color: 'var(--color-text-muted)' }}>{task.category}</span>}
                  </div>
                  {task.description && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{task.description}</p>}
                  {task.dueDate && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: missing ? '#fca5a5' : 'var(--color-text-muted)', marginTop: '0.3rem' }}>
                      <Calendar size={12} />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button className="btn-icon" onClick={() => setEditing(task)} title="Edit">✏️</button>
                  <button className="btn-icon" onClick={() => handleDelete(task._id)} title="Delete">
                    <Trash2 size={16} color="var(--color-danger)" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && <Modal onClose={() => setShowModal(false)}><TaskForm onSubmit={handleCreate} onClose={() => setShowModal(false)} /></Modal>}
      {editing && <Modal onClose={() => setEditing(null)}><TaskForm initial={editing} onSubmit={handleUpdate} onClose={() => setEditing(null)} /></Modal>}
    </div>
  );
};

export default Tasks;
