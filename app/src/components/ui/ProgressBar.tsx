interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'gold' | 'green' | 'seafoam';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  className = '',
  size = 'md',
  color = 'gold',
  showLabel = false,
  label,
  animated = false,
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const heights = { sm: 'h-1', md: 'h-1.5', lg: 'h-2' };

  const fillColor = {
    gold: 'var(--gold)',
    green: 'var(--green-signal)',
    seafoam: 'var(--seafoam)',
  }[color];

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-xs font-medium tabular-nums" style={{ color: fillColor }}>
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full rounded-full overflow-hidden ${heights[size]}`}
        style={{ background: 'rgba(255, 255, 255, 0.07)' }}
      >
        <div
          className={`${heights[size]} rounded-full transition-all duration-700 ease-out ${animated ? 'progress-striped' : ''}`}
          style={{ width: `${percentage}%`, background: fillColor }}
        />
      </div>
    </div>
  );
}
