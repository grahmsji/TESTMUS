import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile, Service, FamilyMember, ServiceRequest } from '../lib/supabase';

// Hook pour les services
export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const createService = async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([service])
        .select()
        .single();

      if (error) throw error;
      setServices(prev => [...prev, data]);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setServices(prev => prev.map(s => s.id === id ? data : s));
      return data;
    } catch (err) {
      throw err;
    }
  };

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
    createService,
    updateService,
    deleteService
  };
}

// Hook pour les membres de famille
export function useFamilyMembers() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .order('first_name');

      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const createMember = async (member: Omit<FamilyMember, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .insert([member])
        .select()
        .single();

      if (error) throw error;
      setMembers(prev => [...prev, data]);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateMember = async (id: string, updates: Partial<FamilyMember>) => {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setMembers(prev => prev.map(m => m.id === id ? data : m));
      return data;
    } catch (err) {
      throw err;
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return {
    members,
    loading,
    error,
    refetch: fetchMembers,
    createMember,
    updateMember,
    deleteMember
  };
}

// Hook pour les demandes de service
export function useServiceRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          service:services(*),
          beneficiary:family_members(*),
          user:profiles(*)
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (request: Omit<ServiceRequest, 'id' | 'status' | 'submitted_at' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .insert([request])
        .select(`
          *,
          service:services(*),
          beneficiary:family_members(*),
          user:profiles(*)
        `)
        .single();

      if (error) throw error;
      setRequests(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateRequest = async (id: string, updates: Partial<ServiceRequest>) => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .update({
          ...updates,
          processed_at: updates.status && updates.status !== 'pending' ? new Date().toISOString() : undefined
        })
        .eq('id', id)
        .select(`
          *,
          service:services(*),
          beneficiary:family_members(*),
          user:profiles(*)
        `)
        .single();

      if (error) throw error;
      setRequests(prev => prev.map(r => r.id === id ? data : r));
      return data;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests,
    createRequest,
    updateRequest
  };
}

// Hook pour les profils utilisateurs (admin)
export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (id: string, updates: Partial<Profile>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setProfiles(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return {
    profiles,
    loading,
    error,
    refetch: fetchProfiles,
    updateProfile
  };
}

// Hook pour les statistiques du dashboard
export function useDashboardStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Récupérer les statistiques en parallèle
      const [
        { count: totalMembers },
        { count: pendingRequests },
        { count: processedRequests },
        { count: monthlyRequests }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'member'),
        supabase.from('service_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('service_requests').select('*', { count: 'exact', head: true }).neq('status', 'pending'),
        supabase.from('service_requests').select('*', { count: 'exact', head: true })
          .gte('submitted_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      ]);

      setStats({
        totalMembers: totalMembers || 0,
        pendingRequests: pendingRequests || 0,
        processedRequests: processedRequests || 0,
        monthlyRequests: monthlyRequests || 0
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
}