// ============================================================
// MOCK DATA — Development Reference Only
// This file is no longer used by the map or any live feature.
// Real bin data lives in Supabase → public.bins
// ============================================================

export interface Bin {
  id: string;
  name: string;
  location_name: string;
  lat: number;
  lng: number;
  status: "no_active_report" | "pending" | "in_progress" | "resolved";
  is_active: boolean;
  resolved_at: string | null;
  created_at: string;
}