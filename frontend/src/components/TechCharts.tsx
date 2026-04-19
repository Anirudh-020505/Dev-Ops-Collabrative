// Sparkline / mini chart components — pure SVG, no library dependency

export function Sparkline({
  data,
  color = "var(--plasma)",
  height = 36,
  width = 120,
  showMarkers = true,
}: {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  showMarkers?: boolean;
}) {
  if (data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((v, i) => [i * step, height - ((v - min) / range) * height] as const);
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area =
    `M0,${height} ` +
    points.map(([x, y]) => `L${x.toFixed(1)},${y.toFixed(1)}`).join(" ") +
    ` L${width},${height} Z`;

  const id = `g-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <svg width={width} height={height} className="block">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.4} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* baseline ticks */}
      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={0}
          x2={width}
          y1={height * t}
          y2={height * t}
          stroke="var(--grid-line)"
          strokeDasharray="2 4"
          strokeWidth={0.5}
        />
      ))}
      <path d={area} fill={`url(#${id})`} />
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} />
      {showMarkers && (
        <circle
          cx={points[points.length - 1][0]}
          cy={points[points.length - 1][1]}
          r={2.5}
          fill={color}
        />
      )}
    </svg>
  );
}

export function Gauge({
  value,
  max = 100,
  label,
  unit = "%",
  color = "var(--plasma)",
  size = 88,
}: {
  value: number;
  max?: number;
  label?: string;
  unit?: string;
  color?: string;
  size?: number;
}) {
  const pct = Math.min(1, Math.max(0, value / max));
  const radius = size / 2 - 8;
  const circumference = Math.PI * radius; // half-circle
  const offset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-1" style={{ width: size }}>
      <svg width={size} height={size / 2 + 8} viewBox={`0 0 ${size} ${size / 2 + 8}`}>
        <path
          d={`M ${size / 2 - radius} ${size / 2} A ${radius} ${radius} 0 0 1 ${size / 2 + radius} ${size / 2}`}
          fill="none"
          stroke="var(--grid-line)"
          strokeWidth={4}
        />
        <path
          d={`M ${size / 2 - radius} ${size / 2} A ${radius} ${radius} 0 0 1 ${size / 2 + radius} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="square"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
        {/* tick marks */}
        {Array.from({ length: 9 }).map((_, i) => {
          const a = Math.PI + (i / 8) * Math.PI;
          const x1 = size / 2 + Math.cos(a) * (radius + 3);
          const y1 = size / 2 + Math.sin(a) * (radius + 3);
          const x2 = size / 2 + Math.cos(a) * (radius + 6);
          const y2 = size / 2 + Math.sin(a) * (radius + 6);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--muted-foreground)"
              strokeWidth={0.7}
            />
          );
        })}
      </svg>
      <div className="-mt-3 text-center">
        <div className="font-mono text-base font-semibold tabular-nums" style={{ color }}>
          {value.toFixed(0)}
          <span className="ml-0.5 text-[10px] text-muted-foreground">{unit}</span>
        </div>
        {label && (
          <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
        )}
      </div>
    </div>
  );
}

export function Bar({
  value,
  max = 100,
  color = "var(--plasma)",
  height = 6,
}: {
  value: number;
  max?: number;
  color?: string;
  height?: number;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div
      className="relative w-full bg-muted overflow-hidden"
      style={{ height }}
    >
      <div
        className="h-full transition-all"
        style={{
          width: `${pct}%`,
          background: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
      {/* segments overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 6px, rgba(0,0,0,0.4) 6px 7px)",
        }}
      />
    </div>
  );
}
