-- Database Schema for HighnHeavy (MySQL Version)
-- Key Aspects: Registration, Booking, Payment, Wallets, Messages, Chats, Notifications
-- Compatible with MySQL 8.0+

-- 1. USERS & AUTHENTICATION
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('shipper', 'carrier', 'escort', 'admin', 'driver')),
    status ENUM('active', 'disabled') DEFAULT 'active',
    email_notifications BOOLEAN DEFAULT TRUE,
    profile_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. USER PROFILES (Extended details)
CREATE TABLE profiles (
    user_id CHAR(36) PRIMARY KEY,
    company_name VARCHAR(255),
    contact_person VARCHAR(100),
    contact_number VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    bio TEXT,
    avatar_url TEXT,
    
    -- Carrier Specifics
    mc_number VARCHAR(50),
    dot_number VARCHAR(50),
    fleet_size INT,
    
    -- Escort Specifics
    drivers_license_number VARCHAR(50),
    certification_number VARCHAR(50),
    years_experience INT,
    vehicle_details TEXT,
    
    -- Shared
    service_area TEXT,
    vehicle_types JSON,
    insurance_info JSON,
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. BOOKINGS (Loads/Shipments)
CREATE TABLE bookings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    shipper_id CHAR(36) NOT NULL,
    carrier_id CHAR(36),
    escort_id CHAR(36),
    
    assigned_driver_id CHAR(36),
    
    -- Status Tracking
    status VARCHAR(50) NOT NULL DEFAULT 'pending_quote' 
        CHECK (status IN ('pending_quote', 'quoted', 'booked', 'in_transit', 'delivered', 'cancelled', 'completed')),
    
    -- Location Details
    pickup_address TEXT NOT NULL,
    pickup_city VARCHAR(100) NOT NULL,
    pickup_state VARCHAR(50) NOT NULL,
    
    delivery_address TEXT NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_state VARCHAR(50) NOT NULL,
    
    -- Schedule & Requirements
    shipment_date DATE NOT NULL,
    flexible_dates BOOLEAN DEFAULT FALSE,
    requires_escort BOOLEAN DEFAULT FALSE,
    special_instructions TEXT,
    
    -- Cargo Details
    cargo_type VARCHAR(100) NOT NULL,
    cargo_description TEXT NOT NULL,
    dimensions_length_ft DECIMAL(10,2) NOT NULL,
    dimensions_width_ft DECIMAL(10,2) NOT NULL,
    dimensions_height_ft DECIMAL(10,2) NOT NULL,
    weight_lbs DECIMAL(10,2) NOT NULL,
    
    -- Internal / Calculated Fields
    delivery_date_est DATE,
    agreed_price DECIMAL(12,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (shipper_id) REFERENCES users(id),
    FOREIGN KEY (carrier_id) REFERENCES users(id),
    FOREIGN KEY (escort_id) REFERENCES users(id)
);

-- 4. DRIVERS
CREATE TABLE drivers (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36),
    employer_id CHAR(36) NOT NULL,
    
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    license_number VARCHAR(50),
    license_type VARCHAR(50) DEFAULT 'CDL-A',
    license_expiry DATE,
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'on-job', 'off-duty')),
    completed_jobs INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add Foreign Key for booking driver
ALTER TABLE bookings ADD CONSTRAINT fk_booking_driver FOREIGN KEY (assigned_driver_id) REFERENCES drivers(id);

-- 5. VEHICLES / EQUIPMENT
CREATE TABLE vehicles (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    owner_id CHAR(36) NOT NULL,
    type VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    plate_number VARCHAR(20),
    vin VARCHAR(50),
    year VARCHAR(4),
    capacity VARCHAR(50),
    dimensions VARCHAR(100),
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'in-use', 'maintenance')),
    last_inspection DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. QUOTES / BIDS
CREATE TABLE quotes (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_id CHAR(36) NOT NULL,
    provider_id CHAR(36) NOT NULL,
    
    amount DECIMAL(12,2) NOT NULL,
    
    -- Resource Assignment
    driver_id CHAR(36),
    vehicle_id CHAR(36),
    
    notes TEXT,
    valid_until TIMESTAMP,
    
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES users(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- 7. SHIPMENT TRACKING
CREATE TABLE shipment_tracking (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_id CHAR(36) NOT NULL,
    
    -- Location & Status
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    status VARCHAR(50) NOT NULL,
    
    -- Event Details
    event_description VARCHAR(255) NOT NULL,
    progress_percentage INT DEFAULT 0,
    estimated_arrival TIMESTAMP,
    
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by CHAR(36),
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 8. PROVIDER PAYOUTS (Admin -> Carrier/Escort)
CREATE TABLE payouts (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_id CHAR(36),
    provider_id CHAR(36) NOT NULL,
    
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed')),
    processed_at TIMESTAMP,
    transaction_reference VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (provider_id) REFERENCES users(id)
);

-- 9. WALLETS (Financial Balance)
CREATE TABLE wallets (
    user_id CHAR(36) PRIMARY KEY,
    balance DECIMAL(12,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. WALLET TRANSACTIONS (History)
CREATE TABLE wallet_transactions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    wallet_id CHAR(36) NOT NULL,
    
    amount DECIMAL(12,2) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'payment_received', 'payment_sent', 'refund', 'fee')),
    
    status VARCHAR(50) DEFAULT 'completed',
    reference_id CHAR(36),
    description VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (wallet_id) REFERENCES wallets(user_id)
);

-- 11. INVOICES
CREATE TABLE invoices (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_id CHAR(36) NOT NULL,
    issuer_id CHAR(36) NOT NULL,
    payer_id CHAR(36) NOT NULL,
    
    amount DECIMAL(12,2) NOT NULL,
    due_date DATE NOT NULL,
    
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (issuer_id) REFERENCES users(id),
    FOREIGN KEY (payer_id) REFERENCES users(id)
);

-- 12. PAYMENTS (Actual money movement records)
CREATE TABLE payments (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    invoice_id CHAR(36),
    amount DECIMAL(12,2) NOT NULL,
    method VARCHAR(50) NOT NULL CHECK (method IN ('credit_card', 'bank_transfer', 'zelle', 'wallet')),
    transaction_ref VARCHAR(100),
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

-- 13. MESSAGING & CHATS
CREATE TABLE conversations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

CREATE TABLE conversation_participants (
    conversation_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    last_read_at TIMESTAMP,
    PRIMARY KEY (conversation_id, user_id),
    
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE messages (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    conversation_id CHAR(36) NOT NULL,
    sender_id CHAR(36) NOT NULL,
    content TEXT NOT NULL,
    attachments JSON,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- 14. NOTIFICATIONS
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    resource_link VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 15. REVIEWS
CREATE TABLE reviews (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_id CHAR(36) NOT NULL,
    reviewer_id CHAR(36) NOT NULL,
    subject_id CHAR(36) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (reviewer_id) REFERENCES users(id),
    FOREIGN KEY (subject_id) REFERENCES users(id)
);

-- INDEXES for Performance
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_shipper ON bookings(shipper_id);
CREATE INDEX idx_bookings_carrier ON bookings(carrier_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
