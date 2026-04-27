import { useEffect, useState } from "react";
import { getServices, createService, updateService, deleteService } from "../api/api";
import type { Service, CreateServiceDto } from "../types";
import Modal from "../components/Modal";

const EMPTY: CreateServiceDto = { name: "", price: 0, description: "" };

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState<Service | null>(null);
    const [form, setForm] = useState<CreateServiceDto>(EMPTY);

    const load = () => getServices().then(r => setServices(r.data));
    useEffect(() => { load(); }, []);

    const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
    const openEdit = (s: Service) => {
        setEditing(s);
        setForm({ name: s.name, price: s.price, description: s.description || "" });
        setModal(true);
    };

    const handleSave = async () => {
        if (editing) await updateService(editing.id, form);
        else await createService(form);
        setModal(false); load();
    };

    const handleDelete = async (id: number) => {
        if (confirm("Удалить услугу?")) { await deleteService(id); load(); }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Услуги</h1>
                <button className="btn btn-primary" onClick={openCreate}>+ Добавить услугу</button>
            </div>
            <div className="card">
                <table>
                    <thead><tr>
                        <th>ID</th><th>Название</th><th>Цена (руб.)</th><th>Описание</th><th>Действия</th>
                    </tr></thead>
                    <tbody>
                        {services.map(s => (
                            <tr key={s.id}>
                                <td>#{s.id}</td>
                                <td>{s.name}</td>
                                <td>{s.price.toLocaleString("ru-RU")} ₽</td>
                                <td>{s.description || "—"}</td>
                                <td>
                                    <button className="btn btn-edit" onClick={() => openEdit(s)}>✏️ Изменить</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(s.id)}>🗑️ Удалить</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {modal && (
                <Modal title={editing ? "Изменить услугу" : "Новая услуга"} onClose={() => setModal(false)}>
                    <div className="form-group"><label>Название *</label>
                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                    <div className="form-group"><label>Цена (руб.) *</label>
                        <input type="number" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} /></div>
                    <div className="form-group"><label>Описание</label>
                        <textarea rows={3} value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                    <div className="modal-actions">
                        <button className="btn btn-secondary" onClick={() => setModal(false)}>Отмена</button>
                        <button className="btn btn-primary" onClick={handleSave}>Сохранить</button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
