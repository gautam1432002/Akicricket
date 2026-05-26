'use client';

// Pure CSS animations — no framer-motion polling, no JS timers.
// All animations run 100% on the compositor thread (60fps, zero JS overhead).

interface SiriVisualizerProps {
  mood?: string;
  loading: boolean;
}

export default function SiriVisualizer({ loading }: SiriVisualizerProps) {
  return (
    /* Fixed 192×192 container — matches CountdownRing SVG size exactly */
    <div
      style={{ position: 'relative', width: 192, height: 192, flexShrink: 0 }}
      aria-hidden="true"
    >
      {/* ── Conic outer glow ring (CSS spin) ───────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          width: 192,
          height: 192,
          top: 0,
          left: 0,
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      >
        <div className="siri-glow-ring" />
      </div>

      {/* ── Gradient blob (CSS morph + scale) ──────────────────────────── */}
      <div
        className={`siri-blob${loading ? ' active' : ''}`}
        style={{
          position: 'absolute',
          width: 150,
          height: 150,
          top: '50%',
          left: '50%',
          marginTop: -75,
          marginLeft: -75,
          zIndex: 1,
        }}
      />

      {/* ── White glassmorphic disk (CSS pulse when thinking) ──────────── */}
      <div
        className={`siri-disk${loading ? ' thinking' : ''}`}
        style={{
          position: 'absolute',
          width: 130,
          height: 130,
          top: '50%',
          left: '50%',
          marginTop: -65,
          marginLeft: -65,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.93)',
          boxShadow:
            '0 6px 28px rgba(99,102,241,0.10), 0 1.5px 6px rgba(0,0,0,0.05)',
          border: '1.5px solid rgba(255,255,255,0.75)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          overflow: 'hidden',
        }}
      >
        {/* Gloss sheen */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background:
              'linear-gradient(155deg, rgba(255,255,255,0.55) 0%, transparent 55%)',
            pointerEvents: 'none',
          }}
        />

        {/* Logo — CSS spin when loading, gentle breathe when idle */}
        <img
          src="/aki-logo.png"
          alt="Aki"
          className={loading ? 'aki-logo-thinking' : 'aki-logo-idle'}
          style={{
            width: 68,
            height: 68,
            objectFit: 'contain',
            position: 'relative',
            zIndex: 1,
            userSelect: 'none',
            filter: 'drop-shadow(0 2px 5px rgba(99,102,241,0.22))',
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}
