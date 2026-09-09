-- ==================================================
-- AGRINOVA Maharashtra Database Seed Script
-- Realistic Indian Agricultural Sample Records
-- ==================================================

-- 1. Insert Maharashtra Districts (All 36 Districts)
INSERT INTO districts (id, state, district_name, district_code, latitude, longitude) VALUES
('d1f11111-1111-1111-1111-111111111111', 'Maharashtra', 'Pune', 'PN', 18.5204, 73.8567),
('d2f22222-2222-2222-2222-222222222222', 'Maharashtra', 'Nashik', 'NS', 19.9975, 73.7898),
('d3f33333-3333-3333-3333-333333333333', 'Maharashtra', 'Nagpur', 'NG', 21.1458, 79.0882),
('d4f44444-4444-4444-4444-444444444444', 'Maharashtra', 'Latur', 'LT', 18.4088, 76.5604),
('d5f55555-5555-5555-5555-555555555555', 'Maharashtra', 'Ahmednagar', 'AN', 19.0948, 74.7480),
('d6f66666-6666-6666-6666-666666666666', 'Maharashtra', 'Kolhapur', 'KH', 16.7050, 74.2433),
('d7f77777-7777-7777-7777-777777777777', 'Maharashtra', 'Solapur', 'SL', 17.6599, 75.9064),
('d8f88888-8888-8888-8888-888888888888', 'Maharashtra', 'Sangli', 'SN', 16.8524, 74.5815),
('d9f99999-9999-9999-9999-999999999999', 'Maharashtra', 'Satara', 'ST', 17.6805, 73.9918),
('d0f00000-0000-0000-0000-000000000000', 'Maharashtra', 'Jalgaon', 'JL', 21.0077, 75.5626),
(uuid_generate_v4(), 'Maharashtra', 'Akola', 'AK', 20.7002, 77.0082),
(uuid_generate_v4(), 'Maharashtra', 'Amravati', 'AM', 20.9374, 77.7796),
(uuid_generate_v4(), 'Maharashtra', 'Beed', 'BD', 18.9892, 75.7601),
(uuid_generate_v4(), 'Maharashtra', 'Bhandara', 'BH', 21.1852, 79.9678),
(uuid_generate_v4(), 'Maharashtra', 'Buldhana', 'BL', 20.5292, 76.1842),
(uuid_generate_v4(), 'Maharashtra', 'Chandrapur', 'CH', 19.9615, 79.2961),
(uuid_generate_v4(), 'Maharashtra', 'Chhatrapati Sambhajinagar', 'CS', 19.8762, 75.3433),
(uuid_generate_v4(), 'Maharashtra', 'Dhule', 'DH', 20.9042, 74.7749),
(uuid_generate_v4(), 'Maharashtra', 'Gadchiroli', 'GD', 20.1849, 80.0004),
(uuid_generate_v4(), 'Maharashtra', 'Gondia', 'GN', 21.4624, 80.1956),
(uuid_generate_v4(), 'Maharashtra', 'Hingoli', 'HN', 19.7214, 77.1407),
(uuid_generate_v4(), 'Maharashtra', 'Jalna', 'JN', 19.8410, 75.8833),
(uuid_generate_v4(), 'Maharashtra', 'Mumbai City', 'MC', 18.9696, 72.8230),
(uuid_generate_v4(), 'Maharashtra', 'Mumbai Suburban', 'MS', 19.1075, 72.8777),
(uuid_generate_v4(), 'Maharashtra', 'Nanded', 'ND', 19.1383, 77.3210),
(uuid_generate_v4(), 'Maharashtra', 'Nandurbar', 'NB', 21.7469, 74.1240),
(uuid_generate_v4(), 'Maharashtra', 'Dharashiv', 'DS', 18.1873, 76.0409),
(uuid_generate_v4(), 'Maharashtra', 'Palghar', 'PL', 19.6936, 72.7655),
(uuid_generate_v4(), 'Maharashtra', 'Parbhani', 'PR', 19.2612, 76.7794),
(uuid_generate_v4(), 'Maharashtra', 'Raigad', 'RG', 18.5158, 73.1822),
(uuid_generate_v4(), 'Maharashtra', 'Ratnagiri', 'RT', 16.9902, 73.3120),
(uuid_generate_v4(), 'Maharashtra', 'Sindhudurg', 'SD', 16.1158, 73.5594),
(uuid_generate_v4(), 'Maharashtra', 'Thane', 'TH', 19.2183, 72.9781),
(uuid_generate_v4(), 'Maharashtra', 'Wardha', 'WR', 20.7453, 78.6022),
(uuid_generate_v4(), 'Maharashtra', 'Washim', 'WS', 20.1005, 77.1354),
(uuid_generate_v4(), 'Maharashtra', 'Yavatmal', 'YT', 20.3888, 78.1228);

