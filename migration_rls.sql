-- ============================================================
-- Migration: Mise à jour des politiques RLS - Sokens Digital
-- Exécutez CE script si la table "employees" existe déjà.
-- ============================================================

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Allow public read access" ON public.employees;
DROP POLICY IF EXISTS "Allow public insert access" ON public.employees;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON public.employees;
DROP POLICY IF EXISTS "Public can read employees" ON public.employees;
DROP POLICY IF EXISTS "Authenticated can insert employees" ON public.employees;
DROP POLICY IF EXISTS "Authenticated can update employees" ON public.employees;
DROP POLICY IF EXISTS "Authenticated can delete employees" ON public.employees;

-- S'assurer que RLS est activé
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- ✅ Lecture publique (pour les pages de profil des QR codes)
CREATE POLICY "Public can read employees" ON public.employees
    FOR SELECT USING (true);

-- 🔒 Insertion réservée aux admins connectés
CREATE POLICY "Authenticated can insert employees" ON public.employees
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 🔒 Modification réservée aux admins connectés
CREATE POLICY "Authenticated can update employees" ON public.employees
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 🔒 Suppression réservée aux admins connectés
CREATE POLICY "Authenticated can delete employees" ON public.employees
    FOR DELETE USING (auth.role() = 'authenticated');
