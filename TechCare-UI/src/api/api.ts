import axios from "axios";
import type {
    Client, CreateClientDto, Device, CreateDeviceDto,
    Employee, CreateEmployeeDto, Service, CreateServiceDto,
    Order, CreateOrderDto
} from "../types";

const BASE_URL = "https://localhost:7238/api";

const api = axios.create({ baseURL: BASE_URL });

// Clients
export const getClients = () => api.get<Client[]>("/clients");
export const getClient = (id: number) => api.get<Client>(`/clients/${id}`);
export const createClient = (dto: CreateClientDto) => api.post<Client>("/clients", dto);
export const updateClient = (id: number, dto: CreateClientDto) => api.put(`/clients/${id}`, dto);
export const deleteClient = (id: number) => api.delete(`/clients/${id}`);

// Employees 
export const getEmployees = () => api.get<Employee[]>("/employees");
export const createEmployee = (dto: CreateEmployeeDto) => api.post<Employee>("/employees", dto);
export const updateEmployee = (id: number, dto: CreateEmployeeDto) => api.put(`/employees/${id}`, dto);
export const deleteEmployee = (id: number) => api.delete(`/employees/${id}`);

// Devices
export const getDevices = () => api.get<Device[]>("/devices");
export const createDevice = (dto: CreateDeviceDto) => api.post<Device>("/devices", dto);
export const updateDevice = (id: number, dto: CreateDeviceDto) => api.put(`/devices/${id}`, dto);
export const deleteDevice = (id: number) => api.delete(`/devices/${id}`);

// Services
export const getServices = () => api.get<Service[]>("/services");
export const createService = (dto: CreateServiceDto) => api.post<Service>("/services", dto);
export const updateService = (id: number, dto: CreateServiceDto) => api.put(`/services/${id}`, dto);
export const deleteService = (id: number) => api.delete(`/services/${id}`);

// Orders
export const getOrders = () => api.get<Order[]>("/orders");
export const createOrder = (dto: CreateOrderDto) => api.post<Order>("/orders", dto);
export const updateOrder = (id: number, dto: CreateOrderDto) => api.put(`/orders/${id}`, dto);
export const deleteOrder = (id: number) => api.delete(`/orders/${id}`);
