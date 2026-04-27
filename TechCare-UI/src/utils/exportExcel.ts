import * as XLSX from 'xlsx';
import type { ReportData } from '../types';

export function exportToExcel(data: ReportData): void {
  const wb = XLSX.utils.book_new();

  const summaryRows: (string | number)[][] = [
    ['Показатель', 'Значение'],
    ['Период',                       data.period],
    [''],
    ['Всего заявок',                 data.summary.totalOrders],
    ['Выполнено',                    data.summary.completedOrders],
    ['В работе',                     data.summary.inProgressOrders],
    ['Новых (ожидают)',               data.summary.newOrders],
    ['Отменено',                     data.summary.cancelledOrders],
    [''],
    ['Общая выручка (₽)',            data.summary.totalRevenue],
    ['Средний чек (₽)',              Number(data.summary.avgOrderPrice.toFixed(2))],
    ['Среднее время ремонта (дни)',  data.summary.avgRepairDays],
    [''],
    ['Всего клиентов в системе',     data.summary.totalClients],
    ['Новых клиентов за период',     data.summary.newClientsThisPeriod],
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(summaryRows);
  ws1['!cols'] = [{ wch: 35 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws1, 'Сводка');

  const monthRows: (string | number)[][] = [
    ['Месяц', 'Заявок', 'Выручка (₽)'],
    ...data.byMonth.map(m => [m.label, m.count, m.revenue]),
    [''],
    ['Итого',
      data.byMonth.reduce((s, m) => s + m.count, 0),
      data.byMonth.reduce((s, m) => s + m.revenue, 0)
    ],
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(monthRows);
  ws2['!cols'] = [{ wch: 12 }, { wch: 12 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'По месяцам');

  const serviceRows: (string | number)[][] = [
    ['Услуга', 'Использований', 'Выручка (₽)'],
    ...data.topServices.map(s => [s.serviceName, s.usageCount, s.totalRevenue]),
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(serviceRows);
  ws3['!cols'] = [{ wch: 30 }, { wch: 16 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, ws3, 'Услуги');

  const empRows: (string | number)[][] = [
    ['Сотрудник', 'Всего заявок', 'Выполнено', 'Выручка (₽)'],
    ...data.employeeLoad.map(e => [
      e.employeeName, e.totalOrders, e.completedOrders, e.totalRevenue
    ]),
  ];
  const ws4 = XLSX.utils.aoa_to_sheet(empRows);
  ws4['!cols'] = [{ wch: 28 }, { wch: 14 }, { wch: 12 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, ws4, 'Сотрудники');

  const safePeriod = data.period.replace(/[^a-zA-Z0-9а-яА-Я\-\.]/g, '_');
  XLSX.writeFile(wb, `TechCare_Report_${safePeriod}.xlsx`);
}