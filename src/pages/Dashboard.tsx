import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';
import { TrendingUp, Search, MapPin, CheckCircle2, Package, ArrowRight, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/StatCard';
import {
  computeStats, categoryDistribution, locationDistribution, lostVsFound, reportsOverTime, recentActivity,
} from '../utils/stats';
import { timeAgo } from '../utils/dateUtils';

const CHART_COLORS = ['#1f47f5', '#f97316', '#22c55e', '#8b5cf6', '#06b6d4', '#ec4899', '#eab308', '#14b8a6'];

export function Dashboard() {
  const { items } = useApp();

  const stats = useMemo(() => computeStats(items), [items]);
  const catData = useMemo(() => categoryDistribution(items), [items]);
  const locData = useMemo(() => locationDistribution(items).slice(0, 8), [items]);
  const lostFoundData = useMemo(() => lostVsFound(items), [items]);
  const timeData = useMemo(() => reportsOverTime(items), [items]);
  const activity = useMemo(() => recentActivity(items), [items]);

  const isDark = document.documentElement.classList.contains('dark');
  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Analytics and statistics for campus lost &amp; found items.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        <StatCard label="Total Reports" value={stats.total} icon={Package} color="brand" />
        <StatCard label="Lost Items" value={stats.lost} icon={Search} color="lost" />
        <StatCard label="Found Items" value={stats.found} icon={MapPin} color="found" />
        <StatCard label="Claimed Items" value={stats.claimed} icon={CheckCircle2} color="claimed" />
        <StatCard label="Reunited Rate" value={stats.reunitedRate} suffix="%" icon={TrendingUp} color="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Category Distribution */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Category Distribution</h2>
          {catData.length === 0 ? (
            <NoData />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={catData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {catData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1e293b' : '#fff',
                    border: `1px solid ${gridColor}`,
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Lost vs Found by Location */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Lost vs Found by Location</h2>
          {lostFoundData.length === 0 ? (
            <NoData />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={lostFoundData} margin={{ left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: axisColor }} angle={-30} textAnchor="end" height={56} interval={0} />
                <YAxis tick={{ fontSize: 11, fill: axisColor }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1e293b' : '#fff',
                    border: `1px solid ${gridColor}`,
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Lost" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Found" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Reports Over Time */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Reports Over Time</h2>
          {timeData.length === 0 ? (
            <NoData />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={timeData} margin={{ left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: axisColor }} />
                <YAxis tick={{ fontSize: 11, fill: axisColor }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1e293b' : '#fff',
                    border: `1px solid ${gridColor}`,
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="reports" stroke="#1f47f5" strokeWidth={2} dot={{ r: 3, fill: '#1f47f5' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Items by Location */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Items by Location</h2>
          {locData.length === 0 ? (
            <NoData />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={locData} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: axisColor }} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1e293b' : '#fff',
                    border: `1px solid ${gridColor}`,
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" fill="#1f47f5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            <h2 className="font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
          </div>
          <Link to="/browse" className="flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400 hover:gap-2 transition-all">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {activity.length === 0 ? (
          <NoData />
        ) : (
          <div className="space-y-2">
            {activity.map((act, i) => (
              <div key={act.id} className="flex items-center gap-3 rounded-lg border border-slate-100 dark:border-slate-800 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-semibold shrink-0">
                  {i + 1}
                </div>
                <p className="flex-1 text-sm text-slate-700 dark:text-slate-200">{act.text}</p>
                <span className="text-xs text-slate-400 shrink-0">{timeAgo(act.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NoData() {
  return (
    <div className="flex items-center justify-center h-48 text-sm text-slate-400">
      No data available
    </div>
  );
}