-- 2. Insert Base Crops
INSERT INTO crops (id, crop_name, category, local_name, unit, description, is_active) VALUES
('c1c11111-1111-1111-1111-111111111111', 'Tomato', 'Vegetables', 'टमाटर / टोमॅटो', 'Kg', 'Fresh red field tomatoes', TRUE),
('c2c22222-2222-2222-2222-222222222222', 'Onion', 'Vegetables', 'प्याज / कांदा', 'Kg', 'High shelf life Nashik red onions', TRUE),
('c3c33333-3333-3333-3333-333333333333', 'Soybean', 'Oilseeds', 'सोयाबीन', 'Quintal', 'Grade A yellow soybeans', TRUE),
('c4c44444-4444-4444-4444-444444444444', 'Orange', 'Fruits', 'संतरा', 'Kg', 'Sweet juicy Nagpur oranges', TRUE),
('c5c55555-5555-5555-5555-555555555555', 'Sugarcane', 'Cash Crops', 'गन्ना / ऊस', 'Ton', 'High sugar yield cane stalk', TRUE),
('c6c66666-6666-6666-6666-666666666666', 'Wheat', 'Grains', 'गेहूं / गहू', 'Quintal', 'Lokwan premium wheat grains', TRUE);

-- 3. Insert Users (5 Farmers, 5 Buyers, 5 Transporters, 1 Admin)
-- Password Hash represents encrypted token value: '$2a$12$agrinovaSecurePasswordHashToken'
INSERT INTO users (id, full_name, mobile_number, email, password_hash, role, preferred_language, is_verified) VALUES
-- Farmers
('u1a11111-1111-1111-1111-111111111111', 'Ramesh Patil', '9823456789', 'ramesh@agrinova.in', '$2a$12$agrinovaSecurePasswordHashToken', 'FARMER', 'mr', TRUE),
('u1a11111-1111-1111-1111-111111111112', 'Sanjay Deshmukh', '9823456781', 'sanjay@agrinova.in', '$2a$12$agrinovaSecurePasswordHashToken', 'FARMER', 'mr', TRUE),
('u1a11111-1111-1111-1111-111111111113', 'Maruti Kadam', '9823456782', 'maruti@agrinova.in', '$2a$12$agrinovaSecurePasswordHashToken', 'FARMER', 'hi', TRUE),
('u1a11111-1111-1111-1111-111111111114', 'Vitthal Pawar', '9823456783', 'vitthal@agrinova.in', '$2a$12$agrinovaSecurePasswordHashToken', 'FARMER', 'mr', TRUE),
('u1a11111-1111-1111-1111-111111111115', 'Eknath Shinde', '9823456784', 'eknath@agrinova.in', '$2a$12$agrinovaSecurePasswordHashToken', 'FARMER', 'en', TRUE),
-- Buyers
('u2b22222-2222-2222-2222-222222222221', 'ABC Foods Pune', '9876500123', 'pune@abcfoods.com', '$2a$12$agrinovaSecurePasswordHashToken', 'BUYER', 'en', TRUE),
('u2b22222-2222-2222-2222-222222222222', 'Vashi APMC Wholesalers', '9876500124', 'vashi@apmc.com', '$2a$12$agrinovaSecurePasswordHashToken', 'BUYER', 'en', TRUE),
('u2b22222-2222-2222-2222-222222222223', 'Nashik Juice Exporters', '9876500125', 'nashik@juice.com', '$2a$12$agrinovaSecurePasswordHashToken', 'BUYER', 'hi', TRUE),
('u2b22222-2222-2222-2222-222222222224', 'Latur Mills Oil Corp', '9876500126', 'latur@oilmill.com', '$2a$12$agrinovaSecurePasswordHashToken', 'BUYER', 'mr', TRUE),
('u2b22222-2222-2222-2222-222222222225', 'Mumbai Star Hotels Group', '9876500127', 'star@mumbaihotels.com', '$2a$12$agrinovaSecurePasswordHashToken', 'BUYER', 'en', TRUE),
-- Transporters
('u3c33333-3333-3333-3333-333333333331', 'Rajesh Patil Transports', '9811223344', 'rajesh@patiltransit.com', '$2a$12$agrinovaSecurePasswordHashToken', 'TRANSPORTER', 'en', TRUE),
('u3c33333-3333-3333-3333-333333333332', 'Satnam Singh Logi', '9811223345', 'satnam@singhlogi.com', '$2a$12$agrinovaSecurePasswordHashToken', 'TRANSPORTER', 'hi', TRUE),
('u3c33333-3333-3333-3333-333333333333', 'Kisan Rath Cargo', '9811223346', 'kisanrath@cargo.com', '$2a$12$agrinovaSecurePasswordHashToken', 'TRANSPORTER', 'mr', TRUE),
('u3c33333-3333-3333-3333-333333333334', 'Sahyadri Agri Transports', '9811223347', 'sahyadri@trans.com', '$2a$12$agrinovaSecurePasswordHashToken', 'TRANSPORTER', 'en', TRUE),
('u3c33333-3333-3333-3333-333333333335', 'Maharashtra Agri Logistic Ltd', '9811223348', 'mahalogistics@agri.com', '$2a$12$agrinovaSecurePasswordHashToken', 'TRANSPORTER', 'mr', TRUE),
-- Admin
('u4d44444-4444-4444-4444-444444444444', 'Agrinova Admin Control', '9999888877', 'admin@agrinova.in', '$2a$12$agrinovaSecurePasswordHashToken', 'ADMIN', 'en', TRUE);

