import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(150deg, #05122B 0%, #0B2550 45%, #0A3D52 75%, #064040 100%)",
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: "white",
          padding: "60px",
        }}
      >
        <div style={{ fontSize: 28, color: "#00BFA0", marginBottom: 16, letterSpacing: 4 }}>MEDIT RD</div>
        <div style={{ fontSize: 52, fontWeight: 800, textAlign: "center", lineHeight: 1.2, marginBottom: 24 }}>
          Wheelchair-Accessible Transfers & Tours
        </div>
        <div style={{ fontSize: 26, color: "#a0bfd0", textAlign: "center" }}>
          Punta Cana · Santo Domingo · Dominican Republic
        </div>
        <div style={{ marginTop: 40, fontSize: 20, color: "#00BFA0" }}>
          Airport · Resorts · Tours · 24/7
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
