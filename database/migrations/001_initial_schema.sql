-- ==================================================
-- AGRINOVA Migration v1.0
-- Initial Database Schema Migration
-- ==================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. DISTRICTS TABLE
CREATE TABLE districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state VARCHAR(50) NOT NULL DEFAULT 'Maharashtra',
    district_name VARCHAR(100) NOT NULL UNIQUE,
    district_code VARCHAR(10) NOT NULL UNIQUE,
    latitude NUMERIC(9,6) NOT NULL,
    longitude NUMERIC(9,6) NOT NULL
);

-- 2. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    profile_photo VARCHAR(500),
    role VARCHAR(20) NOT NULL CHECK (role IN ('FARMER', 'BUYER', 'TRANSPORTER', 'ADMIN')),
    preferred_language VARCHAR(5) NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi', 'mr')),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TRIGGER trigger_update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. FARMERS TABLE
CREATE TABLE farmers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    state VARCHAR(50) NOT NULL DEFAULT 'Maharashtra',
    district_id UUID NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    taluka VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    farm_size NUMERIC(10,2) NOT NULL CHECK (farm_size > 0),
    farm_size_unit VARCHAR(10) NOT NULL CHECK (farm_size_unit IN ('Acre', 'Hectare')),
    primary_crop VARCHAR(100),
    verification_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    latitude NUMERIC(9,6) NOT NULL,
    longitude NUMERIC(9,6) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_update_farmers_timestamp
BEFORE UPDATE ON farmers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. BUYERS TABLE
CREATE TABLE buyers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(150) NOT NULL,
    business_type VARCHAR(50) NOT NULL CHECK (business_type IN ('TRADER', 'RETAILER', 'RESTAURANT', 'HOTEL', 'FOOD_PROCESSOR', 'EXPORTER', 'WHOLESALER', 'OTHER')),
    state VARCHAR(50) NOT NULL DEFAULT 'Maharashtra',
    district_id UUID NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    taluka VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    business_address TEXT NOT NULL,
    verification_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    latitude NUMERIC(9,6) NOT NULL,
    longitude NUMERIC(9,6) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_update_buyers_timestamp
BEFORE UPDATE ON buyers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. TRANSPORTERS TABLE
CREATE TABLE transporters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    vehicle_type VARCHAR(50) NOT NULL CHECK (vehicle_type IN ('MINI_TRUCK', 'PICKUP', 'TRUCK', 'TEMPO', 'OTHER')),
    vehicle_number VARCHAR(20) NOT NULL UNIQUE,
    vehicle_capacity NUMERIC(10,2) NOT NULL CHECK (vehicle_capacity > 0),
    capacity_unit VARCHAR(10) NOT NULL CHECK (capacity_unit IN ('Kg', 'Quintal', 'Ton')),
    license_number VARCHAR(50) NOT NULL UNIQUE,
    verification_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    rating NUMERIC(3,2) NOT NULL DEFAULT 5.0 CHECK (rating >= 1.0 AND rating <= 5.0),
    total_completed_deliveries INT NOT NULL DEFAULT 0 CHECK (total_completed_deliveries >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_update_transporters_timestamp
BEFORE UPDATE ON transporters
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. CROPS TABLE
CREATE TABLE crops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    local_name VARCHAR(100),
    unit VARCHAR(10) NOT NULL DEFAULT 'Kg',
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_update_crops_timestamp
BEFORE UPDATE ON crops
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. CROP LISTINGS TABLE
CREATE TABLE crop_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE RESTRICT,
    quantity NUMERIC(10,2) NOT NULL CHECK (quantity >= 0),
    available_quantity NUMERIC(10,2) NOT NULL CHECK (available_quantity >= 0),
    unit VARCHAR(10) NOT NULL,
    expected_price NUMERIC(10,2) NOT NULL CHECK (expected_price > 0),
    price_unit VARCHAR(20) NOT NULL DEFAULT 'Kg',
    harvest_date DATE NOT NULL,
    location_district_id UUID NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'RESERVED', 'SOLD', 'INACTIVE', 'EXPIRED')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_update_crop_listings_timestamp
BEFORE UPDATE ON crop_listings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. CROP IMAGES TABLE
CREATE TABLE crop_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_listing_id UUID NOT NULL REFERENCES crop_listings(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. MARKETS TABLE
CREATE TABLE markets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_name VARCHAR(150) NOT NULL,
    district_id UUID NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    state VARCHAR(50) NOT NULL DEFAULT 'Maharashtra',
    latitude NUMERIC(9,6) NOT NULL,
    longitude NUMERIC(9,6) NOT NULL,
    market_code VARCHAR(20) UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. MARKET PRICES TABLE
CREATE TABLE market_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
    crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
    price_date DATE NOT NULL,
    minimum_price NUMERIC(10,2) NOT NULL CHECK (minimum_price >= 0),
    maximum_price NUMERIC(10,2) NOT NULL CHECK (maximum_price >= 0),
    modal_price NUMERIC(10,2) NOT NULL CHECK (modal_price >= 0),
    unit VARCHAR(10) NOT NULL DEFAULT 'Quintal',
    source VARCHAR(100) NOT NULL DEFAULT 'AGMARKNET',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_price_modal CHECK (modal_price >= minimum_price AND modal_price <= maximum_price)
);

