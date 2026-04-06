const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) env[key.trim()] = vals.join('=').trim();
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

async function run() {
  console.log('Supabase URL:', url);

  // Get all users
  const usersRes = await fetch(`${url}/auth/v1/admin/users`, {
    headers: { 'Authorization': `Bearer ${key}`, 'apikey': key }
  });
  const usersData = await usersRes.json();
  const users = usersData.users || [];
  console.log('Total users:', users.length);
  users.forEach(u => console.log(' -', u.id, u.email, u.user_metadata?.name));

  // Check existing balances
  const balRes = await fetch(`${url}/rest/v1/user_balances?select=*`, {
    headers: { 'Authorization': `Bearer ${key}`, 'apikey': key }
  });
  const balances = await balRes.json();
  console.log('Balances:', JSON.stringify(balances, null, 2));
}

run().catch(console.error);
