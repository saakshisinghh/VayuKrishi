function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}
function getColor(name: string) {
  const colors = ["#2d6a4f", "#1e6091", "#6a2d50", "#5a4d2d", "#2d4f6a"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash * 31;
  return colors[Math.abs(hash) % colors.length];
}

interface UserAvatarProps {
  name: string;
  src?: string;
  size?: number;
}

export function UserAvatar({ name, src, size = 32 }: UserAvatarProps) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} width={size} height={size} style={{ borderRadius: "50%", objectFit: "cover" }} />;
  }
  return (
    <div
      aria-label={name}
      style={{
        width: size, height: size, borderRadius: "50%",
        background: getColor(name), color: "#fff",
        fontSize: size * 0.38, fontWeight: 700,
        fontFamily: "'Sora', sans-serif",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, userSelect: "none",
      }}
    >
      {getInitials(name)}
    </div>
  );
}
