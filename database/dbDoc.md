# AGRINOVA PostgreSQL Database Architecture Documentation

This document describes the design system, relationships, constraints, privacy masks, search indexing, and Express API endpoints mapping for the centralized relational database of the **AGRINOVA** AgriTech platform.

---

## 🏛️ Database Entities & Column Mappings

### 1. `users`
Represents all system actors. Passwords are encrypted utilizing strong bcrypt hashing schemes.
* `id` UUID PRIMARY KEY - Default `uuid_generate_v4()`.
* `full_name` VARCHAR(100) NOT NULL.
* `mobile_number` VARCHAR(15) UNIQUE - Used for mobile OTP registration.
* `email` VARCHAR(100) UNIQUE.
* `password_hash` VARCHAR(255) NOT NULL - Encrypted.
* `role` VARCHAR(20) - Enforced via check constraint: `FARMER`, `BUYER`, `TRANSPORTER`, `ADMIN`.
* `preferred_language` VARCHAR(5) - English (`en`), Hindi (`hi`), Marathi (`mr`).
* `is_verified` BOOLEAN - Profile registration validation state.
* `is_active` BOOLEAN - Deactivation utility flags.
* `deleted_at` TIMESTAMP - soft-deletion tracker.

### 2. `farmers`
Extends user profiles with agricultural and crop yield variables.
* `id` UUID PRIMARY KEY.
* `user_id` UUID FOREIGN KEY REFERENCES `users(id)`.
* `district_id` UUID FOREIGN KEY REFERENCES `districts(id)`.
* `taluka` & `village` VARCHAR(100).
* `farm_size` NUMERIC(10,2).
* `farm_size_unit` VARCHAR(10) CHECK (`Acre`, `Hectare`).
* `verification_status` CHECK (`PENDING`, `VERIFIED`, `REJECTED`).
* `latitude` & `longitude` NUMERIC(9,6) - Encrypted/masked exact coordinates.

### 3. `buyers`
Extends user profiles with business enterprise properties.
* `business_name` VARCHAR(150).
* `business_type` CHECK (`TRADER`, `RETAILER`, `RESTAURANT`, `HOTEL`, `FOOD_PROCESSOR`, `EXPORTER`, `WHOLESALER`, `OTHER`).
* `business_address` TEXT.

### 4. `transporters`
Courier dispatch properties.
* `vehicle_type` CHECK (`MINI_TRUCK`, `PICKUP`, `TRUCK`, `TEMPO`, `OTHER`).
* `vehicle_number` VARCHAR(20) UNIQUE.
* `license_number` VARCHAR(50) UNIQUE.
* `rating` NUMERIC(3,2) - Calculated review score averages.

### 5. `districts`
Pre-populated district index for geolocation mapping (36 districts of Maharashtra).

### 6. `crops`
Static catalog of crop categories (Tomato, Onion, Orange, Soybean, Wheat).

### 7. `crop_listings`
Active harvest quantities offered by farmers.
* `available_quantity` NUMERIC(10,2).
* `status` CHECK (`AVAILABLE`, `RESERVED`, `SOLD`, `INACTIVE`, `EXPIRED`).

### 8. `buyer_requirements`
Demand requests posted by wholesale buyers.

### 9. `offers`
Price negotiations and crop quantity counters between farmers and buyers.
* `status` CHECK (`PENDING`, `ACCEPTED`, `REJECTED`, `COUNTERED`, `CANCELLED`).

### 10. `orders` & `order_items`
Secures transaction ledger items.
* `payment_status` CHECK (`PENDING`, `PROCESSING`, `PAID`, `FAILED`, `REFUNDED`).
* `order_status` CHECK (`ORDER_PLACED`, `CONFIRMED`, `TRANSPORTER_ASSIGNED`, `PICKUP_STARTED`, `PICKED_UP`, `IN_TRANSIT`, `NEAR_DESTINATION`, `DELIVERED`, `COMPLETED`, `CANCELLED`).

### 11. `delivery_locations`
High-speed log table recording carrier geolocations emitted via watchPosition.
* `speed` & `heading` & `accuracy` NUMERIC variables.

---

## 🔒 Location Privacy Masking Strategy

To protect farmers and buyers from public location history disclosure, the database implements a **Double-Layer Access Constraint**:
1. **Public Discovery Phase (Before Order)**:
   - Queries targeting available crops and buyers query the `districts` and `taluka` fields.
   - Exact `latitude` and `longitude` fields in the `farmers` and `buyers` tables are restricted. Only approximate center-point offsets are shared.
2. **Execution Phase (After Order Confirmation)**:
   - Once a transporter accepts an order, the transporter, buyer, and farmer associated with the `order_id` are granted access to query the exact `pickup_latitude` and `pickup_longitude` values.
   - Live coordinates are updated only while the order is in `In Transit` status.

---

## ⚡ Indexing & Search Optimization

1. **Unique Index constraints**:
   - `users(mobile_number)` and `users(email)` to guarantee zero duplicate registrations.
   - `ratings(order_id, reviewer_id)` to enforce singular reviews per delivery.
2. **Frequently Searched fields**:
   - Indexes on `crop_listings(crop_id)` and `crop_listings(status)` to make search filters immediate.
   - Composite index `delivery_locations(order_id, timestamp DESC)` to retrieve only the latest coordinate update instantly.

---

## 🌐 Express Backend API Endpoint Mapping

The schema is built to serve the following REST API handlers:
- **Auth**: `/api/auth/register` (creates `users`), `/api/auth/login`.
- **Crops**: `/api/crops` (queries `crop_listings` left joined with `crops`).
- **Market prices**: `/api/market/prices` (queries `market_prices` average trends).
- **Orders**: `/api/orders` (creates `orders` and `order_status_history`).
- **Transit**: `/api/transport` (accepts courier assignments).
- **Live GPS Logs**: `/api/deliveries/:orderId/location` (emits to `delivery_locations` and broadcasts via socket room).
