-- Database Schema for HighnHeavy
-- Key Aspects: Registration, Booking, Payment, Wallets, Messages, Chats, Notifications

-- Enable UUID extension (PostgreSQL specific, but standard practice)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & AUTHENTICATION
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20), -- Added as requested
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('shipper', 'carrier', 'escort', 'admin', 'driver')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USER PROFILES (Extended details)
CREATE TABLE profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    contact_person VARCHAR(100),
    contact_number VARCHAR(20), -- Renamed from phone
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    bio TEXT,
    avatar_url TEXT,
    
    -- Carrier Specifics
    mc_number VARCHAR(50),
    dot_number VARCHAR(50),
    fleet_size INTEGER,
    
    -- Escort Specifics
    drivers_license_number VARCHAR(50),
    certification_number VARCHAR(50),
    years_experience INTEGER,
    vehicle_details TEXT,
    
    -- Shared
    service_area TEXT,
    vehicle_types JSONB,
    insurance_info JSONB,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. BOOKINGS (Loads/Shipments)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipper_id UUID NOT NULL REFERENCES users(id),
    carrier_id UUID REFERENCES users(id), -- Nullable until assigned
    escort_id UUID REFERENCES users(id), -- Nullable until assigned
    
    assigned_driver_id UUID, -- For tracking: Driver logging into the app to start trip
    
    -- Status Tracking
    status VARCHAR(50) NOT NULL DEFAULT 'pending_quote' 
        CHECK (status IN ('pending_quote', 'quoted', 'booked', 'in_transit', 'delivered', 'cancelled', 'completed')),
    
    -- Location Details (Matches Form Step 1)
    pickup_address TEXT NOT NULL,
    pickup_city VARCHAR(100) NOT NULL,
    pickup_state VARCHAR(50) NOT NULL,
    
    delivery_address TEXT NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_state VARCHAR(50) NOT NULL,
    
    -- Schedule & Requirements (Matches Form Step 3)
    shipment_date DATE NOT NULL,
    flexible_dates BOOLEAN DEFAULT FALSE,
    requires_escort BOOLEAN DEFAULT FALSE,
    special_instructions TEXT,
    
    -- Cargo Details (Matches Form Step 2)
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
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. DRIVERS
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Link to login credentials (role='driver')
    employer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Employer (Carrier OR Escort)
    
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    license_number VARCHAR(50),
    license_type VARCHAR(50) DEFAULT 'CDL-A',
    license_expiry DATE,
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'on-job', 'off-duty')),
    completed_jobs INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add Foreign Key for booking driver (circular dep resolution)
ALTER TABLE bookings ADD CONSTRAINT fk_booking_driver FOREIGN KEY (assigned_driver_id) REFERENCES drivers(id);

-- 5. VEHICLES / EQUIPMENT
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Carrier or Escort
    type VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    plate_number VARCHAR(20),
    vin VARCHAR(50),
    year VARCHAR(4),
    capacity VARCHAR(50),
    dimensions VARCHAR(100),
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'in-use', 'maintenance')),
    last_inspection DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. QUOTES / BIDS
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES users(id),
    
    amount DECIMAL(12,2) NOT NULL,
    
    -- Resource Assignment
    driver_id UUID REFERENCES drivers(id),
    vehicle_id UUID REFERENCES vehicles(id),
    
    notes TEXT,
    valid_until TIMESTAMP WITH TIME ZONE,
    
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. SHIPMENT TRACKING
CREATE TABLE shipment_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    
    -- Location & Status
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    status VARCHAR(50) NOT NULL,
    
    -- Event Details
    event_description VARCHAR(255) NOT NULL,
    progress_percentage INTEGER DEFAULT 0,
    estimated_arrival TIMESTAMP WITH TIME ZONE,
    
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id) -- Assigned Driver updating status
);

-- 8. PROVIDER PAYOUTS (Admin -> Carrier/Escort)
CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    provider_id UUID NOT NULL REFERENCES users(id), -- Receiver (Carrier/Escort)
    
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed')),
    processed_at TIMESTAMP WITH TIME ZONE,
    transaction_reference VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. WALLETS (Financial Balance)
CREATE TABLE wallets (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(12,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. WALLET TRANSACTIONS (History)
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(user_id),
    
    amount DECIMAL(12,2) NOT NULL, -- Positive for credit, negative for debit
    type VARCHAR(50) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'payment_received', 'payment_sent', 'refund', 'fee')),
    
    status VARCHAR(50) DEFAULT 'completed',
    reference_id UUID, -- Links to Invoice or Payment ID
    description VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. INVOICES
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    issuer_id UUID NOT NULL REFERENCES users(id), -- Who is asking for money (Carrier/Platform)
    payer_id UUID NOT NULL REFERENCES users(id), -- Who owes money (Shipper)
    
    amount DECIMAL(12,2) NOT NULL,
    due_date DATE NOT NULL,
    
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. PAYMENTS (Actual money movement records)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id),
    amount DECIMAL(12,2) NOT NULL,
    method VARCHAR(50) NOT NULL CHECK (method IN ('credit_card', 'bank_transfer', 'zelle', 'wallet')),
    transaction_ref VARCHAR(100), -- Stripe/PayPal/Bank Ref ID
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. MESSAGING & CHATS
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id), -- Optional: Link chat to a specific job
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversation_participants (
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_read_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    attachments JSONB, -- URLs to images/files
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. NOTIFICATIONS
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'booking_update', 'new_message', 'payment_received'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    resource_link VARCHAR(255), -- Deep link e.g., '/dashboard/bookings/123'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. REVIEWS
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    reviewer_id UUID NOT NULL REFERENCES users(id),
    subject_id UUID NOT NULL REFERENCES users(id), -- The person being reviewed
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES for Performance
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_shipper ON bookings(shipper_id);
CREATE INDEX idx_bookings_carrier ON bookings(carrier_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
