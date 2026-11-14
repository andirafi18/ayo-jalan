-- ============================================================================
-- SCHEMA DATABASE AYO JALAN BONDOWOSO (SUPABASE / POSTGRESQL)
-- Aman dijalankan ulang tanpa error (Idempotent)
-- ============================================================================

-- Pastikan ekstensi UUID tersedia
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Tabel Pengaturan Tarif Live
CREATE TABLE IF NOT EXISTS public.app_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  motor_rate INTEGER NOT NULL DEFAULT 2500,
  motor_min INTEGER NOT NULL DEFAULT 8000,
  hemat_rate INTEGER NOT NULL DEFAULT 3800,
  reguler_rate INTEGER NOT NULL DEFAULT 6000,
  xl_rate INTEGER NOT NULL DEFAULT 7500,
  car_min INTEGER NOT NULL DEFAULT 15000,
  mountain_pct INTEGER NOT NULL DEFAULT 20,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Isi pengaturan tarif awal (id = 1)
INSERT INTO public.app_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- 2. Tabel Akun Mitra Driver
CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  pin TEXT NOT NULL DEFAULT '1234',
  name TEXT NOT NULL,
  plate TEXT,
  vehicle_type TEXT DEFAULT 'Mobil',
  bank_name TEXT,
  account_number TEXT,
  account_holder TEXT,
  is_online BOOLEAN DEFAULT true,
  last_lat DOUBLE PRECISION,
  last_lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabel Order Perjalanan (Penumpang <-> Driver)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passenger_name TEXT NOT NULL,
  passenger_phone TEXT NOT NULL,
  pickup_name TEXT,
  pickup_lat DOUBLE PRECISION,
  pickup_lng DOUBLE PRECISION,
  dropoff_name TEXT,
  dropoff_lat DOUBLE PRECISION,
  dropoff_lng DOUBLE PRECISION,
  distance_km NUMERIC(10, 2) DEFAULT 0,
  duration_sec INTEGER DEFAULT 0,
  service_code TEXT,
  service_label TEXT,
  surge_mult NUMERIC(4, 2) DEFAULT 1.0,
  is_mountain BOOLEAN DEFAULT false,
  toll_fee INTEGER DEFAULT 0,
  platform_fee INTEGER DEFAULT 0,
  total_fare INTEGER DEFAULT 0,
  driver_net INTEGER DEFAULT 0,
  payment_method TEXT DEFAULT 'Tunai',
  payment_status TEXT DEFAULT 'unpaid',
  note TEXT,
  status TEXT DEFAULT 'pending',
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  driver_name TEXT,
  driver_lat DOUBLE PRECISION,
  driver_lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabel Pengajuan Withdraw Driver
CREATE TABLE IF NOT EXISTS public.withdraws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  driver_name TEXT,
  amount INTEGER NOT NULL,
  bank_name TEXT,
  account_number TEXT,
  account_holder TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Index untuk Performa Pencarian Cepat
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_drivers_phone ON public.drivers(phone);
CREATE INDEX IF NOT EXISTS idx_withdraws_status ON public.withdraws(status);

-- 6. Aktifkan Replica Identity Full agar filter Realtime UPDATE bekerja akurat
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.drivers REPLICA IDENTITY FULL;
ALTER TABLE public.withdraws REPLICA IDENTITY FULL;

-- 7. Daftarkan Tabel ke Publikasi Realtime (Aman jika sudah terdaftar)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'drivers'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.drivers;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'withdraws'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.withdraws;
  END IF;
END $$;

-- 8. Row Level Security (RLS) untuk Tahap MVP / Uji Coba
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdraws ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all anon app_settings" ON public.app_settings;
CREATE POLICY "Allow all anon app_settings"
  ON public.app_settings FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all anon drivers" ON public.drivers;
CREATE POLICY "Allow all anon drivers"
  ON public.drivers FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all anon orders" ON public.orders;
CREATE POLICY "Allow all anon orders"
  ON public.orders FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all anon withdraws" ON public.withdraws;
CREATE POLICY "Allow all anon withdraws"
  ON public.withdraws FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);