-- 11. BUYER REQUIREMENTS TABLE
CREATE TABLE buyer_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
    crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE RESTRICT,
    quantity_required NUMERIC(10,2) NOT NULL CHECK (quantity_required > 0),
    unit VARCHAR(10) NOT NULL,
    maximum_price NUMERIC(10,2) NOT NULL CHECK (maximum_price > 0),
    district_id UUID NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    required_by_date DATE NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'PARTIALLY_FILLED', 'FULFILLED', 'CANCELLED', 'EXPIRED')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_update_buyer_req_timestamp
BEFORE UPDATE ON buyer_requirements
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 12. OFFERS / NEGOTIATIONS TABLE
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_listing_id UUID NOT NULL REFERENCES crop_listings(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    quantity NUMERIC(10,2) NOT NULL CHECK (quantity > 0),
    offered_price NUMERIC(10,2) NOT NULL CHECK (offered_price > 0),
    message TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'COUNTERED', 'CANCELLED')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_update_offers_timestamp
BEFORE UPDATE ON offers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 13. ORDERS TABLE
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE RESTRICT,
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE RESTRICT,
    transporter_id UUID REFERENCES transporters(id) ON DELETE SET NULL,
    subtotal NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
    transport_cost NUMERIC(10,2) NOT NULL DEFAULT 0.0 CHECK (transport_cost >= 0),
    platform_fee NUMERIC(10,2) NOT NULL DEFAULT 0.0 CHECK (platform_fee >= 0),
    total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED')),
    order_status VARCHAR(30) NOT NULL DEFAULT 'ORDER_PLACED' CHECK (order_status IN ('ORDER_PLACED', 'CONFIRMED', 'TRANSPORTER_ASSIGNED', 'PICKUP_STARTED', 'PICKED_UP', 'IN_TRANSIT', 'NEAR_DESTINATION', 'DELIVERED', 'COMPLETED', 'CANCELLED')),
    pickup_district_id UUID NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    delivery_district_id UUID NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    pickup_latitude NUMERIC(9,6),
    pickup_longitude NUMERIC(9,6),
    delivery_latitude NUMERIC(9,6),
    delivery_longitude NUMERIC(9,6),
    confirmed_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_update_orders_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 14. ORDER ITEMS TABLE
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    crop_listing_id UUID NOT NULL REFERENCES crop_listings(id) ON DELETE RESTRICT,
    crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE RESTRICT,
    quantity NUMERIC(10,2) NOT NULL CHECK (quantity > 0),
    unit VARCHAR(10) NOT NULL,
    price_per_unit NUMERIC(10,2) NOT NULL CHECK (price_per_unit > 0),
    total_price NUMERIC(12,2) NOT NULL CHECK (total_price > 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 15. ORDER STATUS HISTORY TABLE
CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 16. TRANSPORT REQUESTS TABLE
CREATE TABLE transport_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    transporter_id UUID REFERENCES transporters(id) ON DELETE SET NULL,
    pickup_location TEXT NOT NULL,
    delivery_location TEXT NOT NULL,
    pickup_district_id UUID NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    delivery_district_id UUID NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    distance_km NUMERIC(8,2) NOT NULL CHECK (distance_km > 0),
    estimated_duration_minutes INT NOT NULL CHECK (estimated_duration_minutes > 0),
    estimated_transport_cost NUMERIC(10,2) NOT NULL CHECK (estimated_transport_cost >= 0),
    actual_transport_cost NUMERIC(10,2) CHECK (actual_transport_cost >= 0),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED')),
    requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- 17. LIVE GPS LOCATION LOGS TABLE
CREATE TABLE delivery_locations (
    id BIGSERIAL PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    transporter_id UUID NOT NULL REFERENCES transporters(id) ON DELETE CASCADE,
    latitude NUMERIC(9,6) NOT NULL,
    longitude NUMERIC(9,6) NOT NULL,
    accuracy NUMERIC(6,2),
    speed NUMERIC(5,2),
    heading NUMERIC(5,2),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 18. QUALITY REPORTS TABLE
CREATE TABLE quality_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    transporter_id UUID REFERENCES transporters(id) ON DELETE SET NULL,
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE RESTRICT,
    crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE RESTRICT,
    verified_quantity NUMERIC(10,2) NOT NULL CHECK (verified_quantity > 0),
    quality_grade VARCHAR(20) NOT NULL CHECK (quality_grade IN ('EXCELLENT', 'GOOD', 'AVERAGE', 'POOR')),
    packaging_condition TEXT,
    remarks TEXT,
    verification_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 19. QUALITY IMAGES TABLE
CREATE TABLE quality_report_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quality_report_id UUID NOT NULL REFERENCES quality_reports(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 20. PAYMENTS TABLE
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    payment_method VARCHAR(30) NOT NULL,
    transaction_reference VARCHAR(100) UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'REFUNDED')),
    paid_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_update_payments_timestamp
BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 21. EARNINGS TABLE
CREATE TABLE earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    earning_type VARCHAR(25) NOT NULL CHECK (earning_type IN ('FARMER_SALE', 'TRANSPORT_PAYMENT', 'REFUND', 'OTHER')),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'FAILED')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_update_earnings_timestamp
BEFORE UPDATE ON earnings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 22. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(30) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    related_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 23. CONVERSATIONS TABLE
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_update_conversations_timestamp
BEFORE UPDATE ON conversations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 24. CONVERSATION PARTICIPANTS
CREATE TABLE conversation_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_conversation_participant UNIQUE (conversation_id, user_id)
);

