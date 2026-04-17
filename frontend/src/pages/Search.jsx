import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdSearch, MdClear, MdMusicNote } from 'react-icons/md';
import TrackCard from '../components/Cards/TrackCard';
import API from '../services/api';

const moodCategories = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: 'from-yellow-500/30 to-amber-600/10', border: 'border-yellow-500/30' },
  { id: 'sad', emoji: '😢', label: 'Sad', color: 'from-blue-500/30 to-blue-600/10', border: 'border-blue-500/30' },
  { id: 'romantic', emoji: '💕', label: 'Romantic', color: 'from-pink-500/30 to-rose-600/10', border: 'border-pink-500/30' },
  { id: 'energetic', emoji: '🔥', label: 'Energetic', color: 'from-orange-500/30 to-red-600/10', border: 'border-orange-500/30' },
  { id: 'calm', emoji: '🧘', label: 'Calm', color: 'from-green-500/30 to-emerald-600/10', border: 'border-green-500/30' },
  { id: 'chilled', emoji: '🌊', label: 'Chilled', color: 'from-cyan-500/30 to-sky-600/10', border: 'border-cyan-500/30' },
  { id: 'hyper', emoji: '⚡', label: 'Hyper', color: 'from-amber-500/30 to-orange-600/10', border: 'border-amber-500/30' },
  { id: 'melancholy', emoji: '🌙', label: 'Melancholy', color: 'from-purple-500/30 to-violet-600/10', border: 'border-purple-500/30' },
  { id: 'focus', emoji: '🎯', label: 'Focus', color: 'from-teal-500/30 to-teal-600/10', border: 'border-teal-500/30' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 250, damping: 25 } },
};

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodResults, setMoodResults] = useState([]);
  const [moodLoading, setMoodLoading] = useState(false);

  // Debounced search
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setSearched(true);
      setSelectedMood(null);
      try {
        const res = await API.get(`/api/songs?search=${encodeURIComponent(query.trim())}&limit=30`);
        const songs = res.data?.data?.songs || [];
        // Map _id to id for TrackCard
        setResults(songs.map((s) => ({ ...s, id: s._id || s.id })));
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // Browse by mood
  const handleMoodClick = useCallback(async (moodId) => {
    if (selectedMood === moodId) {
      setSelectedMood(null);
      setMoodResults([]);
      return;
    }
    setSelectedMood(moodId);
    setQuery('');
    setResults([]);
    setSearched(false);
    setMoodLoading(true);
    try {
      const res = await API.get(`/api/songs?mood=${moodId}&limit=30&sort=popularity&order=desc`);
      const songs = res.data?.data?.songs || [];
      setMoodResults(songs.map((s) => ({ ...s, id: s._id || s.id })));
    } catch (err) {
      console.error('Mood browse error:', err);
      setMoodResults([]);
    } finally {
      setMoodLoading(false);
    }
  }, [selectedMood]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSearched(false);
  };

  const displayResults = searched ? results : selectedMood ? moodResults : [];
  const isLoading = loading || moodLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mx-auto w-[92%] max-w-7xl pt-10 pb-20 min-h-screen"
    >
      {/* Search Header */}
      <div className="mb-10">
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl sm:text-5xl font-display font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-textMuted"
        >
          Discover
        </motion.h1>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative max-w-2xl"
        >
          <MdSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-textMuted text-2xl" />
          <input
            id="search-input"
            type="text"
            placeholder="Search songs, artists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-12 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 focus:bg-white/8 transition-all backdrop-blur-lg"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted hover:text-white transition-colors p-1"
            >
              <MdClear className="text-xl" />
            </button>
          )}
        </motion.div>
      </div>

      {/* Browse by Mood */}
      {!searched && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-xl font-display font-bold mb-5 text-white/90">Browse by Mood</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {moodCategories.map((mood) => (
              <motion.button
                key={mood.id}
                onClick={() => handleMoodClick(mood.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border backdrop-blur-lg transition-all duration-300 ${
                  selectedMood === mood.id
                    ? `bg-gradient-to-br ${mood.color} ${mood.border} shadow-lg scale-105 ring-1 ring-white/20`
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs font-bold text-textMuted">{mood.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center items-center h-48">
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: ['20px', '50px', '20px'] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
                className="w-2 rounded-full bg-gradient-to-t from-primary to-secondary"
              />
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {!isLoading && displayResults.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
            <h2 className="text-2xl font-display font-bold text-white/90">
              {searched ? `Results for "${query}"` : `${selectedMood?.charAt(0).toUpperCase()}${selectedMood?.slice(1)} Songs`}
            </h2>
            <span className="text-sm text-textMuted">{displayResults.length} songs</span>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10"
          >
            {displayResults.map((track) => (
              <motion.div key={track.id} variants={itemVariants} className="will-change-transform">
                <TrackCard track={track} contextPlaylist={displayResults} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && searched && results.length === 0 && query.trim() && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <MdMusicNote className="text-6xl text-textMuted mb-4" />
          <h3 className="text-xl font-display font-bold text-textMuted mb-2">No results found</h3>
          <p className="text-sm text-textMuted">
            Try searching for a different song or artist
          </p>
        </motion.div>
      )}

      {/* Empty State - No search, no mood selected */}
      {!searched && !selectedMood && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <MdSearch className="text-4xl text-textMuted" />
          </div>
          <h3 className="text-lg font-display font-bold text-textMuted mb-2">Search for songs & artists</h3>
          <p className="text-sm text-textMuted max-w-md">
            Type a song name or artist, or browse by mood to discover Indian music across all emotions
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Search;
