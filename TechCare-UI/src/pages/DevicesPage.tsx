import { useEffect, useState } from "react";
import { getDevices, createDevice, updateDevice, deleteDevice, getClients } from "../api/api";
import type { Device, CreateDeviceDto, Client } from "../types";
import Modal from "../components/Modal";

const EMPTY: CreateDeviceDto = { clientId: 0, deviceType: "", brand: "", model: "", serialNumber: "" };

export default function DevicesPage() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState<Device | null>(null);
    const [form, setForm] = useState<CreateDeviceDto>(EMPTY);

    const load = () => Promise.all([getDevices(), getClients()])
        .then(([d, c]) => { setDevices(d.data); setClients(c.data); });
    useEffect(() => { load(); }, []);

    const openCreate = () => {
        setEditing(null);
        setForm({ ...EMPTY, clientId: clients[0]?.id || 0 });
        setModal(true);
    };
    const openEdit = (d: Device) => {
        setEditing(d);
        setForm({
            clientId: d.clientId, deviceType: d.deviceType,
            brand: d.brand, model: d.model, serialNumber: d.serialNumber || ""
        });
        setModal(true);
    };

    const handleSave = async () => {
        if (editing) await updateDevice(editing.id, form);
        else await createDevice(form);
        setModal(false); load();
    };

    const handleDelete = async (id: number) => {
        if (confirm("Удалить устройство?")) { await deleteDevice(id); load(); }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Устройства</h1>
                <button className="btn btn-primary" onClick={openCreate}>+ Добавить устройство</button>
            </div>
            <div className="card">
                <table>
                    <thead><tr>
                        <th>ID</th><th>Клиент</th><th>Тип</th>
                        <th>Производитель</th><th>Модель</th><th>Серийный №</th><th>Действия</th>
                    </tr></thead>
                    <tbody>
                        {devices.map(d => (
                            <tr key={d.id}>
                                <td>#{d.id}</td>
                                <td>{d.clientName}</td>
                                <td>{d.deviceType}</td>
                                <td>{d.brand}</td>
                                <td>{d.model}</td>
                                <td>{d.serialNumber || "—"}</td>
                                <td>
                                    <button className="btn btn-edit" onClick={() => openEdit(d)}>✏️</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(d.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {modal && (
                <Modal title={editing ? "Изменить устройство" : "Новое устройство"} onClose={() => setModal(false)}>
                    <div className="form-group"><label>Клиент *</label>
                        <select value={form.clientId}
                            onChange={e => setForm({ ...form, clientId: +e.target.value })}>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                        </select>
                    </div>
                    <div className="form-group"><label>Тип устройства *</label>
                        <input value={form.deviceType} onChange={e => setForm({ ...form, deviceType: e.target.value })} /></div>
                    <div className="form-group"><label>Производитель *</label>
                        <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} /></div>
                    <div className="form-group"><label>Модель *</label>
                        <input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} /></div>
                    <div className="form-group"><label>Серийный номер</label>
                        <input value={form.serialNumber || ""} onChange={e => setForm({ ...form, serialNumber: e.target.value })} /></div>
                    <div className="modal-actions">
                        <button className="btn btn-secondary" onClick={() => setModal(false)}>Отмена</button>
                        <button className="btn btn-primary" onClick={handleSave}>Сохранить</button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
