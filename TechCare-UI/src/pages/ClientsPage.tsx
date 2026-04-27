import { useEffect, useState } from "react";
import { getClients, createClient, updateClient, deleteClient } from "../api/api";
import type { Client, CreateClientDto } from "../types";
import Modal from "../components/Modal";

const EMPTY: CreateClientDto = { fullName: "", phone: "", email: "" };

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState<Client | null>(null);
    const [form, setForm] = useState<CreateClientDto>(EMPTY);

    const load = () => getClients().then(r => setClients(r.data));
    useEffect(() => { load(); }, []);

    const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
    const openEdit = (c: Client) => {
        setEditing(c);
        setForm({ fullName: c.fullName, phone: c.phone, email: c.email || "" });
        setModal(true);
    };

    const handleSave = async () => {
        if (editing) await updateClient(editing.id, form);
        else await createClient(form);
        setModal(false);
        load();
    };

    const handleDelete = async (id: number) => {
        if (confirm("Удалить клиента?")) {
            await deleteClient(id);
            load();
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Клиенты</h1>
                <button className="btn btn-primary" onClick={openCreate}>+ Добавить клиента</button>
            </div>

            <div className="card">
                {clients.length === 0 ? (
                    <div className="empty-state">
                        <p>Нет клиентов. Добавьте первого!</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th><th>ФИО</th><th>Телефон</th>
                                <th>Email</th><th>Дата регистрации</th><th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(c => (
                                <tr key={c.id}>
                                    <td>#{c.id}</td>
                                    <td>{c.fullName}</td>
                                    <td>{c.phone}</td>
                                    <td>{c.email || "—"}</td>
                                    <td>{new Date(c.createdAt).toLocaleDateString("ru-RU")}</td>
                                    <td>
                                        <button className="btn btn-edit" onClick={() => openEdit(c)}>✏️ Изменить</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>🗑️ Удалить</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {modal && (
                <Modal title={editing ? "Изменить клиента" : "Новый клиент"} onClose={() => setModal(false)}>
                    <div className="form-group">
                        <label>ФИО *</label>
                        <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Телефон *</label>
                        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input value={form.email || ""} onChange={e => setForm({ ...form, email: e.target.value })} />
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
