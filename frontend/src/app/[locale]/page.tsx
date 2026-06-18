import Link from "next/link";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <main style={{ minHeight: "100vh", background: "#1a3d2b", color: "#fff", fontFamily: "'Georgia', serif", overflowX: "hidden" }}>

      {/* Top bar */}
      <div style={{ background: "rgba(0,0,0,0.2)", padding: "10px 3rem", textAlign: "center" }}>
        <span style={{ fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontFamily: "system-ui, sans-serif" }}>
          Now serving 2.4 lakh farmers across 18 states &nbsp;·&nbsp; Available in 6 languages
        </span>
      </div>

      {/* Navbar */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.75rem 4rem", maxWidth: "1300px", margin: "0 auto", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div>
          <div style={{ fontSize: "26px", fontWeight: "700", letterSpacing: "-0.5px", lineHeight: 1 }}>Vayukrishi</div>
          <div style={{ fontSize: "10px", letterSpacing: "3.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", fontFamily: "system-ui, sans-serif", marginTop: "4px" }}>Predict · Protect · Prosper</div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link href={`/${locale}/login`} style={{ padding: "10px 24px", fontSize: "13px", color: "rgba(255,255,255,0.75)", textDecoration: "none", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.2)", fontFamily: "system-ui, sans-serif", letterSpacing: "0.3px" }}>
            Sign in
          </Link>
          <Link href={`/${locale}/register`} style={{ padding: "10px 24px", fontSize: "13px", background: "#c8a96e", color: "#1a3d2b", textDecoration: "none", borderRadius: "6px", fontWeight: "700", fontFamily: "system-ui, sans-serif", letterSpacing: "0.3px" }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: "1300px", margin: "0 auto", padding: "7rem 4rem 5rem", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "5rem", alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "2rem" }}>
            <div style={{ width: "24px", height: "1px", background: "#c8a96e" }} />
            <span style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#c8a96e", fontFamily: "system-ui, sans-serif" }}>AI-Powered Agriculture</span>
          </div>
          <h1 style={{ fontSize: "clamp(3rem, 5vw, 5rem)", fontWeight: "700", lineHeight: "1.05", letterSpacing: "-2px", marginBottom: "2rem" }}>
            The intelligent<br />
            platform for<br />
            <em style={{ fontStyle: "italic", color: "#c8a96e" }}>Indian farmers.</em>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.6)", lineHeight: "1.9", marginBottom: "3rem", maxWidth: "440px", fontFamily: "system-ui, sans-serif", fontWeight: "300" }}>
            From crop health to market intelligence — Vayukrishi puts the power of AI in every farmer's hands, in their own language.
          </p>
          <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            <Link href={`/${locale}/register`} style={{ padding: "14px 32px", background: "#c8a96e", color: "#1a3d2b", textDecoration: "none", borderRadius: "6px", fontWeight: "700", fontSize: "14px", fontFamily: "system-ui, sans-serif", letterSpacing: "0.5px" }}>
              Start for free →
            </Link>
            <Link href={`/${locale}/login`} style={{ padding: "14px 32px", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", textDecoration: "none", borderRadius: "6px", fontWeight: "400", fontSize: "14px", fontFamily: "system-ui, sans-serif" }}>
              Sign in
            </Link>
          </div>
          <div style={{ display: "flex", gap: "2.5rem", marginTop: "3.5rem", paddingTop: "3rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            {[
              { value: "2.4L+", label: "Farmers" },
              { value: "18", label: "States" },
              { value: "94%", label: "Accuracy" },
              { value: "6", label: "Languages" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: "1.75rem", fontWeight: "700", letterSpacing: "-0.5px", color: "#fff" }}>{s.value}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "3px", fontFamily: "system-ui, sans-serif", letterSpacing: "0.5px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right card stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Testimonial */}
          <div style={{ background: "rgba(200,169,110,0.1)", border: "1px solid rgba(200,169,110,0.25)", borderRadius: "14px", padding: "2rem" }}>
            <div style={{ fontSize: "28px", color: "#c8a96e", marginBottom: "0.75rem", fontFamily: "Georgia, serif", lineHeight: 1 }}>"</div>
            <p style={{ fontSize: "15px", lineHeight: "1.8", color: "rgba(255,255,255,0.8)", margin: "0 0 1rem", fontStyle: "italic" }}>
              Vayukrishi ने मेरी फसल की पैदावार 40% बढ़ा दी। अब मैं सही समय पर बाज़ार में बेच पाता हूँ।
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#2d7a4f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontFamily: "system-ui, sans-serif", fontWeight: "600" }}>RP</div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", fontFamily: "system-ui, sans-serif" }}>Ramesh Patel</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "system-ui, sans-serif" }}>Vidarbha, Maharashtra</div>
              </div>
            </div>
          </div>

          {/* Live alert card */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80" }} />
              <span style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#4ade80", fontFamily: "system-ui, sans-serif" }}>Live · Market update</span>
            </div>
            {[
              { crop: "Wheat", price: "₹2,340/q", change: "+2.1%" },
              { crop: "Cotton", price: "₹6,890/q", change: "+0.8%" },
              { crop: "Soybean", price: "₹4,210/q", change: "-0.4%" },
            ].map((item) => (
              <div key={item.crop} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "14px", fontFamily: "system-ui, sans-serif", color: "rgba(255,255,255,0.8)" }}>{item.crop}</span>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "14px", fontWeight: "600", fontFamily: "system-ui, sans-serif" }}>{item.price}</div>
                  <div style={{ fontSize: "11px", color: item.change.startsWith("+") ? "#4ade80" : "#f87171", fontFamily: "system-ui, sans-serif" }}>{item.change}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "5rem 4rem", background: "rgba(0,0,0,0.25)" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "3.5rem" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
                <div style={{ width: "24px", height: "1px", background: "#c8a96e" }} />
                <span style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#c8a96e", fontFamily: "system-ui, sans-serif" }}>Platform features</span>
              </div>
              <h2 style={{ fontSize: "2.5rem", fontWeight: "700", letterSpacing: "-1px", margin: 0 }}>Everything a farmer needs.</h2>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { icon: "🌾", title: "Crop health monitoring", desc: "AI analysis with real-time disease alerts and personalised treatment recommendations.", tag: "AI" },
              { icon: "📊", title: "Live market prices", desc: "Current mandi rates and 7-day forecasts for 200+ crops across all major markets.", tag: "Real-time" },
              { icon: "🔬", title: "Disease detection", desc: "Upload a photo and get instant disease identification with treatment advice.", tag: "94% accuracy" },
              { icon: "📋", title: "Government schemes", desc: "PM-KISAN, crop insurance, and subsidies — discover every scheme you qualify for.", tag: "500+ schemes" },
              { icon: "🗓️", title: "Smart crop planner", desc: "Season-aware planning with task reminders, weather integration and yield estimates.", tag: "Seasonal" },
              { icon: "🎙️", title: "Voice assistant", desc: "Ask farming questions in Hindi, Marathi, Tamil, Gujarati, Kannada, or English.", tag: "6 languages" },
            ].map((f) => (
              <div key={f.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "2rem", transition: "background 0.2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: "28px" }}>{f.icon}</span>
                  <span style={{ fontSize: "11px", background: "rgba(200,169,110,0.15)", color: "#c8a96e", border: "1px solid rgba(200,169,110,0.25)", borderRadius: "100px", padding: "3px 12px", fontFamily: "system-ui, sans-serif", letterSpacing: "0.5px" }}>{f.tag}</span>
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "0.6rem", letterSpacing: "-0.2px" }}>{f.title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: "1.8", margin: 0, fontFamily: "system-ui, sans-serif", fontWeight: "300" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: "1300px", margin: "0 auto", padding: "7rem 4rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "1.5rem" }}>
            <div style={{ width: "24px", height: "1px", background: "#c8a96e" }} />
            <span style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#c8a96e", fontFamily: "system-ui, sans-serif" }}>Get started today</span>
          </div>
          <h2 style={{ fontSize: "3rem", fontWeight: "700", letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "1.5rem" }}>
            Ready to farm<br /><em style={{ fontStyle: "italic", color: "#c8a96e" }}>smarter?</em>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: "1.8", fontFamily: "system-ui, sans-serif", fontWeight: "300", maxWidth: "380px" }}>
            Join 2.4 lakh farmers already using Vayukrishi to increase yields, reduce losses, and access better markets.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link href={`/${locale}/register`} style={{ padding: "18px 32px", background: "#c8a96e", color: "#1a3d2b", textDecoration: "none", borderRadius: "10px", fontWeight: "700", fontSize: "15px", fontFamily: "system-ui, sans-serif", textAlign: "center", letterSpacing: "0.3px" }}>
            Create free account →
          </Link>
          <Link href={`/${locale}/login`} style={{ padding: "18px 32px", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.65)", textDecoration: "none", borderRadius: "10px", fontWeight: "400", fontSize: "15px", fontFamily: "system-ui, sans-serif", textAlign: "center" }}>
            Already have an account? Sign in
          </Link>
        </div>
      </section>

      {/* Footer */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "2rem 4rem", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1300px", margin: "0 auto" }}>
        <div>
          <div style={{ fontSize: "16px", fontWeight: "700" }}>Vayukrishi</div>
          <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontFamily: "system-ui, sans-serif", marginTop: "3px" }}>Predict · Protect · Prosper</div>
        </div>
        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)", fontFamily: "system-ui, sans-serif" }}>© 2026 Vayukrishi · Built for Indian Farmers</span>
      </div>
    </main>
  );
}
