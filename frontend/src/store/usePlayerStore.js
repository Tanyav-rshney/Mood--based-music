import { create } from 'zustand';

const usePlayerStore = create((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  playlist: [],
  volume: 0.8,
  progress: 0,
  
  // Actions
  playTrack: (track, newPlaylist = null) => {
    set({ 
      currentTrack: track, 
      isPlaying: true,
      ...(newPlaylist ? { playlist: newPlaylist } : {})
    });
  },
  
  togglePlay: () => {
    const { currentTrack, isPlaying } = get();
    if (currentTrack) {
      set({ isPlaying: !isPlaying });
    }
  },
  
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  
  nextTrack: () => {
    const { currentTrack, playlist } = get();
    if (!currentTrack || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    if (currentIndex >= 0 && currentIndex < playlist.length - 1) {
      set({ currentTrack: playlist[currentIndex + 1], isPlaying: true, progress: 0 });
    } else {
      // Loop or stop
      set({ currentTrack: playlist[0], isPlaying: true, progress: 0 });
    }
  },
  
  prevTrack: () => {
    const { currentTrack, playlist, progress } = get();
    if (!currentTrack || playlist.length === 0) return;
    
    // If progress is > 3 seconds, just restart song (common player behavior)
    if (progress > 3) {
      set({ progress: 0 });
      return;
    }
    
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      set({ currentTrack: playlist[currentIndex - 1], isPlaying: true, progress: 0 });
    } else {
      set({ currentTrack: playlist[playlist.length - 1], isPlaying: true, progress: 0 });
    }
  }
}));

export default usePlayerStore;
