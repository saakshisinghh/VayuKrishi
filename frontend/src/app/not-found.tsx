import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.25rem",
        background: "#1a3d2b",
        color: "#fff",
        fontFamily: "'Georgia', serif",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <span
        style={{
          fontSize: "11px",
          letterSpacing: "3.5px",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Error 404
      </span>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, margin: 0 }}>
        This field hasn&apos;t been sown yet
      </h1>
      <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "32rem", fontFamily: "system-ui, sans-serif" }}>
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        style={{
          marginTop: "0.75rem",
          padding: "12px 28px",
          background: "#c8a96e",
          color: "#1a3d2b",
          textDecoration: "none",
          borderRadius: "6px",
          fontWeight: 700,
          fontSize: "14px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Back to home
      </Link>
    </main>
  );
}

