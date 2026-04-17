import React, { useState } from 'react';
import { MdPlayArrow, MdPause, MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { motion } from 'framer-motion';
import usePlayerStore from '../../store/usePlayerStore';
import useFavoritesStore from '../../store/useFavoritesStore';

const TrackCard = ({ track, contextPlaylist }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  
  const isThisTrackPlaying = currentTrack?.id === track.id;
  const isFav = isFavorite(track.id);
  const [isHovered, setIsHovered] = useState(false);

  // High quality fallback rendering for track art
  const imageToUse = track.image && !track.image.includes('images.unsplash.com/error') 
    ? track.image 
    : `https://picsum.photos/seed/${track.title.replace(/\s+/g, '')}/400/400`;

  const handlePlay = (e) => {
    e.stopPropagation();
    if (isThisTrackPlaying) togglePlay();
    else playTrack(track, contextPlaylist);
  };

  return (
    <motion.div 
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative flex flex-col gap-4 cursor-pointer w-full max-w-sm mx-auto"
    >
      {/* Artwork Container - Professional Squarish Proportion */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg transition-all duration-500 bg-surface">
        <motion.img 
          src={imageToUse} 
          alt={track.title} 
          animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full h-full object-cover" 
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${Math.random()}/400/400`; }}
        />
        
        {/* Dynamic Edge Glow based on state */}
        <div className={`absolute inset-0 ring-2 ring-inset transition-all duration-500 rounded-2xl pointer-events-none ${isThisTrackPlaying ? 'ring-primary shadow-[inset_0_0_20px_rgba(255,0,127,0.5)]' : 'ring-white/10 group-hover:ring-white/30'}`}></div>

        {/* Darkening Glass Play Overlay */}
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center ${isHovered || isThisTrackPlaying ? 'opacity-100' : 'opacity-0'}`}>
           <button 
             onClick={handlePlay}
             className="w-16 h-16 rounded-full acrylic flex items-center justify-center text-white border border-white/20 hover:scale-110 transition-transform shadow-[0_0_30px_rgba(0,240,255,0.3)]"
           >
             {isThisTrackPlaying && isPlaying ? (
               <MdPause className="text-4xl shadow-black" />
             ) : (
               <MdPlayArrow className="text-4xl pl-1 shadow-black" />
             )}
           </button>
        </div>

        {/* Favorite Icon Float */}
        <button 
          onClick={(e) => { e.stopPropagation(); toggleFavorite(track); }} 
          className={`absolute top-4 right-4 p-2.5 rounded-full transition-all duration-300 acrylic border border-white/10 hover:scale-110 hover:bg-white/20 ${isHovered || isFav ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
        >
          {isFav ? <MdFavorite className="text-xl text-primary drop-shadow-[0_0_10px_rgba(255,0,127,0.8)]" /> : <MdFavoriteBorder className="text-xl text-white" />}
        </button>

        {/* Live Audio Bars Indicator */}
        {isThisTrackPlaying && isPlaying && (
            <div className="absolute bottom-4 left-4 flex gap-1 items-end h-4 pointer-events-none">
                <div className="w-1 bg-secondary animate-[bounce_1s_infinite] h-full"></div>
                <div className="w-1 bg-primary animate-[bounce_1s_infinite_100ms] h-full"></div>
                <div className="w-1 bg-secondary animate-[bounce_1s_infinite_200ms] h-full"></div>
            </div>
        )}
      </div>

      {/* Track Info - Clean and minimal */}
      <div className="flex flex-col px-1">
        <h3 className={`font-display font-semibold text-[17px] leading-tight truncate transition-colors duration-300 ${isThisTrackPlaying ? 'text-primary drop-shadow-[0_0_8px_rgba(255,0,127,0.4)]' : 'text-white group-hover:text-secondary'}`}>
          {track.title}
        </h3>
        <p className="text-textMuted font-medium text-[13px] tracking-wide truncate mt-1 transition-colors group-hover:text-white/80">{track.artist}</p>
      </div>
    </motion.div>
  );
};

export default TrackCard;
