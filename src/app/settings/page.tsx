"use client";

import { motion } from "framer-motion";
import { Settings as SettingsIcon, MonitorPlay, Zap, Palette, Moon, Sun, Smartphone, Globe } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useTheme } from "next-themes";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useEffect, useState } from "react";

export default function Settings() {
  const { settings, updateSettings } = usePlayerStore();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start h-full min-h-[80vh] py-12 px-4 sm:px-0 pb-36 md:pb-16">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl w-full"
      >
        {/* Header Block */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-primary/15">
            <SettingsIcon size={28} className="text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-primary-text">{t('settings.title')}</h1>
            <p className="text-secondary-text text-sm sm:text-base font-semibold mt-1">{t('settings.subtitle')}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Player Engine Settings */}
          <section className="matte-panel rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-light">
              <MonitorPlay className="text-primary" size={20} />
              <h2 className="text-xl font-extrabold text-primary-text">{t('settings.engine')}</h2>
            </div>
            
            <p className="text-secondary-text text-sm mb-6 leading-relaxed font-medium">
              {t('settings.engineDesc')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateSettings({ engine: 'hls' })}
                className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-300 ${
                  settings.engine === 'hls' 
                    ? 'border-primary/20 bg-primary text-white shadow-[0_8px_20px_rgba(99,102,241,0.25)]' 
                    : 'bg-surface/50 dark:bg-surface/40 backdrop-blur-xl border-border-light text-secondary-text hover:bg-surface hover:text-primary-text'
                }`}
              >
                <span className={`font-black mb-1.5 ${settings.engine === 'hls' ? 'text-white' : 'text-primary-text'}`}>HLS.js Core</span>
                <span className={`text-xs leading-relaxed font-semibold ${settings.engine === 'hls' ? 'text-white/80' : 'text-secondary-text'}`}>Custom FreeIPTV Engine. Highly optimized for web browsers.</span>
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateSettings({ engine: 'react-player' })}
                className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-300 ${
                  settings.engine === 'react-player' 
                    ? 'border-primary/20 bg-primary text-white shadow-[0_8px_20px_rgba(99,102,241,0.25)]' 
                    : 'bg-surface/50 dark:bg-surface/40 backdrop-blur-xl border-border-light text-secondary-text hover:bg-surface hover:text-primary-text'
                }`}
              >
                <span className={`font-black mb-1.5 ${settings.engine === 'react-player' ? 'text-white' : 'text-primary-text'}`}>ReactPlayer</span>
                <span className={`text-xs leading-relaxed font-semibold ${settings.engine === 'react-player' ? 'text-white/80' : 'text-secondary-text'}`}>Universal player wrapper. Excellent fallback compatibility.</span>
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateSettings({ engine: 'videojs' })}
                className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-300 ${
                  settings.engine === 'videojs' 
                    ? 'border-primary/20 bg-primary text-white shadow-[0_8px_20px_rgba(99,102,241,0.25)]' 
                    : 'bg-surface/50 dark:bg-surface/40 backdrop-blur-xl border-border-light text-secondary-text hover:bg-surface hover:text-primary-text'
                }`}
              >
                <span className={`font-black mb-1.5 ${settings.engine === 'videojs' ? 'text-white' : 'text-primary-text'}`}>Video.js</span>
                <span className={`text-xs leading-relaxed font-semibold ${settings.engine === 'videojs' ? 'text-white/80' : 'text-secondary-text'}`}>Industry standard HTML5 video player framework.</span>
              </motion.button>
            </div>
          </section>

          {/* Language Settings */}
          <section className="matte-panel rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-light">
              <Globe className="text-primary" size={20} />
              <h2 className="text-xl font-extrabold text-primary-text">{t('settings.language')}</h2>
            </div>
            
            <p className="text-secondary-text text-sm mb-6 leading-relaxed font-medium">
              {t('settings.languageDesc')}
            </p>

            <div className="relative w-full sm:w-1/2">
              <select 
                value={settings.language || 'en'}
                onChange={(e) => updateSettings({ language: e.target.value as any })}
                className="w-full p-3.5 bg-surface/50 dark:bg-surface/40 backdrop-blur-2xl border border-border-light rounded-xl text-primary-text font-bold outline-none focus:border-primary transition-colors cursor-pointer shadow-sm"
              >
                <option value="en">English</option>
                <option value="bn">Bengali (বাংলা)</option>
                <option value="es">Spanish (Español)</option>
                <option value="ru">Russian (Русский)</option>
                <option value="ar">Arabic (العربية)</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="ja">Japanese (日本語)</option>
                <option value="zh">Chinese (中文)</option>
              </select>
            </div>
          </section>

          {/* Playback Settings */}
          <section className="matte-panel rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-light">
              <Zap className="text-accent" size={20} />
              <h2 className="text-xl font-extrabold text-primary-text">Playback</h2>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-primary-text text-base md:text-lg">{t('settings.autoplay')}</h3>
                <p className="text-secondary-text text-xs md:text-sm font-semibold mt-0.5">{t('settings.autoplayDesc')}</p>
              </div>
              
              {/* Premium Spring Switch */}
              <button 
                onClick={() => updateSettings({ autoPlay: !settings.autoPlay })}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 border border-white/5 cursor-pointer outline-none ${
                  settings.autoPlay ? 'bg-primary shadow-[0_2px_8px_rgba(99,102,241,0.3)]' : 'bg-border-light'
                }`}
              >
                <motion.span 
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="inline-block h-6 w-6 transform rounded-full bg-white shadow-md"
                  style={{
                    marginLeft: settings.autoPlay ? '34px' : '4px'
                  }}
                />
              </button>
            </div>
          </section>

          {/* Theme Settings */}
          <section className="matte-panel rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-light">
              <Palette className="text-primary" size={20} />
              <h2 className="text-xl font-extrabold text-primary-text">{t('settings.theme')}</h2>
            </div>
            
            <p className="text-secondary-text text-sm mb-6 leading-relaxed font-medium">
              {t('settings.themeDesc')}
            </p>

            {mounted && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTheme('system')}
                  className={`relative flex flex-col items-center justify-center p-5 rounded-xl border transition-all duration-300 ${
                    theme === 'system' 
                      ? 'border-primary/25 bg-primary text-white shadow-[0_8px_20px_rgba(99,102,241,0.25)]' 
                      : 'bg-surface/50 dark:bg-surface/40 backdrop-blur-xl border-border-light text-secondary-text hover:bg-surface hover:text-primary-text'
                  }`}
                >
                  <Smartphone size={24} className={theme === 'system' ? 'text-white mb-2' : 'text-primary mb-2'} />
                  <span className="font-extrabold text-sm">System</span>
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTheme('light')}
                  className={`relative flex flex-col items-center justify-center p-5 rounded-xl border transition-all duration-300 ${
                    theme === 'light' 
                      ? 'border-primary/25 bg-primary text-white shadow-[0_8px_20px_rgba(99,102,241,0.25)]' 
                      : 'bg-surface/50 dark:bg-surface/40 backdrop-blur-xl border-border-light text-secondary-text hover:bg-surface hover:text-primary-text'
                  }`}
                >
                  <Sun size={24} className={theme === 'light' ? 'text-white mb-2' : 'text-primary mb-2'} />
                  <span className="font-extrabold text-sm">{t('settings.theme.light')}</span>
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTheme('dark')}
                  className={`relative flex flex-col items-center justify-center p-5 rounded-xl border transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'border-primary/25 bg-primary text-white shadow-[0_8px_20px_rgba(99,102,241,0.25)]' 
                      : 'bg-surface/50 dark:bg-surface/40 backdrop-blur-xl border-border-light text-secondary-text hover:bg-surface hover:text-primary-text'
                  }`}
                >
                  <Moon size={24} className={theme === 'dark' ? 'text-white mb-2' : 'text-primary mb-2'} />
                  <span className="font-extrabold text-sm">{t('settings.theme.dark')}</span>
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTheme('oled')}
                  className={`relative flex flex-col items-center justify-center p-5 rounded-xl border transition-all duration-300 ${
                    theme === 'oled' 
                      ? 'border-primary/25 bg-primary text-white shadow-[0_8px_20px_rgba(99,102,241,0.25)]' 
                      : 'bg-surface/50 dark:bg-surface/40 backdrop-blur-xl border-border-light text-secondary-text hover:bg-surface hover:text-primary-text'
                  }`}
                >
                  <div className={`w-6 h-6 bg-black rounded-full mb-2 shadow-[inset_0_2px_4px_rgba(255,255,255,0.15)] ${theme === 'oled' ? 'border-2 border-white' : 'border border-white/20'}`} />
                  <span className="font-extrabold text-sm">{t('settings.theme.oled')}</span>
                </motion.button>
              </div>
            )}
          </section>

        </div>
      </motion.div>
    </div>
  );
}
