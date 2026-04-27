import { useEffect, useState } from "react";
import { getClients } from "../api/api";
import { getOrders } from "../api/api";
import { getEmployees } from "../api/api";
import { getDevices } from "../api/api";
import { STATUS_LABELS, STATUS_COLORS } from "../types";

export default function Dashboard() {
    const [stats, setStats] = useState({
        clients: 0, orders: 0, employees: 0, devices: 0
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);

    useEffect(() => {
        Promise.all([getClients(), getOrders(), getEmployees(), getDevices()])
            .then(([c, o, e, d]) => {
                setStats({
                    clients: c.data.length,
                    orders: o.data.length,
                    employees: e.data.length,
                    devices: d.data.length,
                });
                setRecentOrders(o.data.slice(0, 5));
            });
    }, []);

    return (
        <div>
            <div className="page-header">
                <h1>Главная панель</h1>
            </div>

            <div className="stats-grid">
                {[
                    { label: "Клиентов", value: stats.clients, color: "#3b82f6" },
                    { label: "Заявок", value: stats.orders, color: "#f59e0b" },
                    { label: "Сотрудников", value: stats.employees, color: "#10b981" },
                    { label: "Устройств", value: stats.devices, color: "#8b5cf6" },
                ].map(s => (
                    <div key={s.label} className="stat-card"
                        style={{ borderLeftColor: s.color }}>
                        <h3>{s.value}</h3>
                        <p>{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="card">
                <h2 style={{ marginBottom: 16, fontSize: 18 }}>Последние заявки</h2>
                <table>
                    <thead>
                        <tr>
                            <th>№</th><th>Устройство</th><th>Клиент</th>
                            <th>Мастер</th><th>Статус</th><th>Дата</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.map(o => (
                            <tr key={o.id}>
                                <td>#{o.id}</td>
                                <td>{o.deviceInfo}</td>
                                <td>{o.clientName}</td>
                                <td>{o.employeeName || "—"}</td>
                                <td>
                                    <span className="badge"
                                        style={{ background: STATUS_COLORS[o.status] }}>
                                        {STATUS_LABELS[o.status]}
                                    </span>
                                </td>
                                <td>{new Date(o.createdAt).toLocaleDateString("ru-RU")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
