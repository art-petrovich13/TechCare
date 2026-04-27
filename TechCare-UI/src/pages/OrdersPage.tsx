import { useEffect, useState } from "react";
import {
    getOrders, createOrder, updateOrder, deleteOrder,
    getDevices, getEmployees
} from "../api/api";
import type { Order, CreateOrderDto, Device, Employee } from "../types";
import { STATUS_LABELS, STATUS_COLORS, ORDER_STATUSES } from "../types";
import Modal from "../components/Modal";

const EMPTY: CreateOrderDto = {
    deviceId: 0, employeeId: undefined,
    description: "", status: "new"
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState<Order | null>(null);
    const [form, setForm] = useState<CreateOrderDto>(EMPTY);
    const [filter, setFilter] = useState("");

    const load = () => Promise.all([getOrders(), getDevices(), getEmployees()])
        .then(([o, d, e]) => {
            setOrders(o.data); setDevices(d.data); setEmployees(e.data);
        });
    useEffect(() => { load(); }, []);

    const openCreate = () => {
        setEditing(null);
        setForm({ ...EMPTY, deviceId: devices[0]?.id || 0 });
        setModal(true);
    };
    const openEdit = (o: Order) => {
        setEditing(o);
        setForm({
            deviceId: o.deviceId, employeeId: o.employeeId,
            description: o.description, status: o.status
        });
        setModal(true);
    };

    const handleSave = async () => {
        if (editing) await updateOrder(editing.id, form);
        else await createOrder(form);
        setModal(false); load();
    };

    const handleDelete = async (id: number) => {
        if (confirm("Удалить заявку?")) { await deleteOrder(id); load(); }
    };

    const filtered = filter
        ? orders.filter(o => o.status === filter)
        : orders;

    return (
        <div>
            <div className="page-header">
                <h1>Заявки на ремонт</h1>
                <button className="btn btn-primary" onClick={openCreate}>+ Создать заявку</button>
            </div>

            {/* Фильтр по статусу */}
            <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
                <button className="btn" style={{
                    background: filter === "" ? "#1a1a2e" : "#e2e8f0",
                    color: filter === "" ? "white" : "#475569"
                }}
                    onClick={() => setFilter("")}>Все</button>
                {ORDER_STATUSES.map(s => (
                    <button key={s} className="btn"
                        style={{
                            background: filter === s ? STATUS_COLORS[s] : "#e2e8f0",
                            color: filter === s ? "white" : "#475569"
                        }}
                        onClick={() => setFilter(s)}>
                        {STATUS_LABELS[s]}
                    </button>
                ))}
            </div>

            <div className="card">
                <table>
                    <thead><tr>
                        <th>№</th><th>Устройство</th><th>Клиент</th>
                        <th>Мастер</th><th>Описание</th><th>Статус</th><th>Дата</th><th>Действия</th>
                    </tr></thead>
                    <tbody>
                        {filtered.map(o => (
                            <tr key={o.id}>
                                <td>#{o.id}</td>
                                <td>{o.deviceInfo}</td>
                                <td>{o.clientName}</td>
                                <td>{o.employeeName || "—"}</td>
                                <td style={{
                                    maxWidth: 200, overflow: "hidden",
                                    textOverflow: "ellipsis", whiteSpace: "nowrap"
                                }}>
                                    {o.description}
                                </td>
                                <td>
                                    <span className="badge" style={{ background: STATUS_COLORS[o.status] }}>
                                        {STATUS_LABELS[o.status]}
                                    </span>
                                </td>
                                <td>{new Date(o.createdAt).toLocaleDateString("ru-RU")}</td>
                                <td>
                                    <button className="btn btn-edit" onClick={() => openEdit(o)}>✏️</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(o.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modal && (
                <Modal title={editing ? "Изменить заявку" : "Новая заявка"} onClose={() => setModal(false)}>
                    <div className="form-group"><label>Устройство *</label>
                        <select value={form.deviceId}
                            onChange={e => setForm({ ...form, deviceId: +e.target.value })}>
                            {devices.map(d => (
                                <option key={d.id} value={d.id}>
                                    {d.clientName} — {d.brand} {d.model}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group"><label>Мастер</label>
                        <select value={form.employeeId || ""}
                            onChange={e => setForm({ ...form, employeeId: e.target.value ? +e.target.value : undefined })}>
                            <option value="">— Не назначен —</option>
                            {employees.map(e => (
                                <option key={e.id} value={e.id}>{e.fullName} ({e.role})</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group"><label>Описание неисправности *</label>
                        <textarea rows={3} value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                    <div className="form-group"><label>Статус</label>
                        <select value={form.status}
                            onChange={e => setForm({ ...form, status: e.target.value })}>
                            {ORDER_STATUSES.map(s => (
                                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button className="btn btn-secondary" onClick={() => setModal(false)}>Отмена</button>
                        <button className="btn btn-primary" onClick={handleSave}>Сохранить</button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
