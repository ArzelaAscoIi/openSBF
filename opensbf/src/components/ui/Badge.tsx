interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'green' | 'red' | 'blue' | 'muted';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'muted', size = 'sm', className = '' }: BadgeProps) {
  const variants = {
    gold: { background: 'rgba(200, 169, 81, 0.15)', color: 'var(--gold)', border: '1px solid rgba(200, 169, 81, 0.3)' },
    green: { background: 'rgba(76, 175, 130, 0.15)', color: 'var(--green-signal)', border: '1px solid rgba(76, 175, 130, 0.3)' },
    red: { background: 'rgba(224, 82, 82, 0.15)', color: 'var(--red-signal)', border: '1px solid rgba(224, 82, 82, 0.3)' },
    blue: { background: 'rgba(78, 184, 184, 0.15)', color: 'var(--seafoam)', border: '1px solid rgba(78, 184, 184, 0.3)' },
    muted: { background: 'rgba(143, 168, 200, 0.1)', color: 'var(--muted)', border: '1px solid rgba(143, 168, 200, 0.2)' },
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizes[size]} ${className}`}
      style={variants[variant]}
    >
      {children}
    </span>
  );
}
