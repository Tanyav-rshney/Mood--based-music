import React, { useEffect, useRef } from 'react';
import { 
  MdPlayArrow, MdPause, MdSkipNext, MdSkipPrevious, MdVolumeUp, MdFavorite
} from 'react-icons/md';
import usePlayerStore from '../../store/usePlayerStore';
import { Howl, Howler } from 'howler';

const FloatingPlayer = () => {
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, volume, setVolume, progress, setProgress } = usePlayerStore();
  const soundRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (soundRef.current) soundRef.current.unload();
    if (currentTrack?.audioUrl) {
      soundRef.current = new Howl({
        src: [currentTrack.audioUrl],
        html5: true,
        volume: volume,
        onplay: () => updateProgress(),
        onend: () => nextTrack()
      });
      if (isPlaying) soundRef.current.play();
    }
    return () => {
      if (soundRef.current) soundRef.current.unload();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [currentTrack]);

  useEffect(() => {
    if (!soundRef.current) return;
    if (isPlaying && !soundRef.current.playing()) soundRef.current.play();
    else if (!isPlaying && soundRef.current.playing()) soundRef.current.pause();
  }, [isPlaying]);

  useEffect(() => { Howler.volume(volume); }, [volume]);

  const updateProgress = () => {
    if (soundRef.current && soundRef.current.playing()) {
      setProgress(soundRef.current.seek() || 0);
      rafRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setProgress(time);
    if (soundRef.current) soundRef.current.seek(time);
  };

  const duration = currentTrack?.duration || soundRef.current?.duration() || 0;
  const progressPercent = duration ? (progress / duration) * 100 : 0;

  if (!currentTrack) return null; // Only show if track exists

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-[94%] md:w-auto md:min-w-[500px] acrylic rounded-full p-2 pr-6 flex items-center justify-between sm:gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-float">
      
      {/* Vinyl/Cover Art */}
      <div className="flex items-center gap-4 min-w-0">
        <div className={`w-14 h-14 rounded-full overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.2)] ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}>
          <img src={currentTrack.image} alt="art" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col hidden sm:flex truncate w-32">
          <span className="font-bold text-sm text-white truncate">{currentTrack.title}</span>
          <span className="text-xs text-textMuted font-medium truncate">{currentTrack.artist}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mx-4">
        <button onClick={prevTrack} className="text-white/60 hover:text-white hover:scale-110 transition-all"><MdSkipPrevious className="text-2xl" /></button>
        <button 
          onClick={togglePlay}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          {isPlaying ? <MdPause className="text-2xl" /> : <MdPlayArrow className="text-3xl ml-1" />}
        </button>
        <button onClick={nextTrack} className="text-white/60 hover:text-white hover:scale-110 transition-all"><MdSkipNext className="text-2xl" /></button>
      </div>

      {/* Thin Progress Ring / Line wrapper */}
      <div className="hidden md:flex items-center w-32 relative">
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden absolute">
          <div className="h-full bg-gradient-to-r from-primary to-secondary relative" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <input type="range" min={0} max={duration} value={progress} onChange={handleSeek} className="w-full h-4 opacity-0 cursor-pointer relative z-10" />
      </div>

    </div>
  );
};

export default FloatingPlayer;
