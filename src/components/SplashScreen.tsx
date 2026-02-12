import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  show: boolean;
}

const SplashScreen = ({ show }: SplashScreenProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <div className="relative flex items-center justify-center">
            {/* Outer ring */}
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -90 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute w-32 h-32 rounded-full border border-primary/20"
            />

            {/* Middle ring - rotating */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6, rotate: 360 }}
              transition={{
                scale: { duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] },
                rotate: { duration: 8, repeat: Infinity, ease: "linear" }
              }}
              className="absolute w-24 h-24 rounded-full border border-dashed border-primary/30"
            />

            {/* Inner circle with BB */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25, ease: "backOut" }}
              className="relative w-16 h-16 rounded-2xl bg-green-gradient flex items-center justify-center shadow-green"
            >
              <motion.span
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="text-primary-foreground font-display font-bold text-xl tracking-tight"
              >
                BB
              </motion.span>
            </motion.div>
          </div>

          {/* Brand text */}
          <motion.p
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.65, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute mt-44 text-xs font-display font-medium text-muted-foreground tracking-[0.2em] uppercase"
          >
            Bharat Biz-Agent
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
