import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { moods } from '../utils/constants';
import { getRecommendations } from '../services/api';
import TrackCard from '../components/Cards/TrackCard';
import useUIStore from '../store/useUIStore';

// Stagger variant for uniform grid
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 25 } }
};

const Home = () => {
  const [selectedMood, setSelectedMood] = useState('hyper');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { voiceQuery } = useUIStore();

  const handleGenerate = async (moodOverride) => {
    setLoading(true);
    setRecommendations([]);

    const data = await getRecommendations({
      mood: moodOverride || selectedMood,
      intensity: 80,
      query: voiceQuery 
    });

    setRecommendations(data.recommendations || []);
    setLoading(false);
  };

  useEffect(() => { 
    handleGenerate(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (voiceQuery) handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceQuery]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto w-[92%] max-w-7xl pt-10"
    >
      
      {/* Immersive Giant Header */}
      <div className="flex flex-col items-center justify-center text-center mt-6 mb-16 relative">
         <motion.div 
           animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
           transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[20vw] bg-primary/20 blur-[130px] rounded-full pointer-events-none z-0"
         />

         <motion.h1 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.1 }}
           className="text-5xl sm:text-7xl md:text-8xl font-display font-black tracking-tighter z-10 drop-shadow-2xl"
         >
           Discover your <br />
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary animate-gradient-x">Sonic Realm</span>
         </motion.h1>
         
         <motion.p 
           initial={{ y: 10, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.2 }}
           className="mt-6 text-[15px] sm:text-lg text-textMuted max-w-2xl z-10 font-medium px-4"
         >
           {voiceQuery ? `Showing signals for: "${voiceQuery}"` : "Transcend traditional playlists. Choose a frequency. Let the engine weave a universe of sounds curated entirely for this moment."}
         </motion.p>
         
         {/* Professional Unique Mood Tabs */}
         <motion.div 
           initial={{ y: 10, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.3 }}
           className="mt-12 flex flex-wrap justify-center gap-3 z-10 relative px-4 w-full"
         >
            {moods.map(m => (
              <button 
                key={m.id}
                onClick={() => { setSelectedMood(m.id); handleGenerate(m.id); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold transition-all duration-300 text-xs sm:text-sm uppercase tracking-wide backdrop-blur-lg border shadow-sm ${
                  selectedMood === m.id 
                    ? 'bg-white/10 text-white border-primary/50 shadow-[0_0_20px_rgba(255,0,127,0.3)] ring-1 ring-primary/50 scale-105' 
                    : 'transparent border-white/5 text-textMuted hover:text-white hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <span className="text-lg opacity-80">{m.emoji}</span> <span>{m.label}</span>
              </button>
            ))}
         </motion.div>
      </div>

      <div className="flex justify-between items-end mb-8 z-20 relative px-2 border-b border-white/5 pb-4">
         <h2 className="text-3xl font-display font-black tracking-tight text-white/90">
           Incoming Signals
         </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 z-20 relative">
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ height: ["20px", "60px", "20px"] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                className="w-2 rounded-full bg-gradient-to-t from-primary to-secondary shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              />
            ))}
          </div>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10 z-20 relative mb-12"
        >
          {recommendations.map((track) => (
             <motion.div key={track.id} variants={itemVariants} className="will-change-transform">
               <TrackCard track={track} contextPlaylist={recommendations} />
             </motion.div>
          ))}
        </motion.div>
      )}

    </motion.div>
  );
};

export default Home;
