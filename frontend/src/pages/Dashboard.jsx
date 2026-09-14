import { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import {
  CheckSquare, Repeat, Wallet, FileText, Dumbbell,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#ec4899', '#f59e0b', '#0ea5e9', '#f43f5e', '#84cc16', '#8b5cf6'];

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="glass-card animate-slideUp" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg, ${color}22 0%, ${color}08 100%)`, borderColor: `${color}33` }}>
    <div style={{ padding: '0.7rem', borderRadius: '0.875rem', background: `${color}22`, color: color, flexShrink: 0 }}>
      <Icon size={22} />
    </div>
    <div>
      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>{sub}</div>}
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/dashboard');
        setData(res.data);
      } catch {
        setError('Failed to load dashboard. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);



  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--color-text-muted)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--color-border)', borderTop: '3px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
        Loading dashboard...
      </div>
    </div>
  );

  if (error) return (
    <div style={{ padding: '2rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '1rem', color: '#ef4444' }}>
      {error}
    </div>
  );

  return (
    <div className="animate-fadeIn">


      {/* Header */}
      <div className="page-header" style={{ marginTop: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '2rem' }}>Dashboard</h1>
          <div className="page-subtitle" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            A complete overview of your habits, tasks, and finances.
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard icon={CheckSquare} label="Pending Tasks" value={data.tasksDueToday} color="#3b82f6" sub="to complete" />
        <StatCard icon={Repeat} label="Active Streaks" value={data.activeStreaksCount} color="#10b981" sub="habits on track" />
        <StatCard icon={Wallet} label="Net Balance" value={`${data.netBalance < 0 ? '-' : ''}₹${Math.abs(data.netBalance || 0).toFixed(2)}`} color="#9a3412" sub="this month" />
        <StatCard icon={Dumbbell} label="Weekly Workouts" value={data.weeklyWorkouts} color="#eab308" sub="last 7 days" />
      </div>

      {/* Charts + Note Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Expense Breakdown Bar Chart */}
        <div className="glass-card" style={{ padding: '1.5rem', minHeight: '300px' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.25rem', color: 'var(--color-text)' }}>
            💸 Expense Breakdown
          </h3>
          {data.expenseBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.expenseBreakdown} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="_id" stroke="var(--color-text-muted)" tick={{ fontSize: 12 }} />
                <YAxis stroke="var(--color-text-muted)" tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(v) => [`₹${v.toFixed(2)}`, 'Total']}
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  contentStyle={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)', borderRadius: '0.625rem', fontSize: '0.8rem' }}
                />
                <Bar dataKey="total" radius={[5, 5, 0, 0]}>
                  {data.expenseBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              No expense data yet
            </div>
          )}
        </div>

        {/* Expense Pie Chart */}
        {data.expenseBreakdown.length > 0 ? (
          <div className="glass-card" style={{ padding: '1.5rem', minHeight: '300px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.25rem', color: 'var(--color-text)' }}>
              📊 Category Share
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.expenseBreakdown} dataKey="total" nameKey="_id" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4}>
                  {data.expenseBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toFixed(2)}`} contentStyle={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)', borderRadius: '0.625rem', fontSize: '0.8rem' }} />
                <Legend iconSize={9} iconType="circle" wrapperStyle={{ fontSize: '0.75rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          /* Workout ring card when no expenses */
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.5rem', alignSelf: 'flex-start', color: 'var(--color-text)' }}>🏋️ Weekly Activity</h3>
            <div style={{ position: 'relative', width: '120px', height: '120px' }}>
              <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border)" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-primary)" strokeWidth="8"
                  strokeDasharray="327" strokeDashoffset={327 - (327 * Math.min(data.weeklyWorkouts / 5, 1))}
                  style={{ transition: 'stroke-dashoffset 1s ease', strokeLinecap: 'round' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-text)' }}>{data.weeklyWorkouts}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>/ 5 goal</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Latest Note */}
      {data.recentNote && (
        <div className="glass-card animate-slideUp" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ padding: '0.7rem', borderRadius: '0.875rem', background: 'rgba(245,158,11,0.15)', color: 'var(--color-warning)', flexShrink: 0 }}>
            <FileText size={22} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '0.25rem' }}>Latest Note</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)', marginBottom: '0.25rem' }}>{data.recentNote.title}</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{data.recentNote.body}</p>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>
            {new Date(data.recentNote.date).toLocaleDateString()}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Dashboard;
