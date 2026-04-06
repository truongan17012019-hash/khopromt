const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  "https://gmiyqfzieuohbxpgrngm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtaXlxZnppZXVvaGJ4cGdybmdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk0OTQwNSwiZXhwIjoyMDkwNTI1NDA1fQ.SdsEkH1Iul8syUfdA3b2QDEG7Xw9zcxg68-u408vtD0"
);
async function main() {
  const tables = ["orders","order_items","user_purchases","prompts","order_review_logs","coupons"];
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select("*").limit(1);
    console.log(t + ":", error ? "NOT FOUND" : "EXISTS");
  }
}
main();
