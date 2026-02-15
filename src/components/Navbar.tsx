import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { Globe, Menu, X, Sun, Moon } from "lucide-react";
import { useLanguage, languageOptions } from "@/contexts/LanguageContext";
import { useTheme } from "@/hooks/useTheme";

const Navbar = () => {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { scrollY } = useScroll();
  const navShadow = useTransform(scrollY, [0, 100], ["0 0 0 0 transparent", "0 4px 30px -8px hsl(210 40% 10% / 0.08)"]);
  const navBorder = useTransform(scrollY, [0, 100], [0, 1]);

  const navLinks = [
    { href: "#how-it-works", label: t("nav.howItWorks") },
    { href: "#capabilities", label: t("nav.capabilities") },
    { href: "#languages", label: t("nav.languages") },
    { href: "#trust", label: t("nav.trust") },
  ];

  const currentLang = languageOptions.find((l) => l.code === lang);

  return (
    <motion.nav
      style={{ boxShadow: navShadow }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 transition-colors duration-300"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-xl bg-green-gradient flex items-center justify-center text-primary-foreground font-display font-bold text-xs shadow-green"
            >
              BB
            </motion.div>
            <span className="font-display font-semibold text-foreground text-sm hidden sm:block tracking-tight">
              Bharat Biz-Agent
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                whileHover={{ scale: 1.03 }}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium rounded-lg hover:bg-secondary/60"
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-200"
              aria-label="Toggle theme"
            >
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </motion.div>
            </motion.button>

            {/* Language selector */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-200"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">{currentLang?.nativeLabel}</span>
              </motion.button>

              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-0 top-full mt-2 z-50 w-52 bg-card rounded-2xl shadow-elevated border border-border overflow-hidden"
                  >
                    {languageOptions.map((option) => (
                      <button
                        key={option.code}
                        onClick={() => {
                          setLang(option.code);
                          setLangOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between transition-all duration-150 ${
                          lang === option.code
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-foreground hover:bg-secondary/60"
                        }`}
                      >
                        <span>{option.nativeLabel}</span>
                        <span className="text-xs text-muted-foreground">{option.label}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </div>

            {/* CTA */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.04, boxShadow: "0 8px 30px -6px hsl(145 63% 42% / 0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="hidden sm:inline-flex px-5 py-2 rounded-xl bg-green-gradient text-primary-foreground font-semibold text-sm shadow-green transition-all duration-300"
            >
              {t("nav.tryAgent")}
            </motion.a>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-foreground rounded-lg"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden pb-6 space-y-1"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm text-foreground/80 hover:bg-secondary/60 transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#"
              className="block px-4 py-3 rounded-xl bg-green-gradient text-primary-foreground font-semibold text-sm text-center mt-3 shadow-green"
            >
              {t("nav.tryAgent")}
            </a>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
