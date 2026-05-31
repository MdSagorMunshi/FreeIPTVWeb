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
    <div className="flex flex-col items-center justify-start h-full min-h-[80vh] py-12 px-4 sm:px-0">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-[12px] flex items-center justify-center shadow-sm">
            <SettingsIcon size={32} className="text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-primary-text">{t('settings.title')}</h1>
            <p className="text-secondary-text">{t('settings.subtitle')}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Player Engine Settings */}
          <section className="bg-surface rounded-[12px] p-6 md:p-8 border border-border-light shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-light">
              <MonitorPlay className="text-primary" size={24} />
              <h2 className="text-2xl font-bold text-primary-text">{t('settings.engine')}</h2>
            </div>
            
            <p className="text-secondary-text text-sm mb-6 leading-relaxed">
              {t('settings.engineDesc')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                onClick={() => updateSettings({ engine: 'hls' })}
                className={`relative flex flex-col items-start p-4 rounded-[8px] border transition-all duration-300 overflow-hidden ${
                  settings.engine === 'hls' 
                    ? 'border-primary bg-primary/10 ring-1 ring-primary' 
                    : 'border-border-light bg-surface hover:bg-background'
                }`}
              >
                <span className="font-bold text-primary-text mb-1">HLS.js Core</span>
                <span className="text-xs text-secondary-text text-left">Custom FreeIPTV Engine. Highly optimized for web browsers.</span>
              </button>

              <button 
                onClick={() => updateSettings({ engine: 'react-player' })}
                className={`relative flex flex-col items-start p-4 rounded-[8px] border transition-all duration-300 overflow-hidden ${
                  settings.engine === 'react-player' 
                    ? 'border-primary bg-primary/10 ring-1 ring-primary' 
                    : 'border-border-light bg-surface hover:bg-background'
                }`}
              >
                <span className="font-bold text-primary-text mb-1">ReactPlayer</span>
                <span className="text-xs text-secondary-text text-left">Universal player wrapper. Excellent fallback compatibility.</span>
              </button>

              <button 
                onClick={() => updateSettings({ engine: 'videojs' })}
                className={`relative flex flex-col items-start p-4 rounded-[8px] border transition-all duration-300 overflow-hidden ${
                  settings.engine === 'videojs' 
                    ? 'border-primary bg-primary/10 ring-1 ring-primary' 
                    : 'border-border-light bg-surface hover:bg-background'
                }`}
              >
                <span className="font-bold text-primary-text mb-1">Video.js</span>
                <span className="text-xs text-secondary-text text-left">Industry standard HTML5 video player framework.</span>
              </button>
            </div>
          </section>

          {/* Language Settings */}
          <section className="bg-surface rounded-[12px] p-6 md:p-8 border border-border-light shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-light">
              <Globe className="text-primary" size={24} />
              <h2 className="text-2xl font-bold text-primary-text">{t('settings.language')}</h2>
            </div>
            
            <p className="text-secondary-text text-sm mb-6 leading-relaxed">
              {t('settings.languageDesc')}
            </p>

            <select 
              value={settings.language || 'en'}
              onChange={(e) => updateSettings({ language: e.target.value as any })}
              className="w-full sm:w-1/2 p-3 bg-background border border-border-light rounded-[8px] text-primary-text outline-none focus:border-primary transition-colors"
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
          </section>

          {/* Playback Settings */}
          <section className="bg-surface rounded-[12px] p-6 md:p-8 border border-border-light shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-light">
              <Zap className="text-accent" size={24} />
              <h2 className="text-2xl font-bold text-primary-text">Playback</h2>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-primary-text text-lg">{t('settings.autoplay')}</h3>
                <p className="text-secondary-text text-sm">{t('settings.autoplayDesc')}</p>
              </div>
              <button 
                onClick={() => updateSettings({ autoPlay: !settings.autoPlay })}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                  settings.autoPlay ? 'bg-primary' : 'bg-border-light'
                }`}
              >
                <span 
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    settings.autoPlay ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Theme Settings */}
          <section className="bg-surface rounded-[12px] p-6 md:p-8 border border-border-light shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-light">
              <Palette className="text-primary" size={24} />
              <h2 className="text-2xl font-bold text-primary-text">{t('settings.theme')}</h2>
            </div>
            
            <p className="text-secondary-text text-sm mb-6 leading-relaxed">
              {t('settings.themeDesc')}
            </p>

            {mounted && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <button 
                  onClick={() => setTheme('system')}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-[8px] border transition-all duration-300 ${
                    theme === 'system' ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-border-light bg-surface hover:bg-background'
                  }`}
                >
                  <Smartphone size={28} className={theme === 'system' ? 'text-primary mb-2' : 'text-muted-text mb-2'} />
                  <span className="font-bold text-primary-text text-sm">System</span>
                </button>

                <button 
                  onClick={() => setTheme('light')}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-[8px] border transition-all duration-300 ${
                    theme === 'light' ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-border-light bg-surface hover:bg-background'
                  }`}
                >
                  <Sun size={28} className={theme === 'light' ? 'text-primary mb-2' : 'text-muted-text mb-2'} />
                  <span className="font-bold text-primary-text text-sm">{t('settings.theme.light')}</span>
                </button>

                <button 
                  onClick={() => setTheme('dark')}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-[8px] border transition-all duration-300 ${
                    theme === 'dark' ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-border-light bg-surface hover:bg-background'
                  }`}
                >
                  <Moon size={28} className={theme === 'dark' ? 'text-primary mb-2' : 'text-muted-text mb-2'} />
                  <span className="font-bold text-primary-text text-sm">{t('settings.theme.dark')}</span>
                </button>

                <button 
                  onClick={() => setTheme('oled')}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-[8px] border transition-all duration-300 ${
                    theme === 'oled' ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-border-light bg-surface hover:bg-background'
                  }`}
                >
                  <div className={`w-7 h-7 bg-black rounded-full mb-2 shadow-inner ${theme === 'oled' ? 'border-2 border-primary' : 'border border-border-light'}`} />
                  <span className="font-bold text-primary-text text-sm">{t('settings.theme.oled')}</span>
                </button>
              </div>
            )}
          </section>

        </div>
      </motion.div>
    </div>
  );
}
