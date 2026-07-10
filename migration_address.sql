-- Ajouter le champ adresse à la table employees
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS address TEXT;
