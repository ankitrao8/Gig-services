-- Sahakar Seva: Cooperative Gig Services Platform Schema
-- Database: PostgreSQL + PostGIS (Optional Extension for spatial queries)

-- Enable PostGIS if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('CUSTOMER', 'WORKER', 'SOCIETY_ADMIN', 'FEDERATION_ADMIN')),
    profile_photo TEXT,
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Societies (Cooperatives) Table
CREATE TABLE IF NOT EXISTS societies (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    admin_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    verification_status VARCHAR(20) DEFAULT 'VERIFIED' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'SUSPENDED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Workers Table
CREATE TABLE IF NOT EXISTS workers (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    society_id VARCHAR(50) REFERENCES societies(id) ON DELETE SET NULL,
    worker_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. SKR-EL-10291
    government_id_type VARCHAR(50) DEFAULT 'Aadhaar',
    government_id_verified BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(20) DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED')),
    availability_status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (availability_status IN ('AVAILABLE', 'BUSY', 'OFFLINE')),
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    location GEOMETRY(Point, 4326),
    average_rating NUMERIC(3, 2) DEFAULT 5.00,
    completed_jobs INTEGER DEFAULT 0,
    on_time_percentage NUMERIC(5, 2) DEFAULT 100.00,
    skill_score NUMERIC(8, 2) DEFAULT 0.00,
    skill_level VARCHAR(20) DEFAULT 'BRONZE' CHECK (skill_level IN ('BRONZE', 'SILVER', 'GOLD', 'MASTER')),
    total_earnings NUMERIC(12, 2) DEFAULT 0.00,
    welfare_status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (welfare_status IN ('ACTIVE', 'PENDING', 'INACTIVE')),
    insurance_status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (insurance_status IN ('ACTIVE', 'EXPIRED', 'PENDING')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Skills Master Table
CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    description TEXT
);

-- 5. Worker Skills Association Table
CREATE TABLE IF NOT EXISTS worker_skills (
    worker_id VARCHAR(50) REFERENCES workers(id) ON DELETE CASCADE,
    skill_id VARCHAR(50) REFERENCES skills(id) ON DELETE CASCADE,
    experience INTEGER DEFAULT 1, -- in years
    skill_level VARCHAR(20) DEFAULT 'BRONZE',
    PRIMARY KEY (worker_id, skill_id)
);

-- 6. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    worker_id VARCHAR(50) REFERENCES workers(id) ON DELETE CASCADE,
    service_id VARCHAR(50) REFERENCES skills(id) ON DELETE SET NULL,
    booking_type VARCHAR(20) NOT NULL CHECK (booking_type IN ('INSTANT', 'SCHEDULED', 'RECURRING', 'EMERGENCY')),
    status VARCHAR(30) NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'ACCEPTED', 'WORKER_ON_WAY', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    scheduled_date DATE NOT NULL,
    scheduled_time VARCHAR(30) NOT NULL,
    address TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    estimated_price NUMERIC(10, 2) NOT NULL,
    final_price NUMERIC(10, 2),
    emergency BOOLEAN DEFAULT FALSE,
    problem_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(50) PRIMARY KEY,
    booking_id VARCHAR(50) REFERENCES bookings(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('UPI', 'CARD', 'NET_BANKING', 'CASH')),
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Ratings Table
CREATE TABLE IF NOT EXISTS ratings (
    id VARCHAR(50) PRIMARY KEY,
    booking_id VARCHAR(50) UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    customer_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    worker_id VARCHAR(50) REFERENCES workers(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    on_time BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
    id VARCHAR(50) PRIMARY KEY,
    worker_id VARCHAR(50) REFERENCES workers(id) ON DELETE CASCADE,
    certificate_type VARCHAR(100) NOT NULL DEFAULT 'Platform-issued Skill Recognition Certificate',
    skill VARCHAR(100) NOT NULL,
    level VARCHAR(20) NOT NULL,
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    verification_token VARCHAR(100) UNIQUE NOT NULL
);

-- 10. Welfare Table
CREATE TABLE IF NOT EXISTS welfare (
    id VARCHAR(50) PRIMARY KEY,
    worker_id VARCHAR(50) UNIQUE REFERENCES workers(id) ON DELETE CASCADE,
    insurance_status VARCHAR(20) DEFAULT 'ACTIVE',
    insurance_provider VARCHAR(100) DEFAULT 'National Insurance Cooperative Scheme',
    policy_number VARCHAR(100),
    welfare_fund NUMERIC(10, 2) DEFAULT 4250.00,
    accident_coverage VARCHAR(20) DEFAULT 'ACTIVE',
    last_contribution NUMERIC(10, 2) DEFAULT 250.00,
    next_renewal DATE DEFAULT (CURRENT_DATE + INTERVAL '1 year'),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'INFO',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =======================================================
-- PostGIS Spatial Indices & Performance Optimization
-- =======================================================

-- Create GiST Spatial Index on Worker Location for Ultra-Fast Radius Queries (<10ms)
CREATE INDEX IF NOT EXISTS idx_workers_location ON workers USING GIST (location);

-- Function to auto-populate location geometry on insert or update
CREATE OR REPLACE FUNCTION update_worker_location()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_worker_location ON workers;
CREATE TRIGGER trg_worker_location
BEFORE INSERT OR UPDATE OF latitude, longitude ON workers
FOR EACH ROW
EXECUTE FUNCTION update_worker_location();

-- PostGIS Query Helper Example: Find all available workers within radius (meters)
-- SELECT w.*, ST_DistanceSphere(w.location, ST_SetSRID(ST_MakePoint(:user_lon, :user_lat), 4326)) AS distance_meters
-- FROM workers w
-- WHERE w.availability_status = 'AVAILABLE'
--   AND ST_DWithin(w.location::geography, ST_SetSRID(ST_MakePoint(:user_lon, :user_lat), 4326)::geography, :radius_meters)
-- ORDER BY distance_meters ASC;

