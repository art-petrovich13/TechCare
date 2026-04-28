import { useEffect, useState, useCallback } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  getSummary, getOrdersByMonth, getTopServices,
  getEmployeeLoad, getDeviceTypes, getReport,
} from '../api/api';
import type { Summary, OrdersByPeriod, TopService, EmployeeLoad, DeviceTypeStat, ReportData } from '../types';
import { exportToExcel } from '../utils/exportExcel';
import { exportToDocx } from '../utils/exportDocx';

const PIE_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'];

const PRESETS = [
  { label: 'Неделя', days: 7 },
  { label: 'Месяц', days: 30 },
  { label: 'Квартал', days: 90 },
  { label: 'Год', days: 365 },
];

function toIso(d: Date) { return d.toISOString().slice(0, 10); }

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function KpiCard({
  label, value, sub, color,
}: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '20px 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      borderLeft: `4px solid ${color}`,
    }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e' }}>{value}</div>
      <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: color, marginTop: 4, fontWeight: 600 }}>{sub}</div>}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: 24,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 20 }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1a1d2e', border: '1px solid rgba(59,130,246,0.3)',
      borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#e8eaf6',
    }}>
      <p style={{ fontWeight: 600, marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' && p.name?.includes('₽')
            ? p.value.toLocaleString('ru-RU') + ' ₽'
            : p.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const today = new Date();
  const [dateFrom, setDateFrom] = useState(toIso(addDays(today, -30)));
  const [dateTo, setDateTo] = useState(toIso(today));
  const [year, setYear] = useState(today.getFullYear());

  const [summary, setSummary] = useState<Summary | null>(null);
  const [byMonth, setByMonth] = useState<OrdersByPeriod[]>([]);
  const [topServices, setTopServices] = useState<TopService[]>([]);
  const [employeeLoad, setEmployeeLoad] = useState<EmployeeLoad[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<DeviceTypeStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const statusData = summary ? [
    { name: 'Новые', value: summary.newOrders, color: '#3b82f6' },
    { name: 'В работе', value: summary.inProgressOrders, color: '#f59e0b' },
    { name: 'Выполнены', value: summary.completedOrders, color: '#10b981' },
    { name: 'Отменены', value: summary.cancelledOrders, color: '#ef4444' },
  ].filter(s => s.value > 0) : [];

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [s, m, ts, el, dt] = await Promise.all([
        getSummary(dateFrom, dateTo),
        getOrdersByMonth(year),
        getTopServices(),
        getEmployeeLoad(),
        getDeviceTypes(),
      ]);
      setSummary(s.data);
      setByMonth(m.data);
      setTopServices(ts.data);
      setEmployeeLoad(el.data);
      setDeviceTypes(dt.data);
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo, year]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const applyPreset = (days: number) => {
    setDateFrom(toIso(addDays(today, -days)));
    setDateTo(toIso(today));
  };

  const handleExport = async (format: 'excel' | 'docx') => {
    setExporting(true);
    try {
      const { data } = await getReport(dateFrom, dateTo);
      if (format === 'excel') exportToExcel(data);
      else await exportToDocx(data);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e' }}>
          Аналитика и отчёты
        </h1>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {PRESETS.map(p => (
            <button key={p.days} className="btn"
              style={{ background: '#f1f5f9', color: '#475569', padding: '8px 14px', fontSize: 13 }}
              onClick={() => applyPreset(p.days)}>
              {p.label}
            </button>
          ))}

          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            style={{
              padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db',
              fontSize: 13, outline: 'none'
            }} />
          <span style={{ color: '#64748b', fontSize: 13 }}>—</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            style={{
              padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db',
              fontSize: 13, outline: 'none'
            }} />

          <button className="btn btn-primary" onClick={() => handleExport('excel')}
            disabled={exporting || loading} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            📊 {exporting ? 'Загрузка...' : 'Excel'}
          </button>
          <button className="btn btn-primary"
            style={{ background: '#1F4E79' }}
            onClick={() => handleExport('docx')}
            disabled={exporting || loading}>
            📄 {exporting ? 'Загрузка...' : 'DOCX'}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 80, color: '#94a3b8', fontSize: 16 }}>
          Загрузка данных...
        </div>
      ) : (
        <>
          

          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr',
            gap: 16, marginBottom: 16
          }}>

            <ChartCard title={`Заявки и выручка по месяцам (${year})`}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                <select value={year} onChange={e => setYear(+e.target.value)}
                  style={{
                    padding: '4px 8px', borderRadius: 6, border: '1px solid #d1d5db',
                    fontSize: 13, outline: 'none'
                  }}>
                  {[2023, 2024, 2025, 2026].map(y =>
                    <option key={y} value={y}>{y}</option>
                  )}
                </select>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={byMonth}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#3b82f6' }} />
                  <YAxis yAxisId="right" orientation="right"
                    tick={{ fontSize: 12, fill: '#10b981' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 13 }} />
                  <Line yAxisId="left" type="monotone" dataKey="count"
                    stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }}
                    name="Заявок" activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue"
                    stroke="#10b981" strokeWidth={2} dot={{ r: 4 }}
                    name="Выручка ₽" activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Статусы заявок за период">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => {
                      const p = percent ?? 0;
                      return `${name} ${(p * 100).toFixed(0)}%`;
                    }}
                    labelLine={false}
                  >
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => v != null ? [`${v} заявок`] : ['0 заявок']} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 16, marginBottom: 16
          }}>

            <ChartCard title="Топ услуг по количеству использований">
              {topServices.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: 40 }}>
                  Нет данных об услугах
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={topServices}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis type="category" dataKey="serviceName" width={130}
                      tick={{ fontSize: 11, fill: '#475569' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="usageCount" fill="#8b5cf6" radius={[0, 4, 4, 0]}
                      name="Использований">
                      {topServices.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            <ChartCard title="Нагрузка по сотрудникам">
              {employeeLoad.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: 40 }}>
                  Нет назначенных заявок
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={employeeLoad}
                    margin={{ top: 5, right: 10, left: 0, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="employeeName"
                      tick={{ fontSize: 11, fill: '#475569' }}
                      angle={-20} textAnchor="end" interval={0} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 13 }} />
                    <Bar dataKey="totalOrders" fill="#3b82f6" name="Всего заявок"
                      radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completedOrders" fill="#10b981" name="Выполнено"
                      radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#1a1a2e' }}>
              Распределение заявок по типам устройств
            </h3>
            {deviceTypes.length === 0 ? (
              <p style={{ color: '#94a3b8', padding: '20px 0', textAlign: 'center' }}>
                Нет данных
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Тип устройства</th>
                    <th>Количество заявок</th>
                    <th>Доля</th>
                    <th>Визуализация</th>
                  </tr>
                </thead>
                <tbody>
                  {deviceTypes.map((dt, i) => {
                    const total = deviceTypes.reduce((s, x) => s + x.count, 0);
                    const pct = total > 0 ? (dt.count / total * 100) : 0;
                    return (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{dt.deviceType}</td>
                        <td>{dt.count}</td>
                        <td>{pct.toFixed(1)}%</td>
                        <td>
                          <div style={{
                            height: 10, width: '100%', background: '#f1f5f9',
                            borderRadius: 5, overflow: 'hidden',
                          }}>
                            <div style={{
                              height: '100%', borderRadius: 5,
                              width: `${pct}%`,
                              background: PIE_COLORS[i % PIE_COLORS.length],
                              transition: 'width 0.5s ease',
                            }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}