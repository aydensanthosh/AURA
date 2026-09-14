import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Plus, Trash2, Wallet, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Utilities', 'Rent', 'Education', 'Other'];
const INCOME_CATEGORIES = ['Pocket Money', 'Prize Money', 'Salary', 'Gift', 'Other'];
const COLORS = ['#6366f1', '#10b981', '#ec4899', '#f59e0b', '#0ea5e9', '#f43f5e', '#84cc16', '#8b5cf6'];

const Modal = ({ onClose, children }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>{children}</div>
  </div>
);

const Finances = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState('date_desc');
  
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ type: 'expense', amount: '', category: 'Food', date: getTodayDate(), note: '' });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/expenses'); // We still use /expenses endpoint
      setTransactions(res.data);
    } finally { setLoading(false); }
  };

  const handleTypeChange = (newType) => {
    setForm({
      ...form,
      type: newType,
      category: newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await api.post('/expenses', form);
    setTransactions((x) => [res.data, ...x]);
    setForm({ type: 'expense', amount: '', category: 'Food', date: getTodayDate(), note: '' });
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    await api.delete(`/expenses/${id}`);
    setTransactions((x) => x.filter((e) => e._id !== id));
  };

  const monthTransactions = transactions.filter((e) => new Date(e.date).getMonth() === new Date().getMonth());
  const monthIncome = monthTransactions.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const monthExpense = monthTransactions.filter(e => e.type !== 'income').reduce((s, e) => s + e.amount, 0);
  const netBalance = monthIncome - monthExpense;

  // Pie chart data (only expenses)
  const pieData = Object.values(
    transactions.filter(e => e.type !== 'income').reduce((acc, e) => {
      acc[e.category] = acc[e.category] || { name: e.category, value: 0 };
      acc[e.category].value += e.amount;
      return acc;
    }, {})
  );

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortBy === 'date_desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'date_asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amount_desc') return b.amount - a.amount;
    if (sortBy === 'amount_asc') return a.amount - b.amount;
    return 0;
  });

  if (loading) return <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Loading finances...</div>;

  return (
    <div className="animate-fadeIn" style={{ '--color-primary': '#9a3412', '--color-primary-dark': '#7c2d12', '--color-secondary': '#c2410c' }}>
      <div className="page-header">
        <div>
          <div className="page-title">Finances</div>
          <div className="page-subtitle">Track income & expenses</div>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Transaction</button>
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
          <option value="amount_desc">Sort: Highest Amount</option>
          <option value="amount_asc">Sort: Lowest Amount</option>
        </select>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.625rem', borderRadius: '0.75rem', background: 'rgba(99,102,241,0.15)', color: 'var(--color-primary)' }}><Wallet size={20} /></div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Net Balance (This Month)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
                 {netBalance < 0 ? '-' : ''}₹{Math.abs(netBalance).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.625rem', borderRadius: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}><TrendingUp size={20} /></div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Income</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>₹{monthIncome.toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.625rem', borderRadius: '0.75rem', background: 'rgba(239,68,68,0.15)', color: 'var(--color-danger)' }}><TrendingDown size={20} /></div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Expenses</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>₹{monthExpense.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart + List */}
      <div style={{ display: 'grid', gridTemplateColumns: pieData.length > 0 ? '1fr 1.5fr' : '1fr', gap: '1.5rem' }}>
        {pieData.length > 0 && (
          <div className="glass-card" style={{ padding: '1.5rem', height: '320px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--color-text)' }}>Expense Breakdown</h3>
            <ResponsiveContainer width="100%" height="88%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip
                  formatter={(v) => `₹${v.toFixed(2)}`}
                  contentStyle={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)', borderRadius: '0.5rem', fontSize: '0.8rem' }}
                />
                <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: '0.75rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Transactions list */}
        <div>
          {transactions.length === 0 ? (
            <div className="empty-state glass-card">
              <AlertTriangle size={40} />
              <p style={{ fontWeight: 600 }}>No transactions logged</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {sortedTransactions.map((e) => {
                const isIncome = e.type === 'income';
                return (
                <div key={e._id} className="glass-card animate-slideUp" style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', minWidth: 0 }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                      background: isIncome ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: isIncome ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                       {isIncome ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{e.category}</span>
                        {e.note && <span style={{ fontWeight: 400, fontSize: '0.8rem', color: 'var(--color-text-muted)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>- {e.note}</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>{new Date(e.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: isIncome ? '#10b981' : 'var(--color-danger)' }}>
                      {isIncome ? '+' : '-'}₹{e.amount.toFixed(2)}
                    </span>
                    <button className="btn-icon" onClick={() => handleDelete(e._id)}><Trash2 size={15} color="var(--color-danger)" /></button>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-text)' }}>New Transaction</h2>
            
            {/* Type Toggle */}
            <div style={{ display: 'flex', background: 'var(--color-bg-2)', borderRadius: '0.5rem', padding: '0.25rem' }}>
               <button type="button" onClick={() => handleTypeChange('expense')} style={{ flex: 1, padding: '0.5rem', borderRadius: '0.4rem', border: 'none', background: form.type === 'expense' ? 'var(--color-surface)' : 'transparent', color: form.type === 'expense' ? 'var(--color-text)' : 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', boxShadow: form.type === 'expense' ? 'var(--shadow-sm)' : 'none' }}>Expense</button>
               <button type="button" onClick={() => handleTypeChange('income')} style={{ flex: 1, padding: '0.5rem', borderRadius: '0.4rem', border: 'none', background: form.type === 'income' ? 'var(--color-surface)' : 'transparent', color: form.type === 'income' ? 'var(--color-text)' : 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', boxShadow: form.type === 'income' ? 'var(--shadow-sm)' : 'none' }}>Income</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Amount (₹)*</label>
                <input className="input-field" type="number" min="0.01" step="0.01" placeholder="0.00" value={form.amount} onChange={(e) => set('amount', e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Category*</label>
                <select className="input-field" value={form.category} onChange={(e) => set('category', e.target.value)}>
                  {(form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Date</label>
              <input className="input-field" type="date" value={form.date} max={getTodayDate()} onChange={(e) => set('date', e.target.value)} required />
            </div>
            <input className="input-field" placeholder="Note (optional)" value={form.note} onChange={(e) => set('note', e.target.value)} />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary"><Plus size={16} /> Save</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Finances;
