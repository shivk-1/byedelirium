-- Create patients table for authentication
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  profile_picture_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read patient data (for login verification)
CREATE POLICY "Anyone can read patients"
ON public.patients
FOR SELECT
USING (true);

-- Create index for faster patient_id lookups
CREATE INDEX idx_patients_patient_id ON public.patients(patient_id);

-- Insert test patient data
INSERT INTO public.patients (patient_id, first_name, last_name, profile_picture_url)
VALUES ('1234567890', 'John', 'Doe', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop');