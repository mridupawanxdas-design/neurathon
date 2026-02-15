import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const languages = [
  { code: "en", label: "English", greeting: "Hello! How can I help your business today?", cta: "Try the Agent" },
  { code: "hi", label: "हिन्दी", greeting: "नमस्ते! आज मैं आपके व्यापार में कैसे मदद कर सकता हूँ?", cta: "एजेंट आज़माएं" },
  { code: "bn", label: "বাংলা", greeting: "নমস্কার! আজ আমি আপনার ব্যবসায় কীভাবে সাহায্য করতে পারি?", cta: "এজেন্ট ব্যবহার করুন" },
  { code: "ta", label: "தமிழ்", greeting: "வணக்கம்! இன்று உங்கள் வணிகத்திற்கு நான் எவ்வாறு உதவ முடியும்?", cta: "முகவரை முயற்சிக்கவும்" },
  { code: "mr", label: "मराठी", greeting: "नमस्कार! आज मी तुमच्या व्यवसायात कशी मदत करू शकतो?", cta: "एजंट वापरा" },
  { code: "gu", label: "ગુજરાતી", greeting: "નમસ્તે! આજે હું તમારા વ્યવસાયમાં કેવી રીતે મદદ કરી શકું?", cta: "એજન્ટ અજમાવો" },
  { code: "te", label: "తెలుగు", greeting: "నమస్కారం! ఈ రోజు మీ వ్యాపారంలో నేను ఎలా సహాయం చేయగలను?", cta: "ఏజెంట్ ప్రయత్నించండి" },
];

const LanguageSection = () => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(0);
  const { ref, opacity, y, scale } = useScrollAnimation();

  return (
    <section className="py-28 sm:py-36 bg-background" id="languages">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          ref={ref}
          style={{ opacity, y, scale }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-xs uppercase tracking-[0.2em]">
            {t("lang.tag")}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
            {t("lang.title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            {t("lang.sub")}
          </p>
        </motion.div>

        <motion.div style={{ opacity, scale }} className="rounded-3xl bg-card shadow-elevated border border-border overflow-hidden">
          {/* Language pills */}
          <div className="p-5 sm:p-6 border-b border-border flex flex-wrap gap-2 justify-center">
            {languages.map((lang, i) => (
              <motion.button
                key={lang.code}
                onClick={() => setSelected(i)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selected === i
                    ? "bg-primary text-primary-foreground shadow-green"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {lang.label}
              </motion.button>
            ))}
          </div>

          {/* Preview */}
          <div className="p-10 sm:p-14 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                >
                  <Globe className="w-10 h-10 text-primary mx-auto mb-5" />
                </motion.div>
                <p className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-8 leading-relaxed">
                  {languages[selected].greeting}
                </p>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 8px 30px -6px hsl(145 63% 42% / 0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  className="px-7 py-3.5 rounded-2xl bg-green-gradient text-primary-foreground font-semibold shadow-green transition-all duration-300"
                >
                  {languages[selected].cta}
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LanguageSection;
