"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, X, Settings, ShieldAlert, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { useTranslation } from "@/lib/i18n/useTranslation";

// Third-party Players
import ReactPlayer from "react-player";
import videojs from "video.js";
import "video.js/dist/video-js.css";

/* -------------------------------------------------------------------------- */
/*                          SHARED CONTROLS OVERLAY                           */
/* -------------------------------------------------------------------------- */
function ControlsOverlay({
  currentChannel,
  closePlayer,
  isFullscreen,
  toggleFullscreen,
  isPlaying,
  togglePlay,
  isMuted,
  toggleMute,
  volume,
  setVolume,
  isBuffering,
  showVpnPopup,
  setShowVpnPopup,
  showSettings,
  setShowSettings,
  qualities,
  currentQuality,
  setCurrentQuality,
  containerRef
}: any) {
  const [showControls, setShowControls] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const hideControlsTimeout = useRef<NodeJS.Timeout>(null);
  const { t } = useTranslation();

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    hideControlsTimeout.current = setTimeout(() => {
      if (isPlaying && !showVpnPopup && !showSettings && !showVolumeSlider) setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    handleMouseMove();
    return () => { if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current); };
  }, [isPlaying, showVpnPopup, showSettings, showVolumeSlider]);

  return (
    <div 
      className="absolute inset-0 z-10"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { if (isPlaying && !showVpnPopup && !showSettings && !showVolumeSlider) setShowControls(false); }}
      onClick={(e) => { 
        handleMouseMove(); 
        if (showSettings) { e.stopPropagation(); setShowSettings(false); } 
        else togglePlay(e); 
      }}
    >
      {/* Buffering Indicator */}
      {isBuffering && !showVpnPopup && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/35 backdrop-blur-md z-10">
          <div className="scale-75 md:scale-100"><LoadingIndicator theme="primary" /></div>
        </div>
      )}

      {/* VPN Popup */}
      <AnimatePresence>
        {showVpnPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-lg p-4 sm:p-6">
            <div className="bg-surface/90 dark:bg-surface/80 backdrop-blur-2xl border border-border-light rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
              <ShieldAlert size={40} className="text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-primary-text mb-2">{t('player.streamError')}</h3>
              <p className="text-secondary-text text-xs mb-4 leading-relaxed">{t('player.streamErrorDesc')}</p>
              <button onClick={(e) => { e.stopPropagation(); setShowVpnPopup(false); }} className="w-full py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-md">{t('player.dismiss')}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Controls */}
      <AnimatePresence>
        {(showControls || !isPlaying) && !showVpnPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 flex flex-col justify-between p-4 pointer-events-none z-20">
            {/* Header */}
            <div className="flex items-center justify-between pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2.5 bg-black/45 backdrop-blur-2xl px-4 py-2 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
                {currentChannel.logo && <img src={currentChannel.logo} alt="" className="h-5 w-5 object-contain rounded-md" />}
                <span className="text-white font-extrabold text-xs sm:text-sm truncate max-w-[150px] sm:max-w-[200px] lg:max-w-[300px]">{currentChannel.name}</span>
              </div>
              {!isFullscreen && (
                <button onClick={closePlayer} className="p-2 bg-black/45 backdrop-blur-2xl rounded-full text-white/80 hover:text-white hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all shadow-lg pointer-events-auto hover:scale-105 active:scale-95">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Play Button Overlay */}
            {!isPlaying && !isBuffering && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.8, opacity: 0 }} 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="w-16 h-16 bg-primary/85 backdrop-blur-xl rounded-full flex items-center justify-center text-white shadow-[0_12px_36px_rgba(99,102,241,0.4)] border border-primary/20">
                  <Play size={24} fill="currentColor" className="ml-1 text-white" />
                </div>
              </motion.div>
            )}

            {/* Bottom Floating Console Command Deck */}
            <div 
              className="flex items-center justify-between mt-auto bg-black/55 backdrop-blur-2xl border border-white/10 rounded-2xl p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)] pointer-events-auto" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2.5">
                <button onClick={togglePlay} className="p-2.5 bg-primary text-white rounded-full hover:scale-110 active:scale-90 transition-all shadow-md disabled:opacity-50" disabled={isBuffering}>
                  {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                </button>
                
                <div className="flex items-center relative group" onMouseEnter={() => setShowVolumeSlider(true)} onMouseLeave={() => setShowVolumeSlider(false)}>
                  <button onClick={toggleMute} className="p-2.5 text-white hover:bg-white/15 rounded-full transition-all backdrop-blur-xl bg-white/5 border border-white/5">
                    {volume === 0 || isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <AnimatePresence>
                    {showVolumeSlider && (
                      <motion.div initial={{ width: 0, opacity: 0, marginLeft: 0 }} animate={{ width: 80, opacity: 1, marginLeft: 10 }} exit={{ width: 0, opacity: 0, marginLeft: 0 }} className="overflow-hidden flex items-center bg-black/40 backdrop-blur-2xl rounded-full px-3 h-9 border border-white/10 shadow-lg">
                        <input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} onChange={(e) => { const val = parseFloat(e.target.value); setVolume(val); }} className="w-full h-1 bg-white/25 rounded-lg appearance-none cursor-pointer accent-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 relative">
                {qualities && qualities.length > 0 && (
                  <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }} className={`p-2.5 rounded-full transition-all backdrop-blur-xl border border-white/5 ${showSettings ? 'bg-white/20 text-white' : 'bg-white/5 text-white hover:bg-white/15'}`}>
                      <Settings size={16} className={showSettings ? 'rotate-90 transition-transform' : 'transition-transform'} />
                    </button>
                    <AnimatePresence>
                      {showSettings && (
                        <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full right-0 mb-3.5 w-44 bg-zinc-950/85 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 shadow-[0_16px_48px_rgba(0,0,0,0.8)] overflow-hidden">
                          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 py-2">Quality</div>
                          <button onClick={() => setCurrentQuality(-1)} className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors text-white"><span>Auto</span>{currentQuality === -1 && <Check size={14} className="text-primary" />}</button>
                          {qualities.map((level: any, i: number) => (
                            <button key={i} onClick={() => setCurrentQuality(i)} className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors text-white"><span>{level.height}p</span>{currentQuality === i && <Check size={14} className="text-primary" />}</button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                <button onClick={toggleFullscreen} className="p-2.5 text-white hover:bg-white/15 rounded-full transition-all backdrop-blur-xl bg-white/5 border border-white/5">
                  {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                HLS.js ENGINE                               */
/* -------------------------------------------------------------------------- */
function HlsEngine({ currentChannel, containerRef, toggleFullscreen, isFullscreen, closePlayer }: any) {
  const { settings, updateSettings } = usePlayerStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const volume = settings.volume ?? 1;
  const isMuted = settings.isMuted ?? false;
  const setVolume = (val: number) => updateSettings({ volume: val });
  const setIsMuted = (muted: boolean) => updateSettings({ isMuted: muted });

  const [isBuffering, setIsBuffering] = useState(true);
  const [showVpnPopup, setShowVpnPopup] = useState(false);
  
  const [showSettings, setShowSettings] = useState(false);
  const hlsRef = useRef<Hls | null>(null);
  const [qualities, setQualities] = useState<any[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1);
  const loadingTimeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (!currentChannel || !videoRef.current) return;
    const video = videoRef.current;
    let hls: Hls | null = null;

    setIsBuffering(true); setShowVpnPopup(false); setIsPlaying(false); setShowSettings(false); setQualities([]); setCurrentQuality(-1);
    
    video.volume = settings.volume ?? 1;
    video.muted = settings.isMuted ?? false;
    
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    loadingTimeoutRef.current = setTimeout(() => { if (isBuffering || !isPlaying) setShowVpnPopup(true); }, 30000);

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => { setIsBuffering(false); setIsPlaying(true); if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current); };
    const handleError = () => setShowVpnPopup(true);

    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);

    if (Hls.isSupported()) {
      hls = new Hls({ maxBufferLength: 30, maxMaxBufferLength: 60 });
      hlsRef.current = hls;
      hls.loadSource(currentChannel.url);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const uniqueQualities = data.levels.filter((l, i, self) => i === self.findIndex((t) => t.height === l.height));
        setQualities(uniqueQualities);
        setCurrentQuality(hls!.currentLevel);
        
        if (settings.autoPlay) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(e => { if (e.name !== 'AbortError') console.log("Auto-play prevented", e); });
          }
        } else setIsBuffering(false);
      });
      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => setCurrentQuality(data.level));
      hls.on(Hls.Events.ERROR, (event, data) => { if (data.fatal) setShowVpnPopup(true); });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = currentChannel.url;
      video.addEventListener("loadedmetadata", () => {
        if (settings.autoPlay) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(e => { if (e.name !== 'AbortError') console.log("Auto-play prevented", e); });
          }
        } else setIsBuffering(false);
      });
    }

    return () => {
      if (hls) hls.destroy(); hlsRef.current = null;
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      video.removeEventListener('waiting', handleWaiting); video.removeEventListener('playing', handlePlaying); video.removeEventListener('error', handleError);
    };
  }, [currentChannel, settings.autoPlay]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) { videoRef.current.pause(); setIsPlaying(false); } 
    else videoRef.current.play().then(() => setIsPlaying(true)).catch(e => { if (e.name !== 'AbortError') console.log(e); });
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    const newMute = !isMuted;
    videoRef.current.muted = newMute; setIsMuted(newMute);
    if (!newMute && volume === 0) handleVolumeChange(1);
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    if (videoRef.current) videoRef.current.volume = val;
    if (val > 0 && isMuted) { setIsMuted(false); if (videoRef.current) videoRef.current.muted = false; }
    if (val === 0) { setIsMuted(true); if (videoRef.current) videoRef.current.muted = true; }
  };

  const handleQualityChange = (level: number) => {
    if (hlsRef.current) hlsRef.current.currentLevel = level;
    setCurrentQuality(level); setShowSettings(false);
  };

  return (
    <div className="absolute inset-0 bg-black">
      <video ref={videoRef} className="w-full h-full object-contain" playsInline />
      <ControlsOverlay
        currentChannel={currentChannel} closePlayer={closePlayer}
        isFullscreen={isFullscreen} toggleFullscreen={toggleFullscreen}
        isPlaying={isPlaying} togglePlay={togglePlay}
        isMuted={isMuted} toggleMute={toggleMute}
        volume={volume} setVolume={handleVolumeChange}
        isBuffering={isBuffering}
        showVpnPopup={showVpnPopup} setShowVpnPopup={setShowVpnPopup}
        showSettings={showSettings} setShowSettings={setShowSettings}
        qualities={qualities} currentQuality={currentQuality} setCurrentQuality={handleQualityChange}
        containerRef={containerRef}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            REACT-PLAYER ENGINE                             */
/* -------------------------------------------------------------------------- */
function ReactPlayerEngine({ currentChannel, containerRef, toggleFullscreen, isFullscreen, closePlayer }: any) {
  const { settings, updateSettings } = usePlayerStore();
  const playerRef = useRef<any>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const volume = settings.volume ?? 1;
  const isMuted = settings.isMuted ?? false;
  const setVolume = (val: number) => updateSettings({ volume: val });
  const setIsMuted = (muted: boolean) => updateSettings({ isMuted: muted });

  const [isBuffering, setIsBuffering] = useState(true);
  const [showVpnPopup, setShowVpnPopup] = useState(false);

  // Expose bundled Hls.js globally so ReactPlayer doesn't try to fetch it from a CDN
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).Hls) {
      (window as any).Hls = Hls;
    }
  }, []);

  useEffect(() => {
    setIsBuffering(true);
    setIsPlaying(false);
    setShowVpnPopup(false);
    
    // Slight delay to prevent immediate browser autoplay blocks
    const t = setTimeout(() => {
      if (settings.autoPlay) setIsPlaying(true);
    }, 300);
    return () => clearTimeout(t);
  }, [currentChannel]);

  const togglePlay = (e?: React.MouseEvent) => { e?.stopPropagation(); setIsPlaying(!isPlaying); };
  const toggleMute = (e?: React.MouseEvent) => { 
    e?.stopPropagation(); 
    const newMute = !isMuted;
    setIsMuted(newMute); 
    if (!newMute && volume === 0) setVolume(1);
  };
  const handleVolumeChange = (val: number) => {
    setVolume(val);
    if (val > 0 && isMuted) setIsMuted(false);
    if (val === 0) setIsMuted(true);
  };

  const PlayerComponent = ReactPlayer as any;

  return (
    <div className="absolute inset-0 bg-black">
      <PlayerComponent 
        ref={playerRef}
        url={currentChannel.url} 
        playing={isPlaying}
        volume={volume}
        muted={isMuted}
        controls={false} // Disable ugly native controls
        width="100%" 
        height="100%" 
        style={{ position: 'absolute', top: 0, left: 0, backgroundColor: 'black' }}
        onReady={() => setIsBuffering(false)}
        onStart={() => { setIsBuffering(false); setIsPlaying(true); }}
        onPlay={() => { setIsPlaying(true); setIsBuffering(false); }}
        onPause={() => setIsPlaying(false)}
        onError={(e: any) => {
          console.error("ReactPlayer Error:", e);
          setIsBuffering(false);
          setShowVpnPopup(true);
        }}
        config={{
          file: {
            forceHLS: true,
            attributes: { style: { width: '100%', height: '100%', objectFit: 'contain' } }
          }
        } as any}
      />
      <ControlsOverlay
        currentChannel={currentChannel} closePlayer={closePlayer}
        isFullscreen={isFullscreen} toggleFullscreen={toggleFullscreen}
        isPlaying={isPlaying} togglePlay={togglePlay}
        isMuted={isMuted} toggleMute={toggleMute}
        volume={volume} setVolume={handleVolumeChange}
        isBuffering={isBuffering}
        showVpnPopup={showVpnPopup} setShowVpnPopup={setShowVpnPopup}
        qualities={[]} 
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              VIDEO.JS ENGINE                               */
/* -------------------------------------------------------------------------- */
function VideoJsEngine({ currentChannel, containerRef, toggleFullscreen, isFullscreen, closePlayer }: any) {
  const { settings, updateSettings } = usePlayerStore();
  const placeholderRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const volume = settings.volume ?? 1;
  const isMuted = settings.isMuted ?? false;
  const setVolume = (val: number) => updateSettings({ volume: val });
  const setIsMuted = (muted: boolean) => updateSettings({ isMuted: muted });

  const [isBuffering, setIsBuffering] = useState(true);
  const [showVpnPopup, setShowVpnPopup] = useState(false);

  useEffect(() => {
    if (!placeholderRef.current) return;
    setIsBuffering(true);

    // Official Video.js React Pattern: Create the video element manually to avoid React DOM crashes
    const videoElement = document.createElement('video');
    videoElement.classList.add('video-js', 'vjs-default-skin');
    videoElement.style.width = '100%';
    videoElement.style.height = '100%';
    videoElement.style.objectFit = 'contain';
    videoElement.setAttribute('playsinline', 'true');
    
    placeholderRef.current.appendChild(videoElement);
    
    playerRef.current = videojs(videoElement, {
      controls: false, // Turn off native controls!
      autoplay: settings.autoPlay,
      preload: 'auto',
      sources: [{ src: currentChannel.url, type: 'application/x-mpegURL' }]
    });

    const p = playerRef.current;
    p.volume(settings.volume ?? 1);
    p.muted(settings.isMuted ?? false);

    p.on('play', () => { setIsPlaying(true); setIsBuffering(false); });
    p.on('pause', () => setIsPlaying(false));
    p.on('waiting', () => setIsBuffering(true));
    p.on('playing', () => setIsBuffering(false));
    p.on('error', () => { setIsBuffering(false); setShowVpnPopup(true); });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [currentChannel, settings.autoPlay]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!playerRef.current) return;
    if (isPlaying) playerRef.current.pause();
    else playerRef.current.play();
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!playerRef.current) return;
    const newMute = !isMuted;
    playerRef.current.muted(newMute);
    setIsMuted(newMute);
    if (!newMute && volume === 0) handleVolumeChange(1);
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    if (playerRef.current) playerRef.current.volume(val);
    if (val > 0 && isMuted) { setIsMuted(false); playerRef.current?.muted(false); }
    if (val === 0) { setIsMuted(true); playerRef.current?.muted(true); }
  };

  return (
    <div className="absolute inset-0 bg-black">
      <div ref={placeholderRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
      <ControlsOverlay
        currentChannel={currentChannel} closePlayer={closePlayer}
        isFullscreen={isFullscreen} toggleFullscreen={toggleFullscreen}
        isPlaying={isPlaying} togglePlay={togglePlay}
        isMuted={isMuted} toggleMute={toggleMute}
        volume={volume} setVolume={handleVolumeChange}
        isBuffering={isBuffering}
        showVpnPopup={showVpnPopup} setShowVpnPopup={setShowVpnPopup}
        qualities={[]}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */
export function Player() {
  const { currentChannel, setCurrentChannel, settings } = usePlayerStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (!currentChannel) return null;

  const closePlayer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentChannel(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, y: 100 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        drag={!isFullscreen}
        dragMomentum={false}
        whileDrag={{ scale: 1.02, cursor: "grabbing", boxShadow: "0 0 40px rgba(0,0,0,0.1)" }}
        className={`fixed z-[100] bg-black overflow-hidden shadow-lg border border-border group ${
          isFullscreen 
            ? "inset-0 rounded-none border-none" 
            : "bottom-24 md:bottom-8 right-4 md:right-8 w-[calc(100vw-2rem)] sm:w-[400px] md:w-[450px] lg:w-[500px] 2xl:w-[600px] aspect-video rounded-2xl cursor-grab"
        }`}
        ref={containerRef}
      >
        {settings.engine === 'hls' && (
          <HlsEngine 
            currentChannel={currentChannel} 
            containerRef={containerRef} 
            toggleFullscreen={toggleFullscreen} 
            isFullscreen={isFullscreen} 
            closePlayer={closePlayer} 
          />
        )}
        
        {settings.engine === 'react-player' && (
          <ReactPlayerEngine 
            currentChannel={currentChannel} 
            containerRef={containerRef} 
            toggleFullscreen={toggleFullscreen} 
            isFullscreen={isFullscreen} 
            closePlayer={closePlayer} 
          />
        )}
        
        {settings.engine === 'videojs' && (
          <VideoJsEngine 
            currentChannel={currentChannel} 
            containerRef={containerRef} 
            toggleFullscreen={toggleFullscreen} 
            isFullscreen={isFullscreen} 
            closePlayer={closePlayer} 
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
