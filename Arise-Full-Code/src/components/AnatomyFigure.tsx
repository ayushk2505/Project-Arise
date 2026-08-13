import { motion } from "framer-motion";

interface AnatomyFigureProps {
  accentColor: string;
  pulse?: boolean; // pulses faster/brighter right after completing a protocol
}

// A procedurally-drawn wireframe human figure — pure SVG, no image asset.
// Deliberately not a literal anatomical reference; it's an abstract
// "scan" silhouette in the spirit of the reference mockup: joints as
// nodes, limbs as connecting lines, a faint ribcage/spine core, standing
// on a glowing platform ring.
export default function AnatomyFigure({ accentColor, pulse = false }: AnatomyFigureProps) {
  const stroke = accentColor;

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <svg viewBox="0 0 220 420" className="h-full max-h-[420px] w-auto" fill="none">
        <defs>
          <radialGradient id="figureGlow" cx="50%" cy="38%" r="60%">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="platformFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.5" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>

        <circle cx="110" cy="130" r="150" fill="url(#figureGlow)" />

        {/* Skull */}
        <motion.ellipse
          cx="110" cy="42" rx="24" ry="28"
          stroke={stroke} strokeWidth="1.4" opacity="0.85"
          animate={pulse ? { opacity: [0.85, 1, 0.85] } : { opacity: [0.7, 0.9, 0.7] }}
          transition={{ duration: pulse ? 0.8 : 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <line x1="98" y1="38" x2="106" y2="38" stroke={stroke} strokeWidth="1" opacity="0.6" />
        <line x1="114" y1="38" x2="122" y2="38" stroke={stroke} strokeWidth="1" opacity="0.6" />
        <line x1="110" y1="46" x2="110" y2="56" stroke={stroke} strokeWidth="1" opacity="0.5" />

        {/* Spine / core glow line */}
        <motion.line
          x1="110" y1="70" x2="110" y2="240"
          stroke={stroke} strokeWidth="1.6"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Ribcage */}
        {[86, 100, 114, 128, 142].map((y, i) => (
          <path
            key={y}
            d={`M ${94 - i} ${y} Q 110 ${y - 6} ${126 + i} ${y}`}
            stroke={stroke}
            strokeWidth="1"
            opacity={0.35 + i * 0.03}
          />
        ))}

        {/* Shoulders + arms */}
        <line x1="110" y1="78" x2="66" y2="96" stroke={stroke} strokeWidth="1.3" opacity="0.7" />
        <line x1="110" y1="78" x2="154" y2="96" stroke={stroke} strokeWidth="1.3" opacity="0.7" />
        <line x1="66" y1="96" x2="56" y2="160" stroke={stroke} strokeWidth="1.1" opacity="0.6" />
        <line x1="154" y1="96" x2="164" y2="160" stroke={stroke} strokeWidth="1.1" opacity="0.6" />
        <line x1="56" y1="160" x2="50" y2="212" stroke={stroke} strokeWidth="1" opacity="0.5" />
        <line x1="164" y1="160" x2="170" y2="212" stroke={stroke} strokeWidth="1" opacity="0.5" />

        {/* Pelvis */}
        <path d="M 82 176 Q 110 188 138 176" stroke={stroke} strokeWidth="1.2" opacity="0.6" />

        {/* Legs */}
        <line x1="96" y1="180" x2="90" y2="270" stroke={stroke} strokeWidth="1.3" opacity="0.7" />
        <line x1="124" y1="180" x2="130" y2="270" stroke={stroke} strokeWidth="1.3" opacity="0.7" />
        <line x1="90" y1="270" x2="86" y2="356" stroke={stroke} strokeWidth="1.2" opacity="0.65" />
        <line x1="130" y1="270" x2="134" y2="356" stroke={stroke} strokeWidth="1.2" opacity="0.65" />

        {/* Joint nodes */}
        {[
          [110, 78], [66, 96], [154, 96], [56, 160], [164, 160], [50, 212], [170, 212],
          [96, 180], [124, 180], [90, 270], [130, 270], [86, 356], [134, 356],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx} cy={cy} r="2.6"
            fill={stroke}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2 + (i % 4) * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
          />
        ))}

        {/* Feet */}
        <line x1="86" y1="356" x2="78" y2="366" stroke={stroke} strokeWidth="1.1" opacity="0.5" />
        <line x1="134" y1="356" x2="142" y2="366" stroke={stroke} strokeWidth="1.1" opacity="0.5" />

        {/* Floating platform ring beneath the figure */}
        <motion.ellipse
          cx="110" cy="392" rx="70" ry="12"
          stroke="url(#platformFade)" strokeWidth="1.5"
          animate={{ rx: [66, 72, 66] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.ellipse
          cx="110" cy="392" rx="46" ry="8"
          stroke={stroke} strokeOpacity="0.4" strokeWidth="1"
          animate={{ rotate: 360 }}
          style={{ transformOrigin: "110px 392px" }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
}
