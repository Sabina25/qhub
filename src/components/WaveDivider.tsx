import { motion } from 'framer-motion';

interface WaveDividerProps {
  flip?: boolean;
  height?: number;
}

const WaveDivider = ({ flip = false, height = 200 }: WaveDividerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.4 }}
      className={`relative z-20 ${flip ? 'rotate-180' : ''}`}
      style={{ height: `${height}px`, marginTop: '-125px' }}
    >
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="fade-wave" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f9fafb" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path
          fill="url(#fade-wave)"
          d="M0,96L48,106.7C96,117,192,139,288,144C384,149,480,139,576,138.7C672,139,768,149,864,165.3C960,181,1056,203,1152,197.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    </motion.div>
  );
};

export default WaveDivider;
