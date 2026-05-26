'use client';

import { motion } from 'framer-motion';

interface CountdownRingProps {
  timeLeft: number;
  totalDuration?: number;
  isActive?: boolean;
}

export default function CountdownRing({ timeLeft, totalDuration = 120, isActive = false }: CountdownRingProps) {
  const percentage = Math.max(0, Math.min(100, (timeLeft / totalDuration) * 100));

  // radius=96 → SVG is exactly 192×192
  const radius = 96;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let strokeColor = '#6366f1';
  let glowColor = 'rgba(99, 102, 241, 0.3)';
  if (timeLeft <= 30) {
    strokeColor = '#ef4444';
    glowColor = 'rgba(239, 68, 68, 0.4)';
  } else if (timeLeft <= 60) {
    strokeColor = '#f59e0b';
    glowColor = 'rgba(245, 158, 11, 0.3)';
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    // Fixed 192×192 box — same dimensions as SiriVisualizer
    <div style={{ position: 'relative', width: 192, height: 192, flexShrink: 0 }}>

      {/* SVG ring — pinned to top-left, exactly 192×192 */}
      <svg
        width={radius * 2}
        height={radius * 2}
        style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
        className="select-none drop-shadow-md"
      >
        {/* Track circle */}
        <circle
          stroke="rgba(15, 23, 42, 0.05)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress arc */}
        <motion.circle
          stroke={strokeColor}
          fill="transparent"
          strokeWidth={stroke + 1}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          animate={{ stroke: strokeColor }}
          transition={{ duration: 0.5 }}
        />
        {/* Orbital dashed ring when playing */}
        {isActive && (
          <circle
            stroke={strokeColor}
            fill="transparent"
            strokeWidth={1}
            strokeDasharray="6 8"
            r={normalizedRadius + 6}
            cx={radius}
            cy={radius}
            className="orbit-ring-spin opacity-40"
            style={{ transition: 'stroke 0.5s ease-in-out' }}
          />
        )}
      </svg>

      {/* Timer pill — centred horizontally, below the ring */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: -18,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255,255,255,0.88)',
          borderColor: strokeColor + '40',
          color: strokeColor,
          boxShadow: `0 4px 12px ${glowColor}`,
          border: '1px solid',
          borderRadius: 999,
          padding: '3px 10px',
          fontSize: 12,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(8px)',
        }}
        animate={timeLeft <= 15 ? { scale: [1, 1.08, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        <span
          style={{
            width: 8, height: 8, borderRadius: '50%',
            background: timeLeft <= 30 ? '#ef4444' : timeLeft <= 60 ? '#f59e0b' : '#6366f1',
            display: 'inline-block',
          }}
          className={timeLeft <= 30 ? 'animate-ping' : ''}
        />
        <span className="font-mono tracking-wide" style={{ fontSize: 13 }}>{formattedTime}</span>
      </motion.div>
    </div>
  );
}