-- 4. Insert Farmers Profiles
INSERT INTO farmers (id, user_id, state, district_id, taluka, village, farm_size, farm_size_unit, primary_crop, verification_status, latitude, longitude) VALUES
('f1f11111-1111-1111-1111-111111111111', 'u1a11111-1111-1111-1111-111111111111', 'Maharashtra', 'd1f11111-1111-1111-1111-111111111111', 'Baramati', 'Malegaon', 5.5, 'Acre', 'Tomato', 'VERIFIED', 18.1506, 74.5771),
('f1f11111-1111-1111-1111-111111111112', 'u1a11111-1111-1111-1111-111111111112', 'Maharashtra', 'd2f22222-2222-2222-2222-222222222222', 'Niphad', 'Pimpalgaon', 10.0, 'Acre', 'Onion', 'VERIFIED', 19.9975, 73.7898),
('f1f11111-1111-1111-1111-111111111113', 'u1a11111-1111-1111-1111-111111111113', 'Maharashtra', 'd4f44444-4444-4444-4444-444444444444', 'Latur', 'Ausa', 12.5, 'Acre', 'Soybean', 'VERIFIED', 18.4088, 76.5604),
('f1f11111-1111-1111-1111-111111111114', 'u1a11111-1111-1111-1111-111111111114', 'Maharashtra', 'd3f33333-3333-3333-3333-333333333333', 'Katol', 'Katol', 8.2, 'Hectare', 'Orange', 'VERIFIED', 21.1458, 79.0882),
('f1f11111-1111-1111-1111-111111111115', 'u1a11111-1111-1111-1111-111111111115', 'Maharashtra', 'd5f55555-5555-5555-5555-555555555555', 'Rahuri', 'Rahuri', 4.0, 'Hectare', 'Sugarcane', 'VERIFIED', 19.0948, 74.7480);

-- 5. Insert Buyers Profiles
INSERT INTO buyers (id, user_id, business_name, business_type, state, district_id, taluka, city, business_address, verification_status, latitude, longitude) VALUES
('b1b11111-1111-1111-1111-111111111111', 'u2b22222-2222-2222-2222-222222222221', 'ABC Foods processing', 'FOOD_PROCESSOR', 'Maharashtra', 'd1f11111-1111-1111-1111-111111111111', 'Haveli', 'Pune', 'Hadapsar Industrial Zone Gate 3', 'VERIFIED', 18.5204, 73.8567),
('b1b11111-1111-1111-1111-111111111112', 'u2b22222-2222-2222-2222-222222222222', 'Vashi APMC Wholesale Traders', 'WHOLESALER', 'Maharashtra', 'd1f11111-1111-1111-1111-111111111111', 'Thane', 'Mumbai', 'Vashi APMC Sector 19 Lane 5', 'VERIFIED', 19.0300, 73.0100),
('b1b11111-1111-1111-1111-111111111113', 'u2b22222-2222-2222-2222-222222222223', 'Nashik Agro Juice Packers', 'EXPORTER', 'Maharashtra', 'd2f22222-2222-2222-2222-222222222222', 'Nashik', 'Nashik', 'Ambad GIDC Sector A', 'VERIFIED', 19.9800, 73.7500),
('b1b11111-1111-1111-1111-111111111114', 'u2b22222-2222-2222-2222-222222222224', 'Latur Soy Oil Millers', 'FOOD_PROCESSOR', 'Maharashtra', 'd4f44444-4444-4444-4444-444444444444', 'Latur', 'Latur', 'MIDC Latur Phase 2', 'VERIFIED', 18.4200, 76.5400),
('b1b11111-1111-1111-1111-111111111115', 'u2b22222-2222-2222-2222-222222222225', 'Star Hotel Sourcing Corp', 'HOTEL', 'Maharashtra', 'd1f11111-1111-1111-1111-111111111111', 'Mumbai', 'Mumbai', 'Nariman Point Block C', 'VERIFIED', 18.9696, 72.8230);

