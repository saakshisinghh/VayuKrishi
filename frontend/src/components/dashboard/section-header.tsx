'use client';
interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div>
        <h2 className="section-header__title">{title}</h2>
        {description && <p className="section-header__desc">{description}</p>}
      </div>
      {action && <div>{action}</div>}
      <style jsx>{`
        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 14px;
          gap: 12px;
        }
        .section-header__title {
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
          letter-spacing: -0.2px;
        }
        .section-header__desc {
          font-size: 13px;
          color: var(--color-text-muted);
          margin: 2px 0 0;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>
    </div>
  );
}
