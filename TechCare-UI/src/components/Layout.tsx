import { NavLink, Outlet } from "react-router-dom";
import {
  Home,
  BarChart3,
  ClipboardList,
  Users,
  Monitor,
  UserCheck,
  Wrench,
  Cpu,
  Circle
} from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { to: '/',           icon: '🏠', label: 'Главная'    },
  { to: '/analytics',  icon: '📊', label: 'Аналитика'  },  
  { to: '/orders',     icon: '📋', label: 'Заявки'     },
  { to: '/clients',    icon: '👤', label: 'Клиенты'    },
  { to: '/devices',    icon: '💻', label: 'Устройства' },
  { to: '/employees',  icon: '👷', label: 'Сотрудники' },
  { to: '/services',   icon: '🔧', label: 'Услуги'     },
];

function ApiStatus() {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("https://localhost:7238/api/health");
        setOnline(res.ok);
      } catch {
        setOnline(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="api-status">
      <Circle
        size={8}
        fill={online ? "#22c55e" : "#ef4444"}
        color={online ? "#22c55e" : "#ef4444"}
      />
      <span>{online ? "Онлайн" : "Оффлайн"}</span>
    </div>
  );
}

export default function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        {/* Логотип с иконкой микросхемы */}
        <div className="sidebar-logo">
          <Cpu className="logo-icon" size={32} />
          <div>
            <h2>TechCare</h2>
            <p>Система учёта ремонтов</p>
          </div>
        </div>

        {/* Основная навигация */}
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `nav-item${isActive ? " active" : ""}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Нижняя секция сайдбара */}
        <div className="sidebar-footer">
          <span className="version">v1.0.0</span>
          <ApiStatus />
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}