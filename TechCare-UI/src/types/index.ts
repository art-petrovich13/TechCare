// Клиент
export interface Client {
    id: number;
    fullName: string;
    phone: string;
    email?: string;
    createdAt: string;
}

export interface CreateClientDto {
    fullName: string;
    phone: string;
    email?: string;
}

// Сотрудник
export interface Employee {
    id: number;
    fullName: string;
    role: string;
    phone?: string;
    createdAt: string;
}

export interface CreateEmployeeDto {
    fullName: string;
    role: string;
    phone?: string;
}

// Устройство
export interface Device {
    id: number;
    clientId: number;
    clientName: string;
    deviceType: string;
    brand: string;
    model: string;
    serialNumber?: string;
}

export interface CreateDeviceDto {
    clientId: number;
    deviceType: string;
    brand: string;
    model: string;
    serialNumber?: string;
}

// Услуга
export interface Service {
    id: number;
    name: string;
    price: number;
    description?: string;
}

export interface CreateServiceDto {
    name: string;
    price: number;
    description?: string;
}

// Заявка
export interface Order {
    id: number;
    deviceId: number;
    deviceInfo: string;
    clientName: string;
    employeeId?: number;
    employeeName?: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    totalPrice:   number;    
    completedAt?: string;
}

export interface CreateOrderDto {
    deviceId: number;
    employeeId?: number;
    description: string;
    status: string;
    totalPrice: number;
}

// Статусы заявок
export const ORDER_STATUSES = ['new', 'in_progress', 'done', 'cancelled'] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];

export const STATUS_LABELS: Record<string, string> = {
    new: 'Новая',
    in_progress: 'В работе',
    done: 'Выполнена',
    cancelled: 'Отменена',
};

export const STATUS_COLORS: Record<string, string> = {
    new: '#3b82f6',
    in_progress: '#f59e0b',
    done: '#10b981',
    cancelled: '#ef4444',
};

export interface Summary {
  totalOrders:          number;
  completedOrders:      number;
  inProgressOrders:     number;
  newOrders:            number;
  cancelledOrders:      number;
  totalRevenue:         number;
  avgOrderPrice:        number;
  avgRepairDays:        number;
  totalClients:         number;
  newClientsThisPeriod: number;
}

export interface OrdersByPeriod {
  label:   string;
  count:   number;
  revenue: number;
}

export interface TopService {
  serviceName:  string;
  usageCount:   number;
  totalRevenue: number;
}

export interface EmployeeLoad {
  employeeName:    string;
  totalOrders:     number;
  completedOrders: number;
  totalRevenue:    number;
}

export interface DeviceTypeStat {
  deviceType: string;
  count:      number;
}

export interface ReportData {
  period:       string;
  summary:      Summary;
  byMonth:      OrdersByPeriod[];
  topServices:  TopService[];
  employeeLoad: EmployeeLoad[];
  deviceTypes:  DeviceTypeStat[];
}