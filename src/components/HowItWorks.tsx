import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const chatSteps = [
  { type: "user" as const, message: '"Rahul ke liye 500 ka bill bana do"', delay: 0 },
  { type: "agent" as const, message: "Understanding... Creating invoice for Rahul — ₹500", delay: 0.3 },
  { type: "agent" as const, message: "Draft ready:\n📄 Invoice #1042\n👤 Rahul Kumar\n💰 ₹500.00\nShall I finalize and send?", delay: 0.6 },
  { type: "user" as const, message: '"Haan, send kar do"', delay: 0.9 },
  { type: "agent" as const, message: "✅ Invoice sent to Rahul via WhatsApp. GST entry recorded.", delay: 1.2 },
];

const HowItWorks = () => {
  const { t } = useLanguage();
  const { ref, opacity, y, scale } = useScrollAnimation();

  return (
    <section className="py-28 sm:py-36 bg-background" id="how-it-works">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          ref={ref}
          style={{ opacity, y, scale }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-xs uppercase tracking-[0.2em]">
            {t("how.tag")}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
            {t("how.title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            {t("how.sub")}
          </p>
        </motion.div>

        <motion.div style={{ opacity, scale }} className="max-w-lg mx-auto">
          <div className="rounded-3xl bg-card shadow-elevated p-6 sm:p-8 border border-border">
            {/* Chat header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-green-gradient flex items-center justify-center text-primary-foreground font-display font-bold text-sm shadow-green">
                BA
              </div>
              <div>
                <p className="font-display font-semibold text-foreground text-sm">{t("how.agentName")}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
                  {t("how.online")}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-3">
              {chatSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: step.delay + 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex ${step.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                      step.type === "user"
                        ? "bg-primary text-primary-foreground rounded-br-lg shadow-green/20"
                        : "bg-secondary text-secondary-foreground rounded-bl-lg"
                    }`}
                  >
                    {step.message}
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Typing indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 2 }}
              className="mt-3 flex items-center gap-1.5 px-4 py-3 bg-secondary rounded-2xl rounded-bl-lg w-fit"
            >
              {[0, 0.15, 0.3].map((d, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity, delay: d }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
