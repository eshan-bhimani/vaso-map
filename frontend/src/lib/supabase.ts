import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wqjyrqoipwfxkkumofnr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxanlycW9pcHdmeGtrdW1vZm5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNzcyNDMsImV4cCI6MjA5MDY1MzI0M30.gzUPjrVJR2CAAkcMnbw_LYCA9K7Gu-aZkVtCCkdGLm8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
