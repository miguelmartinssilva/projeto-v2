import { motion } from "framer-motion";

const shapes = [
  { size: 60, x: "10%", y: "20%", delay: 0, duration: 12, color: "rgba(0,230,118,0.08)", border: "rgba(0,230,118,0.12)" },
  { size: 40, x: "80%", y: "15%", delay: 2, duration: 15, color: "rgba(124,58,237,0.06)", border: "rgba(124,58,237,0.1)" },
  { size: 80, x: "70%", y: "70%", delay: 4, duration: 18, color: "rgba(68,138,255,0.05)", border: "rgba(68,138,255,0.08)" },
  { size: 30, x: "20%", y: "75%", delay: 1, duration: 14, color: "rgba(255,184,0,0.06)", border: "rgba(255,184,0,0.1)" },
  { size: 50, x: "50%", y: "40%", delay: 3, duration: 16, color: "rgba(0,230,118,0.04)", border: "rgba(0,230,118,0.06)" },
];

export default function AnimatedShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((s, i) => (
        <motion.div key={i}
          animate={{ y: [0, -15, 0], rotate: [0, 180, 360], scale: [1, 1.05, 1] }}
          transition={{ duration: s.duration, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
          className="absolute rounded-xl border backdrop-blur-sm"
          style={{
            width: s.size, height: s.size,
            left: s.x, top: s.y,
            background: s.color,
            borderColor: s.border,
          }}
        />
      ))}
    </div>
  );
}
