import { NavLink, Outlet } from "react-router-dom";

const navItems = [
    { to: "/", icon: "🏠", label: "Главная" },
    { to: "/orders", icon: "📋", label: "Заявки" },
    { to: "/clients", icon: "👤", label: "Клиенты" },
    { to: "/devices", icon: "💻", label: "Устройства" },
    { to: "/employees", icon: "👷", label: "Сотрудники" },
    { to: "/services", icon: "🔧", label: "Услуги" },
];

export default function Layout() {
    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <h2>🖥️ TechCare </h2>
                    <p>Система учёта ремонтов</p>
                </div>
                <nav>
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/"}
                            className={({ isActive }) =>
                                `nav-item${isActive ? " active" : ""}`
                            }
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
