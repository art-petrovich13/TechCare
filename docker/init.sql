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
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
 
CREATE TABLE IF NOT EXISTS order_services (
  id         SERIAL  PRIMARY KEY,
  order_id   INTEGER NOT NULL REFERENCES orders(id)   ON DELETE CASCADE,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL DEFAULT 1
);
 
 
INSERT INTO clients (full_name, phone, email) VALUES
  ('Иванов Иван Иванович',   '+375 44 111 22 33', 'ivanov@mail.ru'),
  ('Петрова Светлана Юрьевна', '+375 29 333 44 55', 'petrova@gmail.com'),
  ('Сидоров Алексей Дмитриевич', '+375 33 777 88 99', NULL);
 
INSERT INTO employees (full_name, role, phone) VALUES
  ('Кузнецов Павел Андреевич', 'Мастер', '+375 44 001 00 01'),
  ('Морозова Ольга Сергеевна', 'Менеджер', '+375 29 002 00 02'),
  ('Лебедев Дмитрий Игоревич', 'Мастер', '+375 44 003 00 03');
 
INSERT INTO services (name, price, description) VALUES
  ('Диагностика', 500.00, 'Полная диагностика устройства'),
  ('Замена термопасты', 800.00, 'Чистка и замена термопасты процессора'),
  ('Установка ОС Windows 11', 1500.00, 'Чистая установка Windows 11'),
  ('Замена жёсткого диска/SSD', 600.00, 'Установка нового накопителя'),
  ('Ремонт материнской платы', 3000.00, 'Пайка и замена компонентов');
 
INSERT INTO devices (client_id, device_type, brand, model, serial_number) VALUES
  (1, 'Ноутбук',  'Lenovo', 'ThinkPad E14', 'SN-LEN-001'),
  (2, 'ПК',       'DNS',    'Home PC',      NULL),
  (3, 'Ноутбук',  'ASUS',   'VivoBook 15',  'SN-ASUS-007');
 
INSERT INTO orders (device_id, employee_id, description, status) VALUES
  (1, 1, 'Не включается, возможно проблема с питанием', 'in_progress'),
  (2, 2, 'Очень медленно работает, просит переустановить систему', 'new'),
  (3, 3, 'Перегрев при нагрузке', 'done');
 
INSERT INTO order_services (order_id, service_id, quantity) VALUES
  (1, 1, 1),
  (2, 3, 1), (2, 4, 1),
  (3, 1, 1), (3, 2, 1);
