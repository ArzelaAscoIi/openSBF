interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'green' | 'red' | 'blue' | 'muted';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'muted', size = 'sm', className = '' }: BadgeProps) {
  const variants: Record<string, React.CSSProperties> = {
    gold:  { background: 'rgba(188, 147, 50, 0.12)', color: 'var(--gold)',         border: '1px solid rgba(188, 147, 50, 0.25)' },
    green: { background: 'rgba(18, 184, 112, 0.12)', color: 'var(--green-signal)', border: '1px solid rgba(18, 184, 112, 0.25)' },
    red:   { background: 'rgba(232, 68, 68, 0.12)',  color: 'var(--red-signal)',   border: '1px solid rgba(232, 68, 68, 0.25)' },
    blue:  { background: 'rgba(38, 136, 164, 0.12)', color: 'var(--seafoam)',      border: '1px solid rgba(38, 136, 164, 0.25)' },
    muted: { background: 'rgba(255, 255, 255, 0.06)', color: 'var(--muted)',       border: '1px solid var(--border)' },
  };

  const sizes = { sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-sm' };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded font-medium ${sizes[size]} ${className}`}
      style={variants[variant]}
    >
      {children}
    </span>
  );
}
