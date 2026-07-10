-- ============================================================
-- Supabase Schema for Sokens Digital - Business Cards Module
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the employees table
CREATE TABLE public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    linkedin_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- ✅ ANYONE can read employee data (needed for public QR code profile pages)
CREATE POLICY "Public can read employees" ON public.employees
    FOR SELECT USING (true);

-- 🔒 Only AUTHENTICATED admins can INSERT new employees
CREATE POLICY "Authenticated can insert employees" ON public.employees
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 🔒 Only AUTHENTICATED admins can UPDATE employees
CREATE POLICY "Authenticated can update employees" ON public.employees
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 🔒 Only AUTHENTICATED admins can DELETE employees
CREATE POLICY "Authenticated can delete employees" ON public.employees
    FOR DELETE USING (auth.role() = 'authenticated');
