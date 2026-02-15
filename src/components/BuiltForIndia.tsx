import { motion } from "framer-motion";
import { Wifi, Smartphone, Layout, Mic } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const BuiltForIndia = () => {
  const { t } = useLanguage();
  const { ref, opacity, y, scale } = useScrollAnimation();

  const features = [
    { icon: Wifi, titleKey: "bfi.offline", descKey: "bfi.offlineDesc" },
    { icon: Layout, titleKey: "bfi.noDash", descKey: "bfi.noDashDesc" },
    { icon: Mic, titleKey: "bfi.voiceFirst", descKey: "bfi.voiceFirstDesc" },
    { icon: Smartphone, titleKey: "bfi.mobile", descKey: "bfi.mobileDesc" },
  ];

  return (
    <section className="py-28 sm:py-36 bg-secondary/30" id="built-for-india">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          ref={ref}
          style={{ opacity, y, scale }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-xs uppercase tracking-[0.2em]">
            {t("bfi.tag")}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
            {t("bfi.title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            {t("bfi.sub")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((feat, i) => (
            <motion.div
              key={feat.titleKey}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                y: -4,
                scale: 1.01,
                transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
              }}
              className="flex gap-5 rounded-2xl bg-card p-7 sm:p-8 shadow-card border border-border hover:shadow-elevated hover:border-primary/20 transition-all duration-500 group"
            >
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 group-hover:scale-110 transition-all duration-500">
                <feat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-1.5">
                  {t(feat.titleKey)}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t(feat.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuiltForIndia;
