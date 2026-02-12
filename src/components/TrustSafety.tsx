import { motion } from "framer-motion";
import { ShieldCheck, UserCheck, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TrustSafety = () => {
  const { t } = useLanguage();
  const { ref, opacity, y, scale } = useScrollAnimation();

  const pillars = [
    { icon: UserCheck, titleKey: "trust.human", descKey: "trust.humanDesc" },
    { icon: ShieldCheck, titleKey: "trust.noRisk", descKey: "trust.noRiskDesc" },
    { icon: Lock, titleKey: "trust.privacy", descKey: "trust.privacyDesc" },
  ];

  return (
    <section className="py-28 sm:py-36 bg-background" id="trust">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          ref={ref}
          style={{ opacity, y, scale }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-xs uppercase tracking-[0.2em]">
            {t("trust.tag")}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
            {t("trust.title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            {t("trust.sub")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pillars.map((p, i) => (
            <motion.div
              key={p.titleKey}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                y: -6,
                scale: 1.02,
                transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
              }}
              className="text-center rounded-2xl bg-card p-8 shadow-card border border-border hover:shadow-elevated hover:border-primary/20 transition-all duration-500 group relative overflow-hidden"
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-b from-primary/[0.04] to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary/12 transition-all duration-500">
                  <p.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                  {t(p.titleKey)}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t(p.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSafety;
