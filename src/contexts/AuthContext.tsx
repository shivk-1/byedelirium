import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Patient {
  id: string;
  patient_id: string;
  first_name: string;
  last_name: string;
  profile_picture_url: string | null;
}

interface AuthContextType {
  patient: Patient | null;
  login: (patientId: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedPatient = localStorage.getItem('patient');
    if (storedPatient) {
      setPatient(JSON.parse(storedPatient));
    }
    setIsLoading(false);
  }, []);

  const login = async (patientId: string, firstName: string, lastName: string) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('patient_id', patientId)
        .eq('first_name', firstName)
        .eq('last_name', lastName)
        .maybeSingle();

      if (error) {
        return { success: false, error: 'Login failed. Please try again.' };
      }

      if (!data) {
        return { success: false, error: 'Invalid credentials. Please check your ID and name.' };
      }

      setPatient(data);
      localStorage.setItem('patient', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred.' };
    }
  };

  const logout = () => {
    setPatient(null);
    localStorage.removeItem('patient');
  };

  return (
    <AuthContext.Provider value={{ patient, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