-- 6. Insert Transporters Profiles
INSERT INTO transporters (id, user_id, vehicle_type, vehicle_number, vehicle_capacity, capacity_unit, license_number, verification_status) VALUES
('t1t11111-1111-1111-1111-111111111111', 'u3c33333-3333-3333-3333-333333333331', 'PICKUP', 'MH-12-AB-1234', 1.5, 'Ton', 'MH-12-2024-00123', 'VERIFIED'),
('t1t11111-1111-1111-1111-111111111112', 'u3c33333-3333-3333-3333-333333333332', 'TRUCK', 'MH-15-CD-5678', 8.0, 'Ton', 'MH-15-2023-00987', 'VERIFIED'),
('t1t11111-1111-1111-1111-111111111113', 'u3c33333-3333-3333-3333-333333333333', 'TEMPO', 'MH-14-XY-9012', 3.0, 'Ton', 'MH-14-2025-00456', 'VERIFIED'),
('t1t11111-1111-1111-1111-111111111114', 'u3c33333-3333-3333-3333-333333333334', 'MINI_TRUCK', 'MH-24-QR-3456', 2.0, 'Ton', 'MH-24-2024-00789', 'VERIFIED'),
('t1t11111-1111-1111-1111-111111111115', 'u3c33333-3333-3333-3333-333333333335', 'TRUCK', 'MH-09-JK-7890', 10.0, 'Ton', 'MH-09-2022-00321', 'VERIFIED');

