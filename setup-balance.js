const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) env[key.trim()] = vals.join('=').trim();
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
const hdrs = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

async function run() {
  // Create user_balances table via SQL
  const createSQL = `
    CREATE TABLE IF NOT EXISTS public.user_balances (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      email text UNIQUE NOT NULL,
      balance integer DEFAULT 0,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
    ALTER TABLE public.user_balances ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Allow service role full access" ON public.user_balances FOR ALL USING (true);

    CREATE TABLE IF NOT EXISTS public.balance_transactions (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      email text NOT NULL,
      amount integer NOT NULL,
      type text,
      description text,
      created_at timestamptz DEFAULT now()
    );
    ALTER TABLE public.balance_transactions ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Allow service role full access" ON public.balance_transactions FOR ALL USING (true);
  `;

  console.log('Creating tables via SQL...');
  const sqlRes = await fetch(`${url}/rest/v1/rpc/`, {
    method: 'POST',
    headers: hdrs,
    body: JSON.stringify({ query: createSQL })
  });
  console.log('SQL status:', sqlRes.status);
