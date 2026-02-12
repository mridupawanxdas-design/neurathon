import { motion } from "framer-motion";
import { FileText, CreditCard, Package, Mic, IndianRupee } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const CoreCapabilities = () => {
  const { t } = useLanguage();
  const { ref, opacity, y, scale } = useScrollAnimation();

  const capabilities = [
    { icon: FileText, titleKey: "cap.invoice", descKey: "cap.invoiceDesc" },
    { icon: CreditCard, titleKey: "cap.udhaar", descKey: "cap.udhaarDesc" },
    { icon: Package, titleKey: "cap.inventory", descKey: "cap.inventoryDesc" },
    { icon: Mic, titleKey: "cap.voice", descKey: "cap.voiceDesc" },
    { icon: IndianRupee, titleKey: "cap.india", descKey: "cap.indiaDesc" },
  ];

  return (
    <section className="py-28 sm:py-36 bg-secondary/30" id="capabilities">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          ref={ref}
          style={{ opacity, y, scale }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-xs uppercase tracking-[0.2em]">
            {t("cap.tag")}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
            {t("cap.title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            {t("cap.sub")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.titleKey}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                y: -6,
                scale: 1.02,
                transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
              }}
              className="group rounded-2xl bg-card p-8 shadow-card border border-border hover:shadow-elevated hover:border-primary/20 transition-all duration-500 relative overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.04] pointer-events-none" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/12 transition-all duration-500">
                  <cap.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                  {t(cap.titleKey)}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {t(cap.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreCapabilities;
