import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative py-14 bg-card border-t border-border">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 2 }}
              className="w-9 h-9 rounded-xl bg-green-gradient flex items-center justify-center text-primary-foreground font-display font-bold text-xs shadow-green"
            >
              BB
            </motion.div>
            <div className="text-center sm:text-left">
              <h3 className="text-base font-display font-semibold text-foreground">{t("footer.brand")}</h3>
              <p className="text-muted-foreground text-xs mt-0.5">
                {t("footer.tagline")}
              </p>
            </div>
          </div>

          <div className="flex gap-8 text-sm text-muted-foreground">
            {["footer.about", "footer.privacy", "footer.github"].map((key) => (
              <motion.a
                key={key}
                href="#"
                whileHover={{ scale: 1.05 }}
                className="hover:text-foreground transition-colors duration-200"
              >
                {t(key)}
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          {t("footer.copy")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
