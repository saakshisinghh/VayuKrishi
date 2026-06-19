import Link from "next/link";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <main style={{ minHeight: "100vh", background: "#1a3d2b", color: "#fff", fontFamily: "'Georgia', serif", overflowX: "hidden" }}>

      {/* Top bar */}
      <div style={{ background: "rgba(0,0,0,0.3)", padding: "11px 3rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ fontSize: "11px", letterSpacing: "3.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: "system-ui, sans-serif" }}>
          Serving 2.4 lakh farmers &nbsp;·&nbsp; 18 states &nbsp;·&nbsp; 6 languages &nbsp;·&nbsp; 94% accuracy
        </span>
      </div>

      {/* Navbar */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.75rem 4rem", maxWidth: "1300px", margin: "0 auto", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div>
          <div style={{ fontSize: "26px", fontWeight: "700", letterSpacing: "-0.5px", lineHeight: 1 }}>Vayukrishi</div>
          <div style={{ fontSize: "10px", letterSpacing: "3.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontFamily: "system-ui, sans-serif", marginTop: "5px" }}>Predict · Protect · Prosper</div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link href={`/${locale}/login`} style={{ padding: "10px 24px", fontSize: "13px", color: "rgba(255,255,255,0.65)", textDecoration: "none", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)", fontFamily: "system-ui, sans-serif" }}>
            Sign in
          </Link>
          <Link href={`/${locale}/register`} style={{ padding: "10px 24px", fontSize: "13px", background: "#c8a96e", color: "#1a3d2b", textDecoration: "none", borderRadius: "6px", fontWeight: "700", fontFamily: "system-ui, sans-serif" }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: "1300px", margin: "0 auto", padding: "7rem 4rem 5rem", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "5rem", alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "2rem" }}>
            <div style={{ width: "28px", height: "1px", background: "#c8a96e" }} />
            <span style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#c8a96e", fontFamily: "system-ui, sans-serif" }}>AI-Powered Agriculture</span>
          </div>
          <h1 style={{ fontSize: "clamp(3rem, 5vw, 5rem)", fontWeight: "700", lineHeight: "1.05", letterSpacing: "-2px", marginBottom: "2rem" }}>
            The intelligent<br />platform for<br />
            <em style={{ fontStyle: "italic", color: "#c8a96e" }}>Indian farmers.</em>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.55)", lineHeight: "1.9", marginBottom: "3rem", maxWidth: "440px", fontFamily: "system-ui, sans-serif", fontWeight: "300" }}>
            Crop health, market intelligence, disease detection, and government schemes — all powered by AI, in your language.
          </p>
          <div style={{ display: "flex", gap: "14px" }}>
            <Link href={`/${locale}/register`} style={{ padding: "14px 32px", background: "#c8a96e", color: "#1a3d2b", textDecoration: "none", borderRadius: "6px", fontWeight: "700", fontSize: "14px", fontFamily: "system-ui, sans-serif" }}>
              Start for free →
            </Link>
            <Link href={`/${locale}/login`} style={{ padding: "14px 32px", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", textDecoration: "none", borderRadius: "6px", fontSize: "14px", fontFamily: "system-ui, sans-serif" }}>
              Sign in
            </Link>
          </div>
          <div style={{ display: "flex", gap: "3rem", marginTop: "3.5rem", paddingTop: "3rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {[{ value: "2.4L+", label: "Farmers" }, { value: "18", label: "States" }, { value: "94%", label: "Accuracy" }, { value: "6", label: "Languages" }].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: "1.75rem", fontWeight: "700", letterSpacing: "-0.5px" }}>{s.value}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "3px", fontFamily: "system-ui, sans-serif", letterSpacing: "0.5px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Testimonial + What you get */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ background: "rgba(200,169,110,0.08)", border: "1px solid rgba(200,169,110,0.2)", borderRadius: "14px", padding: "2rem" }}>
            <div style={{ fontSize: "32px", color: "#c8a96e", lineHeight: 1, marginBottom: "0.75rem" }}>"</div>
            <p style={{ fontSize: "15px", lineHeight: "1.9", color: "rgba(255,255,255,0.75)", margin: "0 0 1.25rem", fontStyle: "italic" }}>
              Vayukrishi ने मेरी फसल की पैदावार 40% बढ़ा दी। अब मैं सही समय पर बाज़ार में बेच पाता हूँ।
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#2d5a3d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontFamily: "system-ui, sans-serif", fontWeight: "600", color: "#c8a96e" }}>RP</div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", fontFamily: "system-ui, sans-serif" }}>Ramesh Patel</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "system-ui, sans-serif" }}>Vidarbha, Maharashtra</div>
              </div>
            </div>
          </div>

          {/* What you get card */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "1.75rem" }}>
            <p style={{ fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontFamily: "system-ui, sans-serif", marginBottom: "1.25rem" }}>What you get</p>
            {[
              { label: "Crop disease alerts", sub: "Real-time AI detection" },
              { label: "Mandi price forecasts", sub: "7-day predictions" },
              { label: "Scheme eligibility", sub: "Auto-matched to your profile" },
              { label: "Voice in your language", sub: "Hindi, Marathi, Tamil + more" },
            ].map((item, i) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <div>
                  <div style={{ fontSize: "13px", fontFamily: "system-ui, sans-serif", color: "rgba(255,255,255,0.8)", fontWeight: "500" }}>{item.label}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "system-ui, sans-serif", marginTop: "2px" }}>{item.sub}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7.5" stroke="rgba(200,169,110,0.4)"/><path d="M5 8l2 2 4-4" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "5rem 4rem", background: "rgba(0,0,0,0.2)" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          <div style={{ marginBottom: "3.5rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
              <div style={{ width: "28px", height: "1px", background: "#c8a96e" }} />
              <span style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#c8a96e", fontFamily: "system-ui, sans-serif" }}>Platform</span>
            </div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: "700", letterSpacing: "-1px", margin: 0 }}>Everything a farmer needs.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              {
                title: "Crop health monitoring",
                desc: "AI analysis of your farm with real-time disease alerts and personalised treatment recommendations.",
                tag: "AI",
                icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 4C14 4 8 9 8 15a6 6 0 0012 0c0-6-6-11-6-11z" stroke="#c8a96e" strokeWidth="1.5" strokeLinejoin="round"/><path d="M14 15v7" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 12l4 3" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round"/></svg>
              },
              {
                title: "Live market prices",
                desc: "Current mandi rates and 7-day price forecasts for 200+ crops across all major markets.",
                tag: "Real-time",
                icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M4 20l6-6 4 4 10-10" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 8h6v6" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              },
              {
                title: "Disease detection",
                desc: "Upload a photo and get instant disease identification with treatment advice in seconds.",
                tag: "94% accuracy",
                icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="13" cy="13" r="7" stroke="#c8a96e" strokeWidth="1.5"/><path d="M18 18l5 5" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 13h6M13 10v6" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round"/></svg>
              },
              {
                title: "Government schemes",
                desc: "Discover PM-KISAN, crop insurance, and subsidies — with eligibility checks and direct apply links.",
                tag: "500+ schemes",
                icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="5" y="7" width="18" height="16" rx="2" stroke="#c8a96e" strokeWidth="1.5"/><path d="M9 12h10M9 16h7" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round"/><path d="M9 5v4M19 5v4" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round"/></svg>
              },
              {
                title: "Smart crop planner",
                desc: "Season-aware planning with task reminders, weather integration, and yield predictions.",
                tag: "Seasonal",
                icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="6" width="20" height="18" rx="2" stroke="#c8a96e" strokeWidth="1.5"/><path d="M4 11h20" stroke="#c8a96e" strokeWidth="1.5"/><path d="M9 4v4M19 4v4" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round"/><rect x="8" y="15" width="4" height="4" rx="1" fill="#c8a96e" opacity="0.6"/><rect x="16" y="15" width="4" height="4" rx="1" fill="#c8a96e" opacity="0.3"/></svg>
              },
              {
                title: "Voice assistant",
                desc: "Ask farming questions in Hindi, Marathi, Tamil, Gujarati, Kannada, or English.",
                tag: "6 languages",
                icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="10" y="3" width="8" height="14" rx="4" stroke="#c8a96e" strokeWidth="1.5"/><path d="M5 15a9 9 0 0018 0" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round"/><path d="M14 24v-4" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round"/></svg>
              },
            ].map((f) => (
              <div key={f.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                  {f.icon}
                  <span style={{ fontSize: "11px", background: "rgba(200,169,110,0.12)", color: "#c8a96e", border: "1px solid rgba(200,169,110,0.2)", borderRadius: "100px", padding: "3px 12px", fontFamily: "system-ui, sans-serif" }}>{f.tag}</span>
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "0.6rem", letterSpacing: "-0.2px" }}>{f.title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: "1.8", margin: 0, fontFamily: "system-ui, sans-serif", fontWeight: "300" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: "1300px", margin: "0 auto", padding: "7rem 4rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <div style={{ width: "28px", height: "1px", background: "#c8a96e" }} />
            <span style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#c8a96e", fontFamily: "system-ui, sans-serif" }}>Get started</span>
          </div>
          <h2 style={{ fontSize: "3rem", fontWeight: "700", letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "1.5rem" }}>
            Ready to farm<br /><em style={{ color: "#c8a96e" }}>smarter?</em>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", lineHeight: "1.9", fontFamily: "system-ui, sans-serif", fontWeight: "300", maxWidth: "380px" }}>
            Join 2.4 lakh farmers already using Vayukrishi to increase yields, reduce losses, and access better markets.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link href={`/${locale}/register`} style={{ padding: "18px 32px", background: "#c8a96e", color: "#1a3d2b", textDecoration: "none", borderRadius: "10px", fontWeight: "700", fontSize: "15px", fontFamily: "system-ui, sans-serif", textAlign: "center" }}>
            Create free account →
          </Link>
          <Link href={`/${locale}/login`} style={{ padding: "18px 32px", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)", textDecoration: "none", borderRadius: "10px", fontSize: "15px", fontFamily: "system-ui, sans-serif", textAlign: "center" }}>
            Already have an account? Sign in
          </Link>
        </div>
      </section>

      {/* Footer */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "2rem 4rem", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1300px", margin: "0 auto" }}>
        <div>
          <div style={{ fontSize: "16px", fontWeight: "700" }}>Vayukrishi</div>
          <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", fontFamily: "system-ui, sans-serif", marginTop: "3px" }}>Predict · Protect · Prosper</div>
        </div>
        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.2)", fontFamily: "system-ui, sans-serif" }}>© 2026 Vayukrishi · Built for Indian Farmers</span>
      </div>
    </main>
  );
}