-- 7. Insert 20 Crop Listings
INSERT INTO crop_listings (id, farmer_id, crop_id, quantity, available_quantity, unit, expected_price, harvest_date, location_district_id, status) VALUES
(uuid_generate_v4(), 'f1f11111-1111-1111-1111-111111111111', 'c1c11111-1111-1111-1111-111111111111', 500, 500, 'Kg', 28, '2026-08-10', 'd1f11111-1111-1111-1111-111111111111', 'AVAILABLE'),
(uuid_generate_v4(), 'f1f11111-1111-1111-1111-111111111112', 'c2c22222-2222-2222-2222-222222222222', 1200, 1200, 'Kg', 24, '2026-08-12', 'd2f22222-2222-2222-2222-222222222222', 'AVAILABLE'),
(uuid_generate_v4(), 'f1f11111-1111-1111-1111-111111111113', 'c3c33333-3333-3333-3333-333333333333', 50, 50, 'Quintal', 4600, '2026-08-14', 'd4f44444-4444-4444-4444-444444444444', 'AVAILABLE'),
(uuid_generate_v4(), 'f1f11111-1111-1111-1111-111111111114', 'c4c44444-4444-4444-4444-444444444444', 1000, 1000, 'Kg', 48, '2026-08-11', 'd3f33333-3333-3333-3333-333333333333', 'AVAILABLE'),
(uuid_generate_v4(), 'f1f11111-1111-1111-1111-111111111115', 'c5c55555-5555-5555-5555-555555555555', 20, 20, 'Ton', 3100, '2026-08-08', 'd5f55555-5555-5555-5555-555555555555', 'AVAILABLE'),
-- Additional Listings for volume
(uuid_generate_v4(), 'f1f11111-1111-1111-1111-111111111111', 'c2c22222-2222-2222-2222-222222222222', 800, 800, 'Kg', 26, '2026-08-09', 'd1f11111-1111-1111-1111-111111111111', 'AVAILABLE'),
(uuid_generate_v4(), 'f1f11111-1111-1111-1111-111111111112', 'c1c11111-1111-1111-1111-111111111111', 400, 400, 'Kg', 30, '2026-08-15', 'd2f22222-2222-2222-2222-222222222222', 'AVAILABLE'),
(uuid_generate_v4(), 'f1f11111-1111-1111-1111-111111111113', 'c6c66666-6666-6666-6666-666666666666', 30, 30, 'Quintal', 2400, '2026-08-07', 'd4f44444-4444-4444-4444-444444444444', 'AVAILABLE'),
(uuid_generate_v4(), 'f1f11111-1111-1111-1111-111111111114', 'c3c33333-3333-3333-3333-333333333333', 1500, 1500, 'Kg', 45, '2026-08-13', 'd3f33333-3333-3333-3333-333333333333', 'AVAILABLE'),
(uuid_generate_v4(), 'f1f11111-1111-1111-1111-111111111115', 'c6c66666-6666-6666-6666-666666666666', 25, 25, 'Quintal', 2500, '2026-08-10', 'd5f55555-5555-5555-5555-555555555555', 'AVAILABLE'),
(uuid_generate_v4(), 'f1f11111-1111-1111-1111-111111111111', 'c1c11111-1111-1111-1111-111111111111', 300, 300, 'Kg', 32, '2026-08-14', 'd1f11111-1111-1111-1111-111111111111', 'AVAILABLE'),
(uuid_generate_v4(), 'f1f11111-1111-1111-1111-111111111112', 'c2c22222-2222-2222-2222-222222222222', 1500, 1500, 'Kg', 22, '2026-08-13', 'd2f22222-2222-2222-2222-222222222222', 'AVAILABLE'),
(uuid_generate_v4(), 'f1f11111-1111-1111-1111-111111111113', 'c2c22222-2222-2222-2222-222222222222', 2000, 2000, 'Kg', 23, '2026-08-16', 'd4f44444-4444-4444-4444-444444444444', 'AVAILABLE'),
(uuid_generate_v4(), 'f1f11111-1111-1111-1111-111111111114', 'c4c44444-4444-4444-4444-444444444444', 500, 500, 'Kg', 50, '2026-08-10', 'd3f33333-3333-3333-3333-333333333333', 'AVAILABLE'),
(uuid_generate_v4(), 'f1f11111-1111-1111-1111-111111111115', 'c5c55555-5555-5555-5555-555555555555', 10, 10, 'Ton', 3200, '2026-08-12', 'd5f55555-5555-5555-5555-555555555555', 'AVAILABLE'),
(uuid_generate_v4(), 'f1f11111-1111-1111-1111-111111111111', 'c6c66666-6666-6666-6666-666666666666', 15, 15, 'Quintal', 2450, '2026-08-11', 'd1f11111-1111-1111-1111-111111111111', 'AVAILABLE'),
(uuid_generate_v4(), 'f1f11111-1111-1111-1111-111111111112', 'c3c33333-3333-3333-3333-333333333333', 25, 25, 'Quintal', 4550, '2026-08-14', 'd2f22222-2222-2222-2222-222222222222', 'AVAILABLE'),
(uuid_generate_v4(), 'f1f11111-1111-1111-1111-111111111113', 'c1c11111-1111-1111-1111-111111111113', 450, 450, 'Kg', 29, '2026-08-13', 'd4f44444-4444-4444-4444-444444444444', 'AVAILABLE'),
(uuid_generate_v4(), 'f1f11111-1111-1111-1111-111111111114', 'c2c22222-2222-2222-2222-222222222222', 3000, 3000, 'Kg', 21, '2026-08-16', 'd3f33333-3333-3333-3333-333333333333', 'AVAILABLE'),
(uuid_generate_v4(), 'f1f11111-1111-1111-1111-111111111115', 'c3c33333-3333-3333-3333-333333333333', 40, 40, 'Quintal', 4620, '2026-08-15', 'd5f55555-5555-5555-5555-555555555555', 'AVAILABLE');

