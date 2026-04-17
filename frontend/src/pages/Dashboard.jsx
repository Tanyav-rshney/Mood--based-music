import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MdAccessTime, MdMusicNote, MdFavorite, MdTrendingUp,
  MdPerson, MdHistory, MdBarChart, MdLogout, MdStar
} from 'react-icons/md';
import useAuthStore from '../store/useAuthStore';
import { dashboardAPI } from '../services/api';

const moodEmojis = {
  happy: '😊', sad: '😢', calm: '🧘', energetic: '🔥',
  romantic: '💕', melancholy: '🌙', focus: '🎯', hyper: '⚡', chilled: '🌊',
};

const moodColors = {
  happy: '#facc15', sad: '#60a5fa', calm: '#34d399', energetic: '#f97316',
  romantic: '#f472b6', melancholy: '#a78bfa', focus: '#2dd4bf', hyper: '#fb923c', chilled: '#38bdf8',
};

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardAPI.getDashboard();
        setData(res.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: ['20px', '60px', '20px'] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
              className="w-2 rounded-full bg-gradient-to-t from-primary to-secondary"
            />
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const userInfo = data?.user || user || {};
  const moodAnalytics = data?.moodAnalytics || [];
  const topArtists = data?.topArtists || [];
  const recentHistory = data?.recentHistory || [];
  const moodTimeline = data?.moodTimeline || [];
  const dailyListening = data?.dailyListening || [];
  const favorites = data?.favorites || [];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <MdBarChart /> },
    { id: 'history', label: 'History', icon: <MdHistory /> },
    { id: 'favorites', label: 'Favorites', icon: <MdFavorite /> },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-auto">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[35vw] h-[35vw] bg-secondary/10 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-[0_0_30px_rgba(255,0,127,0.4)] text-3xl font-display font-black text-white">
              {userInfo.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-black text-white">{userInfo.name || 'User'}</h1>
              <p className="text-sm text-textMuted">{userInfo.email}</p>
              <p className="text-xs text-textMuted mt-0.5">
                Member since {userInfo.memberSince ? new Date(userInfo.memberSince).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'Recently'}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-white/5 border border-white/10 text-textMuted hover:text-white hover:bg-white/10 transition-all"
            >
              ← Home
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2"
            >
              <MdLogout /> Logout
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: <MdAccessTime className="text-2xl" />, value: stats.totalListeningTime?.formatted || '0h 0m', label: 'Listening Time', gradient: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/20' },
            { icon: <MdMusicNote className="text-2xl" />, value: stats.totalSongsPlayed || 0, label: 'Songs Played', gradient: 'from-blue-500/20 to-blue-600/5', border: 'border-blue-500/20' },
            { icon: <MdTrendingUp className="text-2xl" />, value: stats.totalMoodsExplored || 0, label: 'Moods Explored', gradient: 'from-green-500/20 to-green-600/5', border: 'border-green-500/20' },
            { icon: <MdFavorite className="text-2xl" />, value: stats.favoritesCount || 0, label: 'Favorites', gradient: 'from-pink-500/20 to-pink-600/5', border: 'border-pink-500/20' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className={`p-5 rounded-2xl bg-gradient-to-br ${stat.gradient} border ${stat.border} backdrop-blur-xl`}
            >
              <div className="text-textMuted mb-3">{stat.icon}</div>
              <p className="text-2xl font-display font-black text-white">{stat.value}</p>
              <p className="text-xs text-textMuted mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Favorite Mood Badge */}
        {stats.favoriteMood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8 p-4 rounded-2xl acrylic flex items-center gap-4"
          >
            <span className="text-4xl">{moodEmojis[stats.favoriteMood] || '🎵'}</span>
            <div>
              <p className="text-xs text-textMuted font-semibold uppercase tracking-wider">Your Dominant Mood</p>
              <p className="text-xl font-display font-black text-white capitalize">{stats.favoriteMood}</p>
            </div>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 bg-white/5 p-1.5 rounded-2xl w-fit border border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                  : 'text-textMuted hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Listening Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl acrylic"
            >
              <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                <MdBarChart className="text-secondary" /> Last 7 Days
              </h3>
              <div className="flex items-end justify-between gap-2 h-40">
                {dailyListening.map((day, i) => {
                  const maxMin = Math.max(...dailyListening.map((d) => d.minutesListened), 1);
                  const pct = (day.minutesListened / maxMin) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs text-textMuted">{day.minutesListened}m</span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(pct, 5)}%` }}
                        transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                        className="w-full rounded-t-lg bg-gradient-to-t from-primary/60 to-secondary/60 min-h-[4px]"
                      />
                      <span className="text-xs text-textMuted font-semibold">{day.day}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Mood Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl acrylic"
            >
              <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                <MdStar className="text-yellow-400" /> Mood Distribution
              </h3>
              {moodAnalytics.length > 0 ? (
                <div className="space-y-3">
                  {moodAnalytics.slice(0, 6).map((mood, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-lg w-8">{moodEmojis[mood.mood] || '🎵'}</span>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-semibold capitalize">{mood.mood}</span>
                          <span className="text-xs text-textMuted">{mood.percentage}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${mood.percentage}%` }}
                            transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: moodColors[mood.mood] || '#888' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-textMuted text-sm text-center py-8">No mood data yet. Start exploring music!</p>
              )}
            </motion.div>

            {/* Top Artists */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl acrylic"
            >
              <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                <MdPerson className="text-primary" /> Top Artists
              </h3>
              {topArtists.length > 0 ? (
                <div className="space-y-3">
                  {topArtists.slice(0, 8).map((entry, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary/30 to-secondary/30 flex items-center justify-center text-xs font-bold text-white">
                        {i + 1}
                      </div>
                      <span className="flex-1 text-sm font-semibold">{entry.artist}</span>
                      <span className="text-xs text-textMuted">{entry.count} plays</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-textMuted text-sm text-center py-8">Listen to some songs to see your top artists!</p>
              )}
            </motion.div>

            {/* Mood Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl acrylic"
            >
              <h3 className="text-lg font-display font-bold mb-4">🕐 Recent Moods</h3>
              {moodTimeline.length > 0 ? (
                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                  {moodTimeline.slice(0, 15).map((entry, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                      <span className="text-lg">{moodEmojis[entry.mood] || '🎵'}</span>
                      <div className="flex-1">
                        <span className="text-sm font-semibold capitalize">{entry.mood}</span>
                        {entry.rawInput && <p className="text-xs text-textMuted truncate">"{entry.rawInput}"</p>}
                      </div>
                      <span className="text-xs text-textMuted">
                        {new Date(entry.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-textMuted text-sm text-center py-8">No mood history yet!</p>
              )}
            </motion.div>
          </div>
        )}

        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl acrylic p-6"
          >
            <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
              <MdHistory className="text-secondary" /> Listening History
            </h3>
            {recentHistory.length > 0 ? (
              <div className="space-y-2">
                {recentHistory.map((entry, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg">
                      {moodEmojis[entry.songMood] || '🎵'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{entry.songTitle}</p>
                      <p className="text-xs text-textMuted truncate">{entry.songArtist}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-textMuted capitalize">{entry.songMood}</p>
                      <p className="text-xs text-textMuted">
                        {entry.duration ? `${Math.round(entry.duration / 60)}m` : '—'}
                      </p>
                    </div>
                    <span className="text-xs text-textMuted flex-shrink-0">
                      {new Date(entry.listenedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <MdMusicNote className="text-5xl text-textMuted mx-auto mb-4" />
                <p className="text-textMuted">No listening history yet.</p>
                <p className="text-xs text-textMuted mt-1">Start playing songs to build your history!</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'favorites' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl acrylic p-6"
          >
            <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
              <MdFavorite className="text-pink-400" /> Favorite Songs
            </h3>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {favorites.map((song, i) => (
                  <motion.div
                    key={song._id || i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="group p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-white/5">
                      <img
                        src={song.image}
                        alt={song.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <p className="text-sm font-semibold truncate">{song.title}</p>
                    <p className="text-xs text-textMuted truncate">{song.artist}</p>
                    <div className="mt-2 flex gap-1 flex-wrap">
                      {song.genres?.slice(0, 2).map((g, gi) => (
                        <span key={gi} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                          {g}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <MdFavorite className="text-5xl text-textMuted mx-auto mb-4" />
                <p className="text-textMuted">No favorites yet.</p>
                <p className="text-xs text-textMuted mt-1">Heart some songs to see them here!</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
