"use client";

import { motion } from "framer-motion";
import { Settings as SettingsIcon, MonitorPlay, Zap, Palette, Moon, Sun, Smartphone } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Settings() {
  const { settings, updateSettings } = usePlayerStore();
  const { theme, setTheme } = useTheme();
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
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-900/50">
            <SettingsIcon size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white">App Settings</h1>
            <p className="text-zinc-400">Customize your viewing experience</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Player Engine Settings */}
          <section className="glass-card rounded-3xl p-6 md:p-8 border border-white/5 shadow-2xl shadow-purple-900/10">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
              <MonitorPlay className="text-purple-400" size={24} />
              <h2 className="text-2xl font-bold text-white">Video Engine</h2>
            </div>
            
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Choose the underlying video player technology used to render live streams. Different engines may provide better stability depending on your device or the specific stream format.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                onClick={() => updateSettings({ engine: 'hls' })}
                className={`relative flex flex-col items-start p-4 rounded-2xl border transition-all duration-300 overflow-hidden ${
                  settings.engine === 'hls' 
                    ? 'border-purple-500 bg-purple-500/10 shadow-[inset_0_0_20px_rgba(168,85,247,0.15)]' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                {settings.engine === 'hls' && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/20 blur-xl rounded-full" />
                )}
                <span className="font-bold text-white mb-1">HLS.js Core</span>
                <span className="text-xs text-zinc-400 text-left">Custom FreeIPTV Engine. Highly optimized for web browsers.</span>
                {settings.engine === 'hls' && (
                  <span className="mt-3 text-[10px] uppercase tracking-widest font-bold text-purple-400 bg-purple-500/20 px-2 py-1 rounded-md">Active</span>
                )}
              </button>

              <button 
                onClick={() => updateSettings({ engine: 'react-player' })}
                className={`relative flex flex-col items-start p-4 rounded-2xl border transition-all duration-300 overflow-hidden ${
                  settings.engine === 'react-player' 
                    ? 'border-blue-500 bg-blue-500/10 shadow-[inset_0_0_20px_rgba(59,130,246,0.15)]' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                {settings.engine === 'react-player' && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/20 blur-xl rounded-full" />
                )}
                <span className="font-bold text-white mb-1">ReactPlayer</span>
                <span className="text-xs text-zinc-400 text-left">Universal player wrapper. Excellent fallback compatibility.</span>
                {settings.engine === 'react-player' && (
                  <span className="mt-3 text-[10px] uppercase tracking-widest font-bold text-blue-400 bg-blue-500/20 px-2 py-1 rounded-md">Active</span>
                )}
              </button>

              <button 
                onClick={() => updateSettings({ engine: 'videojs' })}
                className={`relative flex flex-col items-start p-4 rounded-2xl border transition-all duration-300 overflow-hidden ${
                  settings.engine === 'videojs' 
                    ? 'border-green-500 bg-green-500/10 shadow-[inset_0_0_20px_rgba(34,197,94,0.15)]' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                {settings.engine === 'videojs' && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/20 blur-xl rounded-full" />
                )}
                <span className="font-bold text-white mb-1">Video.js</span>
                <span className="text-xs text-zinc-400 text-left">Industry standard HTML5 video player framework.</span>
                {settings.engine === 'videojs' && (
                  <span className="mt-3 text-[10px] uppercase tracking-widest font-bold text-green-400 bg-green-500/20 px-2 py-1 rounded-md">Active</span>
                )}
              </button>
            </div>
          </section>

          {/* Playback Settings */}
          <section className="glass-card rounded-3xl p-6 md:p-8 border border-white/5">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
              <Zap className="text-pink-400" size={24} />
              <h2 className="text-2xl font-bold text-white">Playback</h2>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-lg">Auto-Play Channels</h3>
                <p className="text-zinc-400 text-sm">Automatically start playing stream when selecting a channel.</p>
              </div>
              <button 
                onClick={() => updateSettings({ autoPlay: !settings.autoPlay })}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                  settings.autoPlay ? 'bg-gradient-to-r from-purple-600 to-pink-500' : 'bg-zinc-700'
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
          <section className="glass-card rounded-3xl p-6 md:p-8 border border-white/5">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
              <Palette className="text-cyan-400" size={24} />
              <h2 className="text-2xl font-bold text-white">Theme</h2>
            </div>
            
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Personalize the app's appearance. Pure OLED mode completely disables background illumination to save battery on OLED screens.
            </p>

            {mounted && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <button 
                  onClick={() => setTheme('system')}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                    theme === 'system' ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Smartphone size={28} className={theme === 'system' ? 'text-cyan-400 mb-2' : 'text-zinc-400 mb-2'} />
                  <span className="font-bold text-white text-sm">System</span>
                </button>

                <button 
                  onClick={() => setTheme('light')}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                    theme === 'light' ? 'border-yellow-500 bg-yellow-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Sun size={28} className={theme === 'light' ? 'text-yellow-400 mb-2' : 'text-zinc-400 mb-2'} />
                  <span className="font-bold text-white text-sm">Light</span>
                </button>

                <button 
                  onClick={() => setTheme('dark')}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                    theme === 'dark' ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Moon size={28} className={theme === 'dark' ? 'text-purple-400 mb-2' : 'text-zinc-400 mb-2'} />
                  <span className="font-bold text-white text-sm">Dark</span>
                </button>

                <button 
                  onClick={() => setTheme('oled')}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                    theme === 'oled' ? 'border-white bg-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]' : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="w-7 h-7 bg-black rounded-full border border-white/20 mb-2 shadow-inner" />
                  <span className="font-bold text-white text-sm">Pure OLED</span>
                </button>
              </div>
            )}
          </section>

        </div>
      </motion.div>
    </div>
  );
}
