import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType,
  VerticalAlign,
} from 'docx';
import { saveAs } from 'file-saver';
import type { ReportData } from '../types';

function heading1(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, bold: true, size: 36, font: 'Arial' })],
  });
}

function heading2(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, bold: true, size: 28, font: 'Arial', color: '1F4E79' })],
  });
}

function para(text: string, opts: { bold?: boolean; italic?: boolean } = {}) {
  return new Paragraph({
    spacing: { after: 100 },
    children: [new TextRun({ text, font: 'Arial', size: 22, ...opts })],
  });
}

function emptyPara() {
  return new Paragraph({ children: [new TextRun('')] });
}

const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const allBorders = {
  top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder,
};

function headerCell(text: string, width: number) {
  return new TableCell({
    borders: allBorders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: '1F4E79', type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true, color: 'FFFFFF', font: 'Arial', size: 20 })],
    })],
  });
}

function dataCell(text: string, width: number, alt: boolean) {
  return new TableCell({
    borders: allBorders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: alt ? 'EBF3FB' : 'FFFFFF', type: ShadingType.CLEAR },
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [new Paragraph({
      children: [new TextRun({ text, font: 'Arial', size: 20 })],
    })],
  });
}

function buildSummaryTable(d: ReportData['summary']): Table {
  const rows: [string, string][] = [
    ['Всего заявок',              String(d.totalOrders)],
    ['Выполнено',                 String(d.completedOrders)],
    ['В работе',                  String(d.inProgressOrders)],
    ['Новых (ожидают)',            String(d.newOrders)],
    ['Отменено',                  String(d.cancelledOrders)],
    ['Общая выручка',             `${d.totalRevenue.toLocaleString('ru-RU')} ₽`],
    ['Средний чек',               `${d.avgOrderPrice.toFixed(0)} ₽`],
    ['Среднее время ремонта',     `${d.avgRepairDays} дн.`],
    ['Всего клиентов',            String(d.totalClients)],
    ['Новых клиентов за период',  String(d.newClientsThisPeriod)],
  ];

  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [5000, 4026],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [headerCell('Показатель', 5000), headerCell('Значение', 4026)],
      }),
      ...rows.map(([label, value], i) => new TableRow({
        children: [
          dataCell(label, 5000, i % 2 !== 0),
          dataCell(value, 4026, i % 2 !== 0),
        ],
      })),
    ],
  });
}

function buildMonthTable(months: ReportData['byMonth']): Table {
  const cols = [3000, 3000, 3026];
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          headerCell('Месяц', cols[0]),
          headerCell('Заявок', cols[1]),
          headerCell('Выручка (₽)', cols[2]),
        ],
      }),
      ...months.map((m, i) => new TableRow({
        children: [
          dataCell(m.label,   cols[0], i % 2 !== 0),
          dataCell(String(m.count), cols[1], i % 2 !== 0),
          dataCell(`${m.revenue.toLocaleString('ru-RU')} ₽`, cols[2], i % 2 !== 0),
        ],
      })),
    ],
  });
}

function buildServicesTable(services: ReportData['topServices']): Table {
  const cols = [4000, 2500, 2526];
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          headerCell('Услуга', cols[0]),
          headerCell('Использований', cols[1]),
          headerCell('Выручка (₽)', cols[2]),
        ],
      }),
      ...services.map((s, i) => new TableRow({
        children: [
          dataCell(s.serviceName,   cols[0], i % 2 !== 0),
          dataCell(String(s.usageCount),  cols[1], i % 2 !== 0),
          dataCell(`${s.totalRevenue.toLocaleString('ru-RU')} ₽`, cols[2], i % 2 !== 0),
        ],
      })),
    ],
  });
}

function buildEmployeeTable(employees: ReportData['employeeLoad']): Table {
  const cols = [3200, 2000, 1800, 2026];
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          headerCell('Сотрудник',     cols[0]),
          headerCell('Заявок',        cols[1]),
          headerCell('Выполнено',     cols[2]),
          headerCell('Выручка (₽)',   cols[3]),
        ],
      }),
      ...employees.map((e, i) => new TableRow({
        children: [
          dataCell(e.employeeName,   cols[0], i % 2 !== 0),
          dataCell(String(e.totalOrders),     cols[1], i % 2 !== 0),
          dataCell(String(e.completedOrders), cols[2], i % 2 !== 0),
          dataCell(`${e.totalRevenue.toLocaleString('ru-RU')} ₽`, cols[3], i % 2 !== 0),
        ],
      })),
    ],
  });
}

export async function exportToDocx(data: ReportData): Promise<void> {
  const doc = new Document({
    styles: {
      default: { document: { run: { font: 'Arial', size: 22 } } },
      paragraphStyles: [
        {
          id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal',
          run: { size: 36, bold: true, font: 'Arial', color: '1F4E79' },
          paragraph: { spacing: { before: 200, after: 200 }, outlineLevel: 0 },
        },
        {
          id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal',
          run: { size: 28, bold: true, font: 'Arial', color: '2E75B6' },
          paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 1 },
        },
      ],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
        },
      },
      children: [
        heading1('Отчёт по деятельности сервисного центра TechCare'),
        emptyPara(),
        para(`Период: ${data.period}`, { italic: true }),
        para(`Дата формирования: ${new Date().toLocaleDateString('ru-RU')}`, { italic: true }),
        emptyPara(),

        heading2('1. Сводные показатели'),
        buildSummaryTable(data.summary),
        emptyPara(),

        heading2('2. Динамика заявок по месяцам'),
        buildMonthTable(data.byMonth),
        emptyPara(),

        heading2('3. Наиболее востребованные услуги'),
        buildServicesTable(data.topServices),
        emptyPara(),

        heading2('4. Нагрузка по сотрудникам'),
        buildEmployeeTable(data.employeeLoad),
        emptyPara(),

        heading2('5. Распределение по типам устройств'),
        ...data.deviceTypes.map(dt =>
          para(`• ${dt.deviceType}: ${dt.count} заявок`)
        ),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const safePeriod = data.period.replace(/[^a-zA-Z0-9а-яА-Я\-\.]/g, '_');
  saveAs(blob, `TechCare_Report_${safePeriod}.docx`);
}