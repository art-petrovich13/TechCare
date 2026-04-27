import { useEffect, useState } from "react";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "../api/api";
import type { Employee, CreateEmployeeDto } from "../types";
import Modal from "../components/Modal";

const EMPTY: CreateEmployeeDto = { fullName: '', role: '', phone: '' };

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState<Employee | null>(null);
    const [form, setForm] = useState<CreateEmployeeDto>(EMPTY);

    const load = () => getEmployees().then(r => setEmployees(r.data));
    useEffect(() => { load(); }, []);

    const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
    const openEdit = (e: Employee) => {
        setEditing(e);
        setForm({ fullName: e.fullName, role: e.role, phone: e.phone || '' });
        setModal(true);
    };

    const handleSave = async () => {
        if (editing) await updateEmployee(editing.id, form);
        else await createEmployee(form);
        setModal(false); load();
    };

    const handleDelete = async (id: number) => {
        if (confirm('Удалить сотрудника?')) { await deleteEmployee(id); load(); }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Сотрудники</h1>
                <button className='btn btn-primary' onClick={openCreate}>+ Добавить сотрудника</button>
            </div>
            <div className="card">
                <table>
                    <thead><tr>
                        <th>ID</th><th>ФИО</th><th>Должность</th><th>Телефон</th><th>Действия</th>
                    </tr></thead>
                    <tbody>
                        {employees.map(e => (
                            <tr key={e.id}>
                                <td>#{e.id}</td>
                                <td>{e.fullName}</td>
                                <td>{e.role}</td>
                                <td>{e.phone || "—"}</td>
                                <td>
                                    <button className='btn btn-edit' onClick={() => openEdit(e)}>✏️ Изменить</button>
                                    <button className='btn btn-danger' onClick={() => handleDelete(e.id)}>🗑️ Удалить</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {modal && (
                <Modal title={editing ? "Изменить сотрудника" : "Новый сотрудник"} onClose={() => setModal(false)}>
                    <div className="form-group"><label>ФИО *</label>
                        <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} /></div>
                    <div className="form-group"><label>Должность *</label>
                        <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} /></div>
                    <div className="form-group"><label>Телефон</label>
                        <input value={form.phone || ""} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                    <div className="modal-actions">
                        <button className='btn btn-secondary' onClick={() => setModal(false)}>Отмена</button>
                        <button className='btn btn-primary' onClick={handleSave}>Сохранить</button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
