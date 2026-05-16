-- ============================================================
--  CANCHAS APP — Script de creación de base de datos
--  Motor: MySQL 8.0+
--  Cómo usar: pegar en phpMyAdmin > pestaña SQL > Ejecutar
-- ============================================================

CREATE DATABASE IF NOT EXISTS canchas_app
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE canchas_app;

-- ------------------------------------------------------------
-- 1. SPORTS — catálogo de deportes
-- ------------------------------------------------------------
CREATE TABLE sports (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(80)  NOT NULL,
  icon_url    VARCHAR(255),
  min_players TINYINT UNSIGNED DEFAULT 1,
  max_players TINYINT UNSIGNED DEFAULT 22,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE KEY uq_sport_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Deportes iniciales
INSERT INTO sports (name, min_players, max_players) VALUES
  ('Fútbol 11',          10, 22),
  ('Fútbol 8',            8, 16),
  ('Fútbol sala',         4, 10),
  ('Pádel',               2,  4),
  ('Tenis',               1,  4),
  ('Baloncesto',          5, 10),
  ('Voleibol',            4, 12),
  ('Tejo',                2,  8),
  ('Natación',            1, 50),
  ('Patinaje',            1, 50);

-- ------------------------------------------------------------
-- 2. USERS — jugadores, dueños y admins
-- ------------------------------------------------------------
CREATE TABLE users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL,
  phone         VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('player','owner','admin') NOT NULL DEFAULT 'player',
  avatar_url    VARCHAR(255),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. SESSIONS — tokens JWT activos
-- ------------------------------------------------------------
CREATE TABLE sessions (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  token      VARCHAR(512) NOT NULL,
  device     VARCHAR(100),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_session_token (token),
  CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. VENUES — centros deportivos
-- ------------------------------------------------------------
CREATE TABLE venues (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_id    INT UNSIGNED NOT NULL,
  name        VARCHAR(150) NOT NULL,
  description TEXT,
  address     VARCHAR(255) NOT NULL,
  city        VARCHAR(100) NOT NULL,
  lat         DECIMAL(10,7),
  lng         DECIMAL(10,7),
  phone       VARCHAR(20),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_venue_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_venue_city (city),
  INDEX idx_venue_owner (owner_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. COURTS — canchas individuales dentro de un venue
-- ------------------------------------------------------------
CREATE TABLE courts (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  venue_id    INT UNSIGNED NOT NULL,
  sport_id    INT UNSIGNED NOT NULL,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  surface     VARCHAR(50)  COMMENT 'cesped, sintetico, cemento, madera, agua, pista',
  is_indoor   BOOLEAN NOT NULL DEFAULT FALSE,
  base_price  DECIMAL(10,2) NOT NULL COMMENT 'Precio base por hora en COP',
  capacity    TINYINT UNSIGNED,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_court_venue FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE,
  CONSTRAINT fk_court_sport FOREIGN KEY (sport_id) REFERENCES sports(id) ON DELETE RESTRICT,
  INDEX idx_court_venue  (venue_id),
  INDEX idx_court_sport  (sport_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6. COURT_PHOTOS — galería de fotos de cada cancha
-- ------------------------------------------------------------
CREATE TABLE court_photos (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  court_id    INT UNSIGNED NOT NULL,
  url         VARCHAR(255) NOT NULL COMMENT 'URL de Firebase Storage',
  is_cover    BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Foto principal de la cancha',
  sort_order  TINYINT UNSIGNED NOT NULL DEFAULT 0,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_photo_court FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE,
  INDEX idx_photo_court (court_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 7. AMENITIES — servicios del centro (baños, parqueadero, etc.)
-- ------------------------------------------------------------
CREATE TABLE amenities (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  court_id    INT UNSIGNED NOT NULL,
  type        ENUM('parking','bathrooms','lockers','lighting','wifi','showers','cafeteria','seating') NOT NULL,
  description VARCHAR(200),
  CONSTRAINT fk_amenity_court FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE,
  INDEX idx_amenity_court (court_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 8. EQUIPMENT — equipamiento disponible (petos, conos, etc.)
-- ------------------------------------------------------------
CREATE TABLE equipment (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  court_id     INT UNSIGNED NOT NULL,
  name         VARCHAR(100) NOT NULL COMMENT 'Petos, conos, balones, raquetas...',
  quantity     SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  is_included  BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Incluido en el precio o con costo extra',
  extra_cost   DECIMAL(8,2) DEFAULT 0 COMMENT 'Costo adicional en COP si no está incluido',
  CONSTRAINT fk_equipment_court FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE,
  INDEX idx_equipment_court (court_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 9. SCHEDULES — horarios de apertura por día de la semana
-- ------------------------------------------------------------
CREATE TABLE schedules (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  court_id      INT UNSIGNED NOT NULL,
  day_of_week   TINYINT UNSIGNED NOT NULL COMMENT '0=Domingo, 1=Lunes, ..., 6=Sabado',
  open_time     TIME NOT NULL,
  close_time    TIME NOT NULL,
  slot_duration INT UNSIGNED NOT NULL DEFAULT 60 COMMENT 'Duración de cada bloque en minutos',
  is_open       BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT fk_schedule_court FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE,
  UNIQUE KEY uq_schedule_day (court_id, day_of_week),
  INDEX idx_schedule_court (court_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 10. PRICE_RULES — precios dinámicos por franja horaria / día
-- ------------------------------------------------------------
CREATE TABLE price_rules (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  court_id    INT UNSIGNED NOT NULL,
  day_of_week TINYINT UNSIGNED COMMENT 'NULL = aplica todos los días',
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  price       DECIMAL(10,2) NOT NULL COMMENT 'Precio COP por hora en esta franja',
  label       VARCHAR(50) COMMENT 'Ej: Hora pico, Nocturno, Fin de semana',
  CONSTRAINT fk_price_court FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE,
  INDEX idx_price_court (court_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 11. BOOKINGS — reservas (corazón del sistema)
-- ------------------------------------------------------------
CREATE TABLE bookings (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  court_id         INT UNSIGNED NOT NULL,
  user_id          INT UNSIGNED NOT NULL,
  booking_date     DATE NOT NULL,
  start_time       TIME NOT NULL,
  end_time         TIME NOT NULL,
  total_price      DECIMAL(10,2) NOT NULL COMMENT 'Total cobrado al usuario',
  platform_fee     DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT 'Comisión de la app',
  status           ENUM(
                     'pending',
                     'confirmed',
                     'cancelled_user',
                     'cancelled_owner',
                     'completed',
                     'expired'
                   ) NOT NULL DEFAULT 'pending',
  cancelled_reason TEXT,
  notes            TEXT COMMENT 'Notas adicionales del usuario',
  expires_at       TIMESTAMP COMMENT 'Límite para completar el pago',
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  confirmed_at     TIMESTAMP NULL,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_booking_court FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE RESTRICT,
  CONSTRAINT fk_booking_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE RESTRICT,
  -- *** Clave anti-colisión: impide dos reservas en la misma cancha, fecha y hora ***
  UNIQUE KEY uq_booking_slot (court_id, booking_date, start_time),
  INDEX idx_booking_user   (user_id),
  INDEX idx_booking_court  (court_id),
  INDEX idx_booking_date   (booking_date),
  INDEX idx_booking_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 12. PAYMENTS — transacciones con Wompi / PSE
-- ------------------------------------------------------------
CREATE TABLE payments (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id   INT UNSIGNED NOT NULL,
  wompi_ref    VARCHAR(100) COMMENT 'Referencia única de Wompi',
  amount       DECIMAL(10,2) NOT NULL,
  method       ENUM('PSE','card','nequi','cash') NOT NULL DEFAULT 'PSE',
  bank_name    VARCHAR(100) COMMENT 'Banco seleccionado en PSE',
  status       ENUM('pending','approved','declined','voided') NOT NULL DEFAULT 'pending',
  webhook_data JSON COMMENT 'Respuesta cruda del webhook de Wompi',
  paid_at      TIMESTAMP NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE RESTRICT,
  UNIQUE KEY uq_wompi_ref (wompi_ref),
  INDEX idx_payment_booking (booking_id),
  INDEX idx_payment_status  (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 13. REVIEWS — reseñas (máx. 1 por reserva completada)
-- ------------------------------------------------------------
CREATE TABLE reviews (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id   INT UNSIGNED NOT NULL,
  court_id     INT UNSIGNED NOT NULL,
  user_id      INT UNSIGNED NOT NULL,
  rating       TINYINT UNSIGNED NOT NULL COMMENT '1 a 5 estrellas',
  comment      TEXT,
  owner_reply  TEXT COMMENT 'Respuesta del dueño de la cancha',
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_review_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_court   FOREIGN KEY (court_id)   REFERENCES courts(id)   ON DELETE CASCADE,
  CONSTRAINT fk_review_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5),
  -- Garantiza máximo 1 reseña por reserva
  UNIQUE KEY uq_review_booking (booking_id),
  INDEX idx_review_court (court_id),
  INDEX idx_review_user  (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 14. NOTIFICATIONS — historial de notificaciones push
-- ------------------------------------------------------------
CREATE TABLE notifications (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  booking_id INT UNSIGNED,
  type       ENUM('confirmation','reminder','cancellation','new_booking','review_request') NOT NULL,
  title      VARCHAR(150) NOT NULL,
  body       TEXT NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  sent_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notif_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  CONSTRAINT fk_notif_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
  INDEX idx_notif_user    (user_id),
  INDEX idx_notif_booking (booking_id),
  INDEX idx_notif_read    (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  FIN DEL SCRIPT
--  Tablas creadas: sports, users, sessions, venues, courts,
--  court_photos, amenities, equipment, schedules, price_rules,
--  bookings, payments, reviews, notifications
-- ============================================================