-- 8. Insert 10 Buyer Requirements
INSERT INTO buyer_requirements (id, buyer_id, crop_id, quantity_required, unit, maximum_price, district_id, required_by_date, status) VALUES
(uuid_generate_v4(), 'b1b11111-1111-1111-1111-111111111111', 'c1c11111-1111-1111-1111-111111111111', 1000, 'Kg', 30, 'd1f11111-1111-1111-1111-111111111111', '2026-08-15', 'OPEN'),
(uuid_generate_v4(), 'b1b11111-1111-1111-1111-111111111112', 'c2c22222-2222-2222-2222-222222222222', 5000, 'Kg', 26, 'd1f11111-1111-1111-1111-111111111111', '2026-08-16', 'OPEN'),
(uuid_generate_v4(), 'b1b11111-1111-1111-1111-111111111113', 'c4c44444-4444-4444-4444-444444444444', 2000, 'Kg', 52, 'd2f22222-2222-2222-2222-222222222222', '2026-08-18', 'OPEN'),
(uuid_generate_v4(), 'b1b11111-1111-1111-1111-111111111114', 'c3c33333-3333-3333-3333-333333333333', 100, 'Quintal', 4800, 'd4f44444-4444-4444-4444-444444444444', '2026-08-20', 'OPEN'),
(uuid_generate_v4(), 'b1b11111-1111-1111-1111-111111111115', 'c1c11111-1111-1111-1111-111111111111', 800, 'Kg', 32, 'd1f11111-1111-1111-1111-111111111111', '2026-08-14', 'OPEN'),
(uuid_generate_v4(), 'b1b11111-1111-1111-1111-111111111111', 'c2c22222-2222-2222-2222-222222222222', 2000, 'Kg', 25, 'd1f11111-1111-1111-1111-111111111111', '2026-08-19', 'OPEN'),
(uuid_generate_v4(), 'b1b11111-1111-1111-1111-111111111112', 'c6c66666-6666-6666-6666-666666666666', 50, 'Quintal', 2550, 'd1f11111-1111-1111-1111-111111111111', '2026-08-17', 'OPEN'),
(uuid_generate_v4(), 'b1b11111-1111-1111-1111-111111111113', 'c5c55555-5555-5555-5555-555555555555', 50, 'Ton', 3300, 'd2f22222-2222-2222-2222-222222222222', '2026-08-25', 'OPEN'),
(uuid_generate_v4(), 'b1b11111-1111-1111-1111-111111111114', 'c3c33333-3333-3333-3333-333333333333', 150, 'Quintal', 4750, 'd4f44444-4444-4444-4444-444444444444', '2026-08-22', 'OPEN'),
(uuid_generate_v4(), 'b1b11111-1111-1111-1111-111111111115', 'c6c66666-6666-6666-6666-666666666666', 40, 'Quintal', 2600, 'd1f11111-1111-1111-1111-111111111111', '2026-08-18', 'OPEN');

-- 9. Insert Mandi Markets
INSERT INTO markets (id, market_name, district_id, state, latitude, longitude, market_code) VALUES
('m1m11111-1111-1111-1111-111111111111', 'Pune Mandi Market', 'd1f11111-1111-1111-1111-111111111111', 'Maharashtra', 18.5204, 73.8567, 'MND-PN-01'),
('m1m11111-1111-1111-1111-111111111112', 'Nashik APMC Mandi', 'd2f22222-2222-2222-2222-222222222222', 'Maharashtra', 19.9975, 73.7898, 'MND-NS-01'),
('m1m11111-1111-1111-1111-111111111113', 'Nagpur Orange Mandi', 'd3f33333-3333-3333-3333-333333333333', 'Maharashtra', 21.1458, 79.0882, 'MND-NG-01'),
('m1m11111-1111-1111-1111-111111111114', 'Latur Pulses Mandi', 'd4f44444-4444-4444-4444-444444444444', 'Maharashtra', 18.4088, 76.5604, 'MND-LT-01');

