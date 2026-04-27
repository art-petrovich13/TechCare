CREATE TABLE IF NOT EXISTS clients (
  id         SERIAL PRIMARY KEY,
  full_name  VARCHAR(200) NOT NULL,
  phone      VARCHAR(20)  NOT NULL,
  email      VARCHAR(150) UNIQUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees (
  id         SERIAL PRIMARY KEY,
  full_name  VARCHAR(200) NOT NULL,
  role       VARCHAR(100) NOT NULL,
  phone      VARCHAR(20),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS devices (
  id            SERIAL PRIMARY KEY,
  client_id     INTEGER      NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  device_type   VARCHAR(100) NOT NULL,
  brand         VARCHAR(100) NOT NULL,
  model         VARCHAR(150) NOT NULL,
  serial_number VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS services (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(200)   NOT NULL,
  price       DECIMAL(10,2)  NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  id          SERIAL PRIMARY KEY,
  device_id   INTEGER     NOT NULL REFERENCES devices(id)   ON DELETE CASCADE,
  employee_id INTEGER     REFERENCES employees(id) ON DELETE SET NULL,
  description TEXT        NOT NULL,
  status      VARCHAR(50) NOT NULL DEFAULT 'new',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_price DECIMAL(10,2) DEFAULT 0,
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS order_services (
  id         SERIAL  PRIMARY KEY,
  order_id   INTEGER NOT NULL REFERENCES orders(id)   ON DELETE CASCADE,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL DEFAULT 1
);

INSERT INTO clients (full_name, phone, email) VALUES
  ('Иванов Иван Иванович',         '+375 44 111 22 33', 'ivanov@mail.ru'),
  ('Петрова Светлана Юрьевна',     '+375 29 333 44 55', 'petrova@gmail.com'),
  ('Сидоров Алексей Дмитриевич',   '+375 33 777 88 99', NULL),
  ('Козлова Екатерина Андреевна',  '+375 44 555 66 77', 'kozlova@tut.by'),
  ('Морозов Игорь Петрович',       '+375 29 888 99 00', 'morozov@mail.ru'),
  ('Лебедева Анна Сергеевна',      '+375 33 123 45 67', 'lebedev@yandex.ru'),
  ('Соколов Дмитрий Владимирович', '+375 44 987 65 43', 'sokolov@gmail.com'),
  ('Новикова Ольга Викторовна',    '+375 29 456 78 90', 'novikova@mail.ru'),
  ('Федоров Алексей Викторович',   '+375 33 555 44 33', 'fedorov@tut.by'),
  ('Васильева Татьяна Николаевна', '+375 44 777 88 99', 'vasilieva@yandex.ru');

INSERT INTO employees (full_name, role, phone) VALUES
  ('Кузнецов Павел Андреевич',    'Мастер',    '+375 44 001 00 01'),
  ('Морозова Ольга Сергеевна',    'Менеджер',  '+375 29 002 00 02'),
  ('Лебедев Дмитрий Игоревич',    'Мастер',    '+375 44 003 00 03'),
  ('Смирнова Елена Александровна', 'Мастер',    '+375 44 004 00 04'),
  ('Попов Алексей Петрович',      'Мастер',    '+375 29 005 00 05'),
  ('Воробьев Сергей Иванович',    'Менеджер',  '+375 33 006 00 06'),
  ('Зайцева Марина Владимировна', 'Мастер',    '+375 44 007 00 07'),
  ('Ковалев Николай Дмитриевич',  'Мастер',    '+375 29 008 00 08'),
  ('Петров Андрей Сергеевич',     'Менеджер',  '+375 33 009 00 09'),
  ('Михайлова Оксана Викторовна', 'Мастер',    '+375 44 010 00 10');

INSERT INTO services (name, price, description) VALUES
  ('Диагностика',            500.00, 'Полная диагностика устройства'),
  ('Замена термопасты',      800.00, 'Чистка и замена термопасты процессора'),
  ('Установка ОС Windows 11',1500.00,'Чистая установка Windows 11'),
  ('Замена жёсткого диска/SSD',600.00,'Установка нового накопителя'),
  ('Ремонт материнской платы',3000.00,'Пайка и замена компонентов'),
  ('Замена аккумулятора',    1200.00,'Замена АКБ на новую'),
  ('Чистка от пыли',          700.00,'Профилактическая чистка внутренних компонентов'),
  ('Восстановление данных',  2500.00,'Восстановление информации с повреждённого носителя'),
  ('Установка антивируса',    400.00,'Установка и настройка антивирусного ПО'),
  ('Замена экрана',          2000.00,'Замена разбитой или неисправной матрицы');

INSERT INTO devices (client_id, device_type, brand, model, serial_number) VALUES
  (1, 'Ноутбук',    'Lenovo', 'ThinkPad E14',    'SN-LEN-001'),
  (2, 'ПК',         'DNS',    'Home PC',         NULL),
  (3, 'Ноутбук',    'ASUS',   'VivoBook 15',     'SN-ASUS-007'),
  (4, 'Смартфон',   'Apple',  'iPhone 12',       'SN-APP-001'),
  (5, 'Ноутбук',    'HP',     'Pavilion 15',     'SN-HP-002'),
  (6, 'Планшет',    'Samsung','Galaxy Tab S7',   'SN-SAM-003'),
  (7, 'Смартфон',   'Xiaomi', 'Mi 11',           'SN-XIA-004'),
  (8, 'Ноутбук',    'Dell',   'XPS 13',          'SN-DEL-005'),
  (9, 'ПК',         'HP',     'ProDesk 400',     'SN-HP-006'),
  (10,'Смартфон',   'Google', 'Pixel 5',         'SN-GOO-007');

INSERT INTO orders (device_id, employee_id, description, status) VALUES
  (1, 1, 'Не включается, возможно проблема с питанием',          'in_progress'),
  (2, 2, 'Очень медленно работает, просит переустановить систему','new'),
  (3, 3, 'Перегрев при нагрузке',                               'done'),
  (4, 4, 'Не заряжается, вероятно проблема с аккумулятором',    'new'),
  (5, 5, 'Шумит кулер, требуется чистка',                       'in_progress'),
  (6, 6, 'Не включается экран, после падения',                  'new'),
  (7, 7, 'Зависает, нужно переустановить ОС',                   'done'),
  (8, 8, 'Разбит экран, требуется замена',                      'in_progress'),
  (9, 9, 'Ошибка при загрузке Windows',                         'new'),
  (10,10,'Самопроизвольно выключается',                         'done');

INSERT INTO order_services (order_id, service_id, quantity) VALUES
  -- заказ 1
  (1, 1, 1),
  -- заказ 2
  (2, 3, 1), (2, 4, 1),
  -- заказ 3
  (3, 1, 1), (3, 2, 1),
  -- новые связи для заказов 4..10
  (4, 6, 1),   -- замена аккумулятора
  (5, 7, 1),   -- чистка от пыли
  (6, 10, 1),  -- замена экрана
  (7, 3, 1),   -- установка ОС
  (8, 1, 1),   -- диагностика
  (9, 3, 1),   -- установка ОС
  (10, 5, 1);  -- ремонт материнской платы

UPDATE orders SET completed_at = updated_at WHERE status = 'done';