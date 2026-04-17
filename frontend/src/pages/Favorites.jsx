import React from 'react';
import { motion } from 'framer-motion';
import useFavoritesStore from '../store/useFavoritesStore';
import TrackCard from '../components/Cards/TrackCard';
import { MdLibraryMusic } from 'react-icons/md';

const Favorites = () => {
  const { favorites } = useFavoritesStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen"
    >
      <div className="mb-10 flex items-center gap-4">
        <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(223,142,255,0.3)]">
           <MdLibraryMusic className="text-5xl text-background" />
        </div>
        <div>
           <p className="text-sm font-bold uppercase tracking-wider text-primary mb-1">Playlist</p>
           <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight">Your Favorites</h1>
           <p className="text-textMuted mt-2 font-medium">{favorites.length} {favorites.length === 1 ? 'song' : 'songs'}</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-textMuted">
          <MdLibraryMusic className="text-6xl mb-4 opacity-50" />
          <p className="text-lg">You haven't saved any tracks yet.</p>
          <p className="text-sm mt-2">Go to Home or Search and tap the heart icon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(track => (
            <TrackCard key={`fav-${track.id}`} track={track} contextPlaylist={favorites} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Favorites;