-- 10. Insert 10 Mandi Prices (Mandi Bhav)
INSERT INTO market_prices (id, market_id, crop_id, price_date, minimum_price, maximum_price, modal_price, unit, source) VALUES
(uuid_generate_v4(), 'm1m11111-1111-1111-1111-111111111111', 'c1c11111-1111-1111-1111-111111111111', '2026-08-11', 2500, 3000, 2800, 'Quintal', 'AGMARKNET'),
(uuid_generate_v4(), 'm1m11111-1111-1111-1111-111111111112', 'c2c22222-2222-2222-2222-222222222222', '2026-08-11', 2200, 2600, 2400, 'Quintal', 'AGMARKNET'),
(uuid_generate_v4(), 'm1m11111-1111-1111-1111-111111111114', 'c3c33333-3333-3333-3333-333333333333', '2026-08-11', 4400, 4800, 4600, 'Quintal', 'AGMARKNET'),
(uuid_generate_v4(), 'm1m11111-1111-1111-1111-111111111113', 'c4c44444-4444-4444-4444-444444444444', '2026-08-11', 4200, 5200, 4800, 'Quintal', 'AGMARKNET'),
(uuid_generate_v4(), 'm1m11111-1111-1111-1111-111111111111', 'c6c66666-6666-6666-6666-666666666666', '2026-08-11', 2300, 2700, 2500, 'Quintal', 'AGMARKNET'),
(uuid_generate_v4(), 'm1m11111-1111-1111-1111-111111111111', 'c1c11111-1111-1111-1111-111111111111', '2026-08-10', 2400, 2900, 2650, 'Quintal', 'AGMARKNET'),
(uuid_generate_v4(), 'm1m11111-1111-1111-1111-111111111112', 'c2c22222-2222-2222-2222-222222222222', '2026-08-10', 2150, 2550, 2350, 'Quintal', 'AGMARKNET'),
(uuid_generate_v4(), 'm1m11111-1111-1111-1111-111111111114', 'c3c33333-3333-3333-3333-333333333333', '2026-08-10', 4450, 4850, 4650, 'Quintal', 'AGMARKNET'),
(uuid_generate_v4(), 'm1m11111-1111-1111-1111-111111111113', 'c4c44444-4444-4444-4444-444444444444', '2026-08-10', 4300, 5300, 4900, 'Quintal', 'AGMARKNET'),
(uuid_generate_v4(), 'm1m11111-1111-1111-1111-111111111111', 'c6c66666-6666-6666-6666-666666666666', '2026-08-10', 2280, 2680, 2480, 'Quintal', 'AGMARKNET');

-- 11. Insert 5 Orders
INSERT INTO orders (id, order_number, buyer_id, farmer_id, transporter_id, subtotal, transport_cost, platform_fee, total_amount, payment_status, order_status, pickup_district_id, delivery_district_id, pickup_latitude, pickup_longitude, delivery_latitude, delivery_longitude, confirmed_at) VALUES
('o1o11111-1111-1111-1111-111111111111', 'AGR1024', 'b1b11111-1111-1111-1111-111111111111', 'f1f11111-1111-1111-1111-111111111111', 't1t11111-1111-1111-1111-111111111111', 14000, 1500, 300, 15800, 'PAID', 'In Transit', 'd1f11111-1111-1111-1111-111111111111', 'd1f11111-1111-1111-1111-111111111111', 18.1506, 74.5771, 18.5204, 73.8567, '2026-08-11 10:30:00'),
('o1o11111-1111-1111-1111-111111111112', 'AGR1023', 'b1b11111-1111-1111-1111-111111111112', 'f1f11111-1111-1111-1111-111111111112', 't1t11111-1111-1111-1111-111111111111', 7200, 900, 150, 8250, 'PAID', 'In Transit', 'd2f22222-2222-2222-2222-222222222222', 'd1f11111-1111-1111-1111-111111111111', 19.9975, 73.7898, 19.0300, 73.0100, '2026-08-10 14:15:00'),
('o1o11111-1111-1111-1111-111111111113', 'AGR1022', 'b1b11111-1111-1111-1111-111111111113', 'f1f11111-1111-1111-1111-111111111114', 't1t11111-1111-1111-1111-111111111112', 48000, 3200, 960, 52160, 'PROCESSING', 'TRANSPORTER_ASSIGNED', 'd3f33333-3333-3333-3333-333333333333', 'd2f22222-2222-2222-2222-222222222222', 21.1458, 79.0882, 19.9800, 73.7500, '2026-08-11 11:00:00'),
('o1o11111-1111-1111-1111-111111111114', 'AGR1021', 'b1b11111-1111-1111-1111-111111111114', 'f1f11111-1111-1111-1111-111111111113', NULL, 138000, 0, 2760, 140760, 'PENDING', 'ORDER_PLACED', 'd4f44444-4444-4444-4444-444444444444', 'd4f44444-4444-4444-4444-444444444444', 18.4088, 76.5604, 18.4200, 76.5400, NULL),
('o1o11111-1111-1111-1111-111111111115', 'AGR1020', 'b1b11111-1111-1111-1111-111111111115', 'f1f11111-1111-1111-1111-111111111115', 't1t11111-1111-1111-1111-111111111113', 62000, 4800, 1240, 68040, 'PAID', 'COMPLETED', 'd5f55555-5555-5555-5555-555555555555', 'd1f11111-1111-1111-1111-111111111111', 19.0948, 74.7480, 18.9696, 72.8230, '2026-08-08 09:00:00');

