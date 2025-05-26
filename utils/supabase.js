import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://wzmdqfpavmnipqujlhcr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bWRxZnBhdm1uaXBxdWpsaGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3ODc4NTUsImV4cCI6MjA1NzM2Mzg1NX0.jg5ezI5GaJOiRet5Q6Rew2hRGa3SM1Jj-bJxvFvVegg",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
