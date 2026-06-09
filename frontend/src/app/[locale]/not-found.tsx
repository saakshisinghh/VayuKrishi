export default function NotFound() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 48, fontWeight: 700, margin: 0 }}>404</h1>
        <p style={{ color: "#666" }}>Page not found</p>
        <a href="/" style={{ color: "#2d6a4f" }}>Go home</a>
      </div>
    </div>
  );
}
