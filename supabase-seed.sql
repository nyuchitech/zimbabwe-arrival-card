-- Zimbabwe Arrival Card - Seed Data for Supabase
-- Run this AFTER the migration SQL

-- IMPORTANT: Change the admin password hash before running in production!
-- Default password: Admin@123 (bcrypt hash with 12 rounds)
-- Generate a new hash at: https://bcrypt-generator.com/

-- Insert Admin User
-- Password: Admin@123 (CHANGE THIS IN PRODUCTION!)
INSERT INTO "User" ("id", "email", "password", "name", "role", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid()::text,
    'admin@zimbabwe.gov.zw',
    '$2b$12$reg6J2/5nPdbFhvuKrhnN.o9RwEWRyRcLxAU.zUpe7K/R4MT73xtS', -- Admin@123
    'System Administrator',
    'ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("email") DO UPDATE SET
    "password" = EXCLUDED."password",
    "name" = EXCLUDED."name",
    "updatedAt" = CURRENT_TIMESTAMP;

-- Insert Border Posts (Zimbabwe Entry Points)
INSERT INTO "BorderPost" ("id", "name", "code", "type", "location", "isActive", "createdAt", "updatedAt")
VALUES
    (gen_random_uuid()::text, 'Robert Gabriel Mugabe International Airport', 'HRE', 'AIR', 'Harare', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Victoria Falls International Airport', 'VFA', 'AIR', 'Victoria Falls', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Joshua Mqabuko Nkomo International Airport', 'BUQ', 'AIR', 'Bulawayo', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Beitbridge Border Post', 'BTB', 'LAND', 'Beitbridge', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Victoria Falls Border Post', 'VFB', 'LAND', 'Victoria Falls', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Chirundu Border Post', 'CHR', 'LAND', 'Chirundu', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Plumtree Border Post', 'PLT', 'LAND', 'Plumtree', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Forbes Border Post', 'FRB', 'LAND', 'Mutare', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Kazungula Border Post', 'KZG', 'LAND', 'Kazungula', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Nyamapanda Border Post', 'NYM', 'LAND', 'Nyamapanda', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO NOTHING;

-- Verify data was inserted
SELECT 'Users created:' as info, COUNT(*) as count FROM "User";
SELECT 'Border posts created:' as info, COUNT(*) as count FROM "BorderPost";
