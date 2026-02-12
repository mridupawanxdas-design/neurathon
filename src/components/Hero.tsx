import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRef } from "react";

const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {value}{suffix}
      </motion.span>
    </motion.span>
  );
};

const Hero = () => {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const headlineWords1 = t("hero.headline1").split("");
  const headlineWords2 = t("hero.headline2").split("");

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient">
      {/* Floating gradient blobs */}
      <motion.div
        className="absolute top-[10%] right-[10%] w-[400px] h-[400px] rounded-full opacity-20 dark:opacity-10 blur-[100px]"
        style={{ background: "radial-gradient(circle, hsl(145 63% 42% / 0.4), transparent)" }}
        animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[15%] left-[5%] w-[300px] h-[300px] rounded-full opacity-15 dark:opacity-8 blur-[80px]"
        style={{ background: "radial-gradient(circle, hsl(170 50% 32% / 0.3), transparent)" }}
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[40%] left-[20%] w-[200px] h-[200px] rounded-full opacity-10 blur-[60px]"
        style={{ background: "radial-gradient(circle, hsl(145 55% 50% / 0.3), transparent)" }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 container mx-auto px-6 text-center max-w-5xl pt-24"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block mb-8 px-5 py-2.5 rounded-full bg-secondary text-foreground/70 text-sm font-medium tracking-wide border border-border">
            {t("hero.badge")}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-foreground leading-[1.05] tracking-tight"
        >
          <motion.span
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            {t("hero.headline1")}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="block text-gradient-hero"
          >
            {t("hero.headline2")}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            {t("hero.headline3")}
          </motion.span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          {t("hero.sub")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 12px 40px -8px hsl(145 63% 42% / 0.45)" }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-2xl bg-green-gradient text-primary-foreground font-semibold text-lg shadow-green transition-all duration-300"
          >
            {t("hero.cta1")}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: "hsl(var(--secondary))" }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-2xl bg-secondary/80 text-foreground font-semibold text-lg border border-border hover:border-primary/30 transition-all duration-300"
          >
            {t("hero.cta2")}
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 flex flex-wrap justify-center gap-12 sm:gap-20"
        >
          {[
            { value: 7, suffix: "+", label: "Languages" },
            { value: 50, suffix: "ms", label: "Response Time" },
            { value: 100, suffix: "%", label: "Your Control" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-medium tracking-wide uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-foreground/15 flex items-start justify-center p-1.5"
          >
            <motion.div
              className="w-1.5 h-3 rounded-full bg-foreground/25"
              animate={{ opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