-- 25. MESSAGES TABLE
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    message TEXT NOT NULL,
    attachment_url VARCHAR(500),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 26. RATINGS AND REVIEWS TABLE
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewed_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_order_reviewer UNIQUE (order_id, reviewer_id)
);

-- 27. AI MARKET PREDICTIONS TABLE
CREATE TABLE ai_market_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
    district_id UUID NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
    prediction_date DATE NOT NULL,
    forecast_date DATE NOT NULL,
    current_price NUMERIC(10,2) NOT NULL CHECK (current_price >= 0),
    predicted_price NUMERIC(10,2) NOT NULL CHECK (predicted_price >= 0),
    confidence_score NUMERIC(5,2) NOT NULL CHECK (confidence_score >= 0.00 AND confidence_score <= 1.00),
    demand_level VARCHAR(20) NOT NULL CHECK (demand_level IN ('LOW', 'MEDIUM', 'HIGH')),
    supply_level VARCHAR(20) NOT NULL CHECK (supply_level IN ('LOW', 'MEDIUM', 'HIGH')),
    recommendation TEXT,
    model_version VARCHAR(50) NOT NULL DEFAULT 'v1.0',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 28. WEATHER DATA TABLE
CREATE TABLE weather_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id UUID NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
    weather_date DATE NOT NULL,
    temperature NUMERIC(4,1) NOT NULL,
    humidity NUMERIC(5,2) NOT NULL,
    rainfall_probability NUMERIC(5,2) NOT NULL CHECK (rainfall_probability >= 0.00 AND rainfall_probability <= 100.00),
    weather_condition VARCHAR(100) NOT NULL,
    alert_level VARCHAR(20) NOT NULL DEFAULT 'NONE' CHECK (alert_level IN ('NONE', 'GREEN', 'YELLOW', 'ORANGE', 'RED')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 29. DOCUMENTS TABLE
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('IDENTITY', 'BUSINESS', 'VEHICLE', 'LICENSE', 'QUALITY_CERTIFICATE', 'INVOICE', 'OTHER')),
    document_url VARCHAR(500) NOT NULL,
    verification_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 30. DISPUTES TABLE
CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    raised_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    against_user UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    reason VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED')),
    resolution TEXT,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_update_disputes_timestamp
BEFORE UPDATE ON disputes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 31. AUDIT LOGS TABLE
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    ip_address VARCHAR(45),
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- INDEXING
CREATE INDEX idx_users_mobile ON users(mobile_number);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_farmers_district ON farmers(district_id);
CREATE INDEX idx_buyers_district ON buyers(district_id);
CREATE INDEX idx_crop_listings_crop ON crop_listings(crop_id);
CREATE INDEX idx_crop_listings_farmer ON crop_listings(farmer_id);
CREATE INDEX idx_crop_listings_status ON crop_listings(status);
CREATE INDEX idx_market_prices_crop_market ON market_prices(crop_id, market_id);
CREATE INDEX idx_market_prices_date ON market_prices(price_date);
CREATE INDEX idx_buyer_req_crop ON buyer_requirements(crop_id);
CREATE INDEX idx_buyer_req_district ON buyer_requirements(district_id);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_farmer ON orders(farmer_id);
CREATE INDEX idx_orders_transporter ON orders(transporter_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_delivery_locs_order_time ON delivery_locations(order_id, timestamp DESC);
CREATE INDEX idx_delivery_locs_transporter_time ON delivery_locations(transporter_id, timestamp DESC);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_audit_logs_user_action ON audit_logs(user_id, action);