-- 12. Insert 5 Transport Requests
INSERT INTO transport_requests (id, order_id, transporter_id, pickup_location, delivery_location, pickup_district_id, delivery_district_id, distance_km, estimated_duration_minutes, estimated_transport_cost, status, requested_at, accepted_at) VALUES
(uuid_generate_v4(), 'o1o11111-1111-1111-1111-111111111111', 't1t11111-1111-1111-1111-111111111111', 'Malegaon Baramati Farm', 'Hadapsar industrial Pune', 'd1f11111-1111-1111-1111-111111111111', 'd1f11111-1111-1111-1111-111111111111', 52.4, 75, 1500, 'ACCEPTED', '2026-08-11 10:35:00', '2026-08-11 10:45:00'),
(uuid_generate_v4(), 'o1o11111-1111-1111-1111-111111111112', 't1t11111-1111-1111-1111-111111111111', 'Pimpalgaon Nashik Farm', 'Vashi Wholesale APMC', 'd2f22222-2222-2222-2222-222222222222', 'd1f11111-1111-1111-1111-111111111111', 165.0, 210, 900, 'ACCEPTED', '2026-08-10 14:20:00', '2026-08-10 14:35:00'),
(uuid_generate_v4(), 'o1o11111-1111-1111-1111-111111111113', 't1t11111-1111-1111-1111-111111111112', 'Katol Orange Farm', 'Ambad GIDC Nashik', 'd3f33333-3333-3333-3333-333333333333', 'd2f22222-2222-2222-2222-222222222222', 540.5, 680, 3200, 'ACCEPTED', '2026-08-11 11:05:00', '2026-08-11 11:15:00'),
(uuid_generate_v4(), 'o1o11111-1111-1111-1111-111111111115', 't1t11111-1111-1111-1111-111111111113', 'Rahuri Sugarcane Farm', 'Nariman Point Mumbai', 'd5f55555-5555-5555-5555-555555555555', 'd1f11111-1111-1111-1111-111111111111', 280.0, 360, 4800, 'COMPLETED', '2026-08-08 09:05:00', '2026-08-08 09:15:00'),
(uuid_generate_v4(), 'o1o11111-1111-1111-1111-111111111114', NULL, 'Ausa Latur Farm', 'MIDC Phase 2 Latur', 'd4f44444-4444-4444-4444-444444444444', 'd4f44444-4444-4444-4444-444444444444', 18.0, 40, 600, 'PENDING', '2026-08-11 12:00:00', NULL);

-- 13. Insert Notifications
INSERT INTO notifications (id, user_id, title, message, notification_type, related_order_id) VALUES
(uuid_generate_v4(), 'u1a11111-1111-1111-1111-111111111111', 'New Order Confirmed', 'Your Tomato listing received an order AGR1024 from ABC Foods.', 'order', 'o1o11111-1111-1111-1111-111111111111'),
(uuid_generate_v4(), 'u2b22222-2222-2222-2222-222222222221', 'Escrow Payment Success', 'Your ₹15,800 escrow payment for order AGR1024 has been verified.', 'payment', 'o1o11111-1111-1111-1111-111111111111');

-- 14. Insert AI Predictions
INSERT INTO ai_market_predictions (id, crop_id, district_id, prediction_date, forecast_date, current_price, predicted_price, confidence_score, demand_level, supply_level, recommendation) VALUES
(uuid_generate_v4(), 'c1c11111-1111-1111-1111-111111111111', 'd1f11111-1111-1111-1111-111111111111', '2026-08-11', '2026-08-15', 2800, 3050, 0.88, 'HIGH', 'MEDIUM', 'Market conditions indicate a possible price increase. Hold stocks for 3-5 days to maximize value.'),
(uuid_generate_v4(), 'c2c22222-2222-2222-2222-222222222222', 'd2f22222-2222-2222-2222-222222222222', '2026-08-11', '2026-08-14', 2400, 2250, 0.82, 'LOW', 'HIGH', 'Heavy arrivals expected. Sell immediately to avoid loss.');

-- 15. Insert Ratings
INSERT INTO ratings (id, order_id, reviewer_id, reviewed_user_id, rating, review) VALUES
(uuid_generate_v4(), 'o1o11111-1111-1111-1111-111111111115', 'u2b22222-2222-2222-2222-222222222225', 'u1a11111-1111-1111-1111-111111111115', 5, 'Excellent sugarcane quality, fresh and well loaded.');
