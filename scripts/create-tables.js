const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  "https://gmiyqfzieuohbxpgrngm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtaXlxZnppZXVvaGJ4cGdybmdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk0OTQwNSwiZXhwIjoyMDkwNTI1NDA1fQ.SdsEkH1Iul8syUfdA3b2QDEG7Xw9zcxg68-u408vtD0"
);

async function main() {
  // Create order_items table
  const sql1 = `
    CREATE TABLE IF NOT EXISTS order_items (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
      prompt_id text NOT NULL,
      price bigint DEFAULT 0,
      created_at timestamptz DEFAULT now(),
      UNIQUE(order_id, prompt_id)
    );
  `;

  // Create user_purchases table
  const sql2 = `
    CREATE TABLE IF NOT EXISTS user_purchases (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id text NOT NULL,
      prompt_id text NOT NULL,
      order_id uuid REFERENCES orders(id),
      created_at timestamptz DEFAULT now(),
      UNIQUE(user_id, prompt_id)
    );
  `;

  // Create coupons table
  const sql3 = `
    CREATE TABLE IF NOT EXISTS coupons (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      code text UNIQUE NOT NULL,
      discount_type text DEFAULT 'percent',
      discount_value bigint DEFAULT 0,
      min_order_amount bigint DEFAULT 0,
      max_uses int DEFAULT 0,
      used_count int DEFAULT 0,
      is_active boolean DEFAULT true,
      expires_at timestamptz,
      created_at timestamptz DEFAULT now()
    );
  `;

  for (const [name, sql] of [["order_items", sql1], ["user_purchases", sql2], ["coupons", sql3]]) {
    const { error } = await supabase.rpc("exec_sql", { sql_text: sql });
    if (error) {
      // Try raw POST to REST API as fallback
      const res = await fetch("https://gmiyqfzieuohbxpgrngm.supabase.co/rest/v1/rpc/exec_sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabase.supabaseKey,
          "Authorization": "Bearer " + supabase.supabaseKey,
        },
        body: JSON.stringify({ sql_text: sql }),
      });
      if (!res.ok) {
        console.log(name + ": FAILED via rpc - " + error.message);
      } else {
        console.log(name + ": CREATED via rpc fallback");
      }
    } else {
      console.log(name + ": CREATED");
    }
  }


  // Verify tables exist
  for (const t of ["order_items", "user_purchases", "coupons"]) {
    const { error } = await supabase.from(t).select("*").limit(1);
    console.log("Verify " + t + ":", error ? "NOT FOUND" : "OK");
  }
}
main();
