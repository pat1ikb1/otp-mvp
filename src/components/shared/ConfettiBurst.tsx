import { AnimatePresence, motion } from 'motion/react';

const PARTICLES = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2;
  const dist = 55 + (i % 3) * 28;
  return {
    id: i,
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist - 20,
    color: ['#74BF1E', '#74BF1E', '#C89B3C', '#74BF1E', '#F59E0B'][i % 5],
    rotate: (i * 47) % 360,
  };
});

export function ConfettiBurst({ triggerKey }: { triggerKey: number }) {
  if (triggerKey === 0) return null;

  return (
    <AnimatePresence>
      <div
        key={triggerKey}
        className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center overflow-hidden"
      >
        {PARTICLES.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.4, rotate: 0 }}
            animate={{
              opacity: [1, 1, 0],
              x: p.x,
              y: p.y + 40,
              scale: [0.6, 1.15, 0.7],
              rotate: p.rotate,
            }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{ backgroundColor: p.color }}
            className="absolute h-2.5 w-2.5 rounded-sm"
          />
        ))}
      </div>
    </AnimatePresence>
  );
}
