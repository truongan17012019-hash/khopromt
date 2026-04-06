const { createClient } = require('@supabase/supabase-js');
const s = createClient(
  'https://gmiyqfzieuohbxpgrngm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtaXlxZnppZXVvaGJ4cGdybmdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk0OTQwNSwiZXhwIjoyMDkwNTI1NDA1fQ.SdsEkH1Iul8syUfdA3b2QDEG7Xw9zcxg68-u408vtD0'
);

(async () => {
  // Simulate what /api/user/balance does
  const email = "demo123@gmail.com";
  const key = email.trim().toLowerCase();

  // Step 1: Read user_balances
  const { data } = await s.from('app_settings').select('value').eq('key', 'user_balances').single();
  let raw = data?.value;
  console.log('Raw value type:', typeof raw);
  console.log('Raw value (first 200 chars):', JSON.stringify(raw).slice(0, 200));
  
  if (typeof raw === 'string') { try { raw = JSON.parse(raw); } catch { raw = {}; } }
  const balances = (raw && typeof raw === 'object') ? raw : {};
  let balance = Number(balances[key]) || 0;
  console.log('\nBalance from user_balances map:', balance);

  // Step 2: Read transactions
  const { data: txData } = await s.from('app_settings').select('value').eq('key', 'balance_transactions').single();
  let txRaw = txData?.value;
  console.log('\nTx raw type:', typeof txRaw);
  if (typeof txRaw === 'string') { try { txRaw = JSON.parse(txRaw); } catch { txRaw = []; } }
  const allTx = Array.isArray(txRaw) ? txRaw : [];
  const userTx = allTx.filter(tx => tx.email === key).slice(-50).reverse();
  
  console.log('User transactions count:', userTx.length);
  if (userTx.length > 0) {
    console.log('Newest tx (userTx[0]):', JSON.stringify(userTx[0]));
    const newest = userTx[0];
    const txBalance = Number(newest?.balance_after);
    console.log('txBalance from newest:', txBalance, 'isFinite:', Number.isFinite(txBalance));
    if (Number.isFinite(txBalance)) {
      balance = txBalance;
    }
  }
  
  console.log('\n=== FINAL balance returned by API:', balance);
})();
