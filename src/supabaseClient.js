// Supabase client setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Simple fetch-based Supabase client
export const supabase = {
  from: (table) => ({
    select: (columns = '*') => ({
      eq: (column, value) => ({
        single: async () => {
          const response = await fetch(
            `${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}&select=${columns}`,
            {
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`
              }
            }
          );
          const data = await response.json();
          return { data: data[0], error: null };
        }
      })
    }),
    insert: (values) => ({
      select: () => ({
        single: async () => {
          const response = await fetch(
            `${supabaseUrl}/rest/v1/${table}`,
            {
              method: 'POST',
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
              },
              body: JSON.stringify(values)
            }
          );
          const data = await response.json();
          return { data: data[0], error: null };
        }
      })
    })
  })
};
