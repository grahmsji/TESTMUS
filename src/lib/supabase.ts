import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour TypeScript
export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  nip: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  role: 'admin' | 'member';
  status: 'active' | 'suspended';
  first_login: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  max_amount: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FamilyMember {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  nip: string;
  relationship: string;
  birth_date: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceRequest {
  id: string;
  user_id: string;
  service_id: string;
  beneficiary_id?: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_comments?: string;
  submitted_at: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
  // Relations
  service?: Service;
  beneficiary?: FamilyMember;
  user?: Profile;
}

export interface Document {
  id: string;
  user_id: string;
  family_member_id?: string;
  service_request_id?: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}