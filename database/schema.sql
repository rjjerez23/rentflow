-- DriveFlow database schema
-- Compatible with MariaDB.
-- This script creates the database and all required tables without inserting test data.

CREATE DATABASE IF NOT EXISTS driveflow_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE driveflow_db;

-- System roles used to authorize application users.
CREATE TABLE IF NOT EXISTS roles (
  role_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_roles_name UNIQUE (name)
) ENGINE=InnoDB COMMENT='Application role catalog.';

-- Application users. Customer records are stored separately in customers.
CREATE TABLE IF NOT EXISTS users (
  user_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_id INT UNSIGNED NOT NULL,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(25) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_users_email UNIQUE (email),
  INDEX idx_users_role_id (role_id),
  INDEX idx_users_name (last_name, first_name),
  CONSTRAINT fk_users_role
    FOREIGN KEY (role_id) REFERENCES roles (role_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_users_is_active CHECK (is_active IN (0, 1))
) ENGINE=InnoDB COMMENT='Internal users who operate the system.';

-- Customers who rent vehicles.
CREATE TABLE IF NOT EXISTS customers (
  customer_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  document_number VARCHAR(50) NOT NULL,
  driver_license_number VARCHAR(50) NOT NULL,
  driver_license_expiration_date DATE NOT NULL,
  date_of_birth DATE NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(25) NOT NULL,
  address VARCHAR(255) NULL,
  emergency_contact_name VARCHAR(160) NULL,
  emergency_contact_phone VARCHAR(25) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_customers_document_number UNIQUE (document_number),
  CONSTRAINT uq_customers_driver_license_number UNIQUE (driver_license_number),
  CONSTRAINT uq_customers_email UNIQUE (email),
  INDEX idx_customers_name (last_name, first_name),
  INDEX idx_customers_phone (phone),
  CONSTRAINT chk_customers_is_active CHECK (is_active IN (0, 1))
) ENGINE=InnoDB COMMENT='Customer master data.';

-- Vehicle manufacturer catalog.
CREATE TABLE IF NOT EXISTS brands (
  brand_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_brands_name UNIQUE (name)
) ENGINE=InnoDB COMMENT='Vehicle brand catalog.';

-- Vehicle model catalog. Each model belongs to exactly one brand.
CREATE TABLE IF NOT EXISTS vehicle_models (
  model_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  brand_id INT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_vehicle_models_brand_name UNIQUE (brand_id, name),
  CONSTRAINT fk_vehicle_models_brand
    FOREIGN KEY (brand_id) REFERENCES brands (brand_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT='Vehicle model catalog normalized by brand.';

-- Vehicle category catalog, such as compact, SUV, pickup, or luxury.
CREATE TABLE IF NOT EXISTS categories (
  category_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  description VARCHAR(255) NULL,
  default_daily_rate DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_categories_name UNIQUE (name),
  CONSTRAINT chk_categories_default_daily_rate CHECK (default_daily_rate >= 0)
) ENGINE=InnoDB COMMENT='Vehicle category catalog.';

-- Fuel type catalog.
CREATE TABLE IF NOT EXISTS fuel_types (
  fuel_type_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_fuel_types_name UNIQUE (name)
) ENGINE=InnoDB COMMENT='Fuel type catalog.';

-- Transmission catalog. Expected values include Automatic and Manual.
CREATE TABLE IF NOT EXISTS transmissions (
  transmission_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_transmissions_name UNIQUE (name)
) ENGINE=InnoDB COMMENT='Vehicle transmission catalog.';

-- Vehicle availability and operational status catalog.
CREATE TABLE IF NOT EXISTS vehicle_status (
  vehicle_status_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_vehicle_status_name UNIQUE (name)
) ENGINE=InnoDB COMMENT='Vehicle status catalog.';

-- Reservation status catalog.
CREATE TABLE IF NOT EXISTS reservation_status (
  reservation_status_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_reservation_status_name UNIQUE (name)
) ENGINE=InnoDB COMMENT='Reservation workflow status catalog.';

-- Rental status catalog.
CREATE TABLE IF NOT EXISTS rental_status (
  rental_status_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_rental_status_name UNIQUE (name)
) ENGINE=InnoDB COMMENT='Rental workflow status catalog.';

-- Maintenance status catalog.
CREATE TABLE IF NOT EXISTS maintenance_status (
  maintenance_status_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_maintenance_status_name UNIQUE (name)
) ENGINE=InnoDB COMMENT='Maintenance workflow status catalog.';

-- Vehicle inventory.
CREATE TABLE IF NOT EXISTS vehicles (
  vehicle_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  model_id INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  fuel_type_id INT UNSIGNED NOT NULL,
  transmission_id INT UNSIGNED NOT NULL,
  vehicle_status_id INT UNSIGNED NOT NULL,
  model_year SMALLINT UNSIGNED NOT NULL,
  color VARCHAR(50) NULL,
  plate_number VARCHAR(20) NOT NULL,
  vin VARCHAR(50) NULL,
  mileage INT UNSIGNED NOT NULL DEFAULT 0,
  passenger_capacity TINYINT UNSIGNED NOT NULL,
  door_count TINYINT UNSIGNED NOT NULL,
  air_conditioning TINYINT(1) NOT NULL DEFAULT 1,
  engine VARCHAR(100) NULL,
  daily_rate DECIMAL(10, 2) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_vehicles_plate_number UNIQUE (plate_number),
  CONSTRAINT uq_vehicles_vin UNIQUE (vin),
  INDEX idx_vehicles_model_id (model_id),
  INDEX idx_vehicles_category_id (category_id),
  INDEX idx_vehicles_fuel_type_id (fuel_type_id),
  INDEX idx_vehicles_transmission_id (transmission_id),
  INDEX idx_vehicles_status_id (vehicle_status_id),
  CONSTRAINT fk_vehicles_model
    FOREIGN KEY (model_id) REFERENCES vehicle_models (model_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_vehicles_category
    FOREIGN KEY (category_id) REFERENCES categories (category_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_vehicles_fuel_type
    FOREIGN KEY (fuel_type_id) REFERENCES fuel_types (fuel_type_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_vehicles_transmission
    FOREIGN KEY (transmission_id) REFERENCES transmissions (transmission_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_vehicles_status
    FOREIGN KEY (vehicle_status_id) REFERENCES vehicle_status (vehicle_status_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_vehicles_model_year CHECK (model_year >= 1900),
  CONSTRAINT chk_vehicles_passenger_capacity CHECK (passenger_capacity > 0),
  CONSTRAINT chk_vehicles_door_count CHECK (door_count > 0),
  CONSTRAINT chk_vehicles_air_conditioning CHECK (air_conditioning IN (0, 1)),
  CONSTRAINT chk_vehicles_daily_rate CHECK (daily_rate >= 0),
  CONSTRAINT chk_vehicles_is_active CHECK (is_active IN (0, 1))
) ENGINE=InnoDB COMMENT='Vehicle inventory available for reservations and rentals.';

-- Vehicle image gallery. A vehicle can have multiple images.
CREATE TABLE IF NOT EXISTS vehicle_images (
  image_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  vehicle_id BIGINT UNSIGNED NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  is_primary TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_vehicle_images_vehicle_primary (vehicle_id, is_primary),
  CONSTRAINT fk_vehicle_images_vehicle
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (vehicle_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_vehicle_images_is_primary CHECK (is_primary IN (0, 1))
) ENGINE=InnoDB COMMENT='Vehicle images associated with inventory records.';

-- Vehicle maintenance history. This does not replace the operational vehicle status catalog.
CREATE TABLE IF NOT EXISTS maintenance (
  maintenance_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  vehicle_id BIGINT UNSIGNED NOT NULL,
  maintenance_status_id INT UNSIGNED NOT NULL,
  performed_at DATETIME NOT NULL,
  description TEXT NOT NULL,
  cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  performed_by VARCHAR(150) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_maintenance_vehicle_date (vehicle_id, performed_at),
  INDEX idx_maintenance_status_id (maintenance_status_id),
  CONSTRAINT fk_maintenance_vehicle
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (vehicle_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_maintenance_status
    FOREIGN KEY (maintenance_status_id) REFERENCES maintenance_status (maintenance_status_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_maintenance_cost CHECK (cost >= 0)
) ENGINE=InnoDB COMMENT='Vehicle maintenance history.';

-- Reservation records. A reservation links one customer with one vehicle for a date range.
CREATE TABLE IF NOT EXISTS reservations (
  reservation_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id BIGINT UNSIGNED NOT NULL,
  vehicle_id BIGINT UNSIGNED NOT NULL,
  created_by_user_id BIGINT UNSIGNED NOT NULL,
  reservation_status_id INT UNSIGNED NOT NULL,
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NOT NULL,
  estimated_total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  notes VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_reservations_customer_id (customer_id),
  INDEX idx_reservations_vehicle_id (vehicle_id),
  INDEX idx_reservations_created_by_user_id (created_by_user_id),
  INDEX idx_reservations_status_id (reservation_status_id),
  INDEX idx_reservations_date_range (start_datetime, end_datetime),
  CONSTRAINT fk_reservations_customer
    FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_reservations_vehicle
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (vehicle_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_reservations_created_by_user
    FOREIGN KEY (created_by_user_id) REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_reservations_status
    FOREIGN KEY (reservation_status_id) REFERENCES reservation_status (reservation_status_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_reservations_date_range CHECK (end_datetime > start_datetime),
  CONSTRAINT chk_reservations_estimated_total CHECK (estimated_total >= 0)
) ENGINE=InnoDB COMMENT='Vehicle reservations before the rental contract is opened.';

-- Rental contracts generated from reservations.
CREATE TABLE IF NOT EXISTS rentals (
  rental_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reservation_id BIGINT UNSIGNED NOT NULL,
  opened_by_user_id BIGINT UNSIGNED NOT NULL,
  rental_status_id INT UNSIGNED NOT NULL,
  start_datetime DATETIME NOT NULL,
  expected_return_datetime DATETIME NOT NULL,
  pickup_mileage INT UNSIGNED NOT NULL,
  daily_rate DECIMAL(10, 2) NOT NULL,
  deposit_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  notes VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_rentals_reservation_id UNIQUE (reservation_id),
  INDEX idx_rentals_opened_by_user_id (opened_by_user_id),
  INDEX idx_rentals_status_id (rental_status_id),
  INDEX idx_rentals_date_range (start_datetime, expected_return_datetime),
  CONSTRAINT fk_rentals_reservation
    FOREIGN KEY (reservation_id) REFERENCES reservations (reservation_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_rentals_opened_by_user
    FOREIGN KEY (opened_by_user_id) REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_rentals_status
    FOREIGN KEY (rental_status_id) REFERENCES rental_status (rental_status_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_rentals_date_range CHECK (expected_return_datetime > start_datetime),
  CONSTRAINT chk_rentals_daily_rate CHECK (daily_rate >= 0),
  CONSTRAINT chk_rentals_deposit_amount CHECK (deposit_amount >= 0)
) ENGINE=InnoDB COMMENT='Rental contract data created from a reservation.';

-- Vehicle return records. One rental can have only one return.
CREATE TABLE IF NOT EXISTS `returns` (
  return_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  rental_id BIGINT UNSIGNED NOT NULL,
  processed_by_user_id BIGINT UNSIGNED NOT NULL,
  return_datetime DATETIME NOT NULL,
  return_mileage INT UNSIGNED NOT NULL,
  fuel_level_percent DECIMAL(5, 2) NOT NULL,
  late_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  damage_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  fuel_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  cleaning_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  total_charged DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  damage_description TEXT NULL,
  notes VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_returns_rental_id UNIQUE (rental_id),
  INDEX idx_returns_processed_by_user_id (processed_by_user_id),
  INDEX idx_returns_return_datetime (return_datetime),
  CONSTRAINT fk_returns_rental
    FOREIGN KEY (rental_id) REFERENCES rentals (rental_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_returns_processed_by_user
    FOREIGN KEY (processed_by_user_id) REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_returns_fuel_level_percent CHECK (fuel_level_percent BETWEEN 0 AND 100),
  CONSTRAINT chk_returns_late_fee CHECK (late_fee >= 0),
  CONSTRAINT chk_returns_damage_fee CHECK (damage_fee >= 0),
  CONSTRAINT chk_returns_fuel_fee CHECK (fuel_fee >= 0),
  CONSTRAINT chk_returns_cleaning_fee CHECK (cleaning_fee >= 0),
  CONSTRAINT chk_returns_total_charged CHECK (total_charged >= 0)
) ENGINE=InnoDB COMMENT='Return inspection and final charges for a rental.';
