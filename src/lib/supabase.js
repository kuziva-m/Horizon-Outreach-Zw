import { createClient } from "@supabase/supabase-js";

// Replace these with your actual Supabase URL and Key
// Found in: Supabase Dashboard -> Project Settings -> API
const supabaseUrl = "https://gwdsfhonkhhtkbwscepq.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3ZHNmaG9ua2hodGtid3NjZXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NTU4MzEsImV4cCI6MjA4MzEzMTgzMX0.0y2nn-fBXbjAlPB7qrsZoykdNJ5GyNHlLFIK2vkojrY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
