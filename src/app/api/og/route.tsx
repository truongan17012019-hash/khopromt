import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "PromptVN";
  const desc = searchParams.get("desc") || "Kho Prompt AI hàng đầu Việt Nam";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #06b6d4 100%)",
          padding: "60px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,0.8)", marginBottom: 16, display: "flex" }}>
            PromptVN
          </div>
          <div style={{ fontSize: 52, fontWeight: 800, color: "white", marginBottom: 20, lineHeight: 1.2, display: "flex", maxWidth: 900 }}>
            {title}
          </div>
          <div style={{ fontSize: 24, color: "rgba(255,255,255,0.7)", display: "flex", maxWidth: 700 }}>
            {desc}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 40, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", display: "flex" }}>
            khopromt.pro
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
