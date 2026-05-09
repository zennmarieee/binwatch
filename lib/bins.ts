import { supabase } from "./supabase";

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

export async function getBins(): Promise<Bin[]> {
  const { data, error } = await supabase
    .from("bins")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching bins:", error);
    return [];
  }

  return data as Bin[];
}