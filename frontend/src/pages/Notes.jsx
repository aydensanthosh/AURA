import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Plus, Trash2, FileText, Search, Tag, X } from 'lucide-react';

const Modal = ({ onClose, children }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-box" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>{children}</div>
  </div>
);

const NoteForm = ({ initial, onSubmit, onClose }) => {
  const [form, setForm] = useState(
    initial ? { ...initial, tags: initial.tags?.join(', ') || '' } : { title: '', body: '', tags: '' }
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
    onSubmit({ ...form, tags });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2 style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-text)' }}>{initial ? 'Edit Note' : 'New Note'}</h2>
      <input className="input-field" placeholder="Title*" value={form.title} onChange={(e) => set('title', e.target.value)} required />
      <textarea
        className="input-field"
        placeholder="Write your note here..."
        value={form.body}
        onChange={(e) => set('body', e.target.value)}
        required
        style={{ minHeight: '180px', resize: 'vertical' }}
      />
      <div>
        <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>
          Tags (comma-separated)
        </label>
        <input className="input-field" placeholder="e.g. work, ideas, personal" value={form.tags} onChange={(e) => set('tags', e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn-primary"><Plus size={16} /> {initial ? 'Save' : 'Create Note'}</button>
      </div>
    </form>
  );
};

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async (q = '') => {
    try {
      const res = await api.get('/notes', { params: q ? { search: q } : {} });
      setNotes(res.data);
    } finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearch(q);
    if (q.length === 0 || q.length > 2) fetchNotes(q);
  };

  const handleCreate = async (form) => {
    const res = await api.post('/notes', form);
    setNotes((n) => [res.data, ...n]);
    setShowModal(false);
  };

  const handleUpdate = async (form) => {
    const res = await api.put(`/notes/${editing._id}`, form);
    setNotes((n) => n.map((x) => (x._id === editing._id ? res.data : x)));
    setEditing(null);
  };

  const handleDelete = async (id) => {
    await api.delete(`/notes/${id}`);
    setNotes((n) => n.filter((x) => x._id !== id));
    if (viewing?._id === id) setViewing(null);
  };

  // Tag color helper
  const tagColor = (tag) => {
    const colors = ['#6366f1','#ec4899','#10b981','#f59e0b','#3b82f6','#8b5cf6'];
    let hash = 0;
    for (let c of tag) hash = c.charCodeAt(0) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading) return <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Loading notes...</div>;

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <div className="page-title">Notes</div>
          <div className="page-subtitle">{notes.length} note{notes.length !== 1 ? 's' : ''}</div>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> New Note</button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '400px' }}>
        <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
        <input
          className="input-field"
          placeholder="Search notes..."
          value={search}
          onChange={handleSearch}
          style={{ paddingLeft: '2.5rem' }}
        />
        {search && (
          <button onClick={() => { setSearch(''); fetchNotes(); }} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {notes.length === 0 ? (
        <div className="empty-state glass-card">
          <FileText size={40} />
          <p style={{ fontWeight: 600 }}>No notes found</p>
          <p style={{ fontSize: '0.875rem' }}>Start capturing your thoughts!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {notes.map((note) => (
            <div
              key={note._id}
              className="glass-card animate-slideUp"
              style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onClick={() => setViewing(note)}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-glow)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-glass)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)', flex: 1, paddingRight: '0.5rem', wordBreak: 'break-word' }}>{note.title}</h3>
                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                  <button className="btn-icon" onClick={() => setEditing(note)} title="Edit">✏️</button>
                  <button className="btn-icon" onClick={() => handleDelete(note._id)} title="Delete"><Trash2 size={15} color="var(--color-danger)" /></button>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', lineHeight: 1.5 }}>{note.body}</p>
              {note.tags?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {note.tags.map((tag) => (
                    <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 8px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600, background: `${tagColor(tag)}22`, color: tagColor(tag) }}>
                      <Tag size={10} /> {tag}
                    </span>
                  ))}
                </div>
              )}
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 'auto' }}>{new Date(note.date).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {viewing && (
        <div className="modal-overlay" onClick={() => setViewing(null)}>
          <div className="modal-box" style={{ maxWidth: '600px', maxHeight: '80vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-text)' }}>{viewing.title}</h2>
              <button className="btn-icon" onClick={() => setViewing(null)}><X size={18} /></button>
            </div>
            {viewing.tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '1rem' }}>
                {viewing.tags.map((tag) => (
                  <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 8px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600, background: `${tagColor(tag)}22`, color: tagColor(tag) }}>
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            )}
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>{viewing.body}</p>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '1.5rem' }}>{new Date(viewing.date).toLocaleDateString()}</div>
          </div>
        </div>
      )}

      {showModal && <Modal onClose={() => setShowModal(false)}><NoteForm onSubmit={handleCreate} onClose={() => setShowModal(false)} /></Modal>}
      {editing && <Modal onClose={() => setEditing(null)}><NoteForm initial={editing} onSubmit={handleUpdate} onClose={() => setEditing(null)} /></Modal>}
    </div>
  );
};

export default Notes;
