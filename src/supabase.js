import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseReady = Boolean(url && anonKey);

export const supabase = supabaseReady ? createClient(url, anonKey) : null;

// Adressen på selve appen (localhost under udvikling, GitHub Pages i drift). Bekræftelsesmailen sender brugeren hertil
export const appUrl = window.location.origin + import.meta.env.BASE_URL;
