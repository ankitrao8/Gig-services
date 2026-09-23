-- Sahakar Seva: Initial Seed Data
-- 3 Cooperative Societies, Skills, Users, 20+ Workers, 10 Customers, 50+ Bookings, Ratings, Certificates, Welfare

-- Skills
INSERT INTO skills (id, name, category, icon, description) VALUES
('sk-elec', 'Electrician', 'Electrical & Wiring', 'Zap', 'Wiring, switchboard repair, appliance installation, MCB & fuse repair'),
('sk-plumb', 'Plumber', 'Plumbing & Sanitation', 'Wrench', 'Pipe leakage, tap fitting, bathroom sanitary repair, water motor setup'),
('sk-carp', 'Carpenter', 'Woodwork & Furniture', 'Hammer', 'Furniture repair, modular fittings, doors and locks repair, woodwork polish'),
('sk-paint', 'Painter', 'Home Improvement', 'Paintbrush', 'Interior & exterior wall painting, waterproof coating, wall putty'),
('sk-clean', 'Cleaner', 'Sanitation & Hygiene', 'Sparkles', 'Deep home cleaning, kitchen & bathroom sanitation, sofa cleaning'),
('sk-gard', 'Gardener', 'Home & Outdoors', 'Sprout', 'Lawn maintenance, trimming, potting, plant disease care, landscaping'),
('sk-driv', 'Driver', 'Mobility & Transport', 'Car', 'Personal driver, city trips, outstation travel, commercial vehicle driving'),
('sk-care', 'Caregiver', 'Health & Senior Care', 'HeartPulse', 'Elderly assistance, post-hospitalization patient care, physiotherapy aid'),
('sk-dom', 'Domestic Helper', 'Household Assistance', 'Home', 'Daily housekeeping, utensil cleaning, meal prep assistance, laundry aid'),
('sk-ac', 'AC Technician', 'Appliance & Cooling', 'Snowflake', 'AC servicing, gas refilling, cooling coil repair, split/window installation')
ON CONFLICT (id) DO NOTHING;

-- Societies
INSERT INTO societies (id, name, registration_number, district, state, address, admin_id, verification_status) VALUES
('soc-varanasi', 'Varanasi Labour & Artisan Cooperative Society', 'UP-VAR-COOP-2018-091', 'Varanasi', 'Uttar Pradesh', 'Godowlia Road, Near Dashashwamedh, Varanasi 221001', 'usr-admin-1', 'VERIFIED'),
('soc-kashi', 'Kashi Technicians & Service Sahakari Samiti', 'UP-VAR-COOP-2020-142', 'Varanasi', 'Uttar Pradesh', 'Sigra Mahmoorganj Marg, Varanasi 221010', 'usr-admin-2', 'VERIFIED'),
('soc-purvanchal', 'Purvanchal Shramik Seva Federation', 'UP-ST-FED-2016-004', 'Varanasi', 'Uttar Pradesh', 'Cantonment Area, Orderly Bazaar, Varanasi 221002', 'usr-admin-3', 'VERIFIED')
ON CONFLICT (id) DO NOTHING;
