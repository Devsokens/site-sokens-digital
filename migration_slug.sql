-- ============================================================
-- Migration: URLs lisibles pour les cartes (slug au lieu de l'UUID)
-- Exécutez ce script après schema.sql / migration_address.sql.
-- Résultat: /card/jean-dupont au lieu de /card/2a9f4daa-1000-...
-- ============================================================

CREATE EXTENSION IF NOT EXISTS unaccent;

-- Ajouter le champ slug
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS slug TEXT;

-- Backfill des slugs pour les employés existants (prénom-nom, dédupliqué)
WITH ranked AS (
  SELECT
    id,
    regexp_replace(
      trim(both '-' FROM lower(unaccent(first_name || '-' || last_name))),
      '[^a-z0-9]+', '-', 'g'
    ) AS base_slug,
    row_number() OVER (
      PARTITION BY regexp_replace(
        trim(both '-' FROM lower(unaccent(first_name || '-' || last_name))),
        '[^a-z0-9]+', '-', 'g'
      )
      ORDER BY created_at
    ) AS rn
  FROM public.employees
  WHERE slug IS NULL
)
UPDATE public.employees e
SET slug = CASE WHEN r.rn = 1 THEN r.base_slug ELSE r.base_slug || '-' || r.rn END
FROM ranked r
WHERE e.id = r.id;

-- Rendre le slug obligatoire et unique
ALTER TABLE public.employees ALTER COLUMN slug SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'employees_slug_unique'
  ) THEN
    ALTER TABLE public.employees ADD CONSTRAINT employees_slug_unique UNIQUE (slug);
  END IF;
END $$;
