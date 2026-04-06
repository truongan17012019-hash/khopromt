const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://gmiyqfzieuohbxpgrngm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtaXlxZnppZXVvaGJ4cGdybmdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk0OTQwNSwiZXhwIjoyMDkwNTI1NDA1fQ.SdsEkH1Iul8syUfdA3b2QDEG7Xw9zcxg68-u408vtD0"
);

async function main() {
  const userId = "truongan17012019@gmail.com";
  const orderId = "1e967c91-abb2-43b6-89de-2247e20ebcfa";
  const promptId = "mkt-2";

  // Insert user_purchases
  const { data, error } = await supabase
    .from("user_purchases")
    .upsert(
      { user_id: userId, prompt_id: promptId, order_id: orderId },
      { onConflict: "user_id,prompt_id" }
    );
  console.log("user_purchases:", error ? error.message : "OK");

  // Also insert order_items
  const { error: err2 } = await supabase
    .from("order_items")
    .upsert(
      { order_id: orderId, prompt_id: promptId, price: 89000 },
      { onConflict: "order_id,prompt_id" }
    );
  console.log("order_items:", err2 ? err2.message : "OK");
}

main();
