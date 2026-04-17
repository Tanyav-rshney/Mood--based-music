import { create } from 'zustand';

const useFavoritesStore = create((set, get) => ({
  favorites: [],
  
  toggleFavorite: (track) => {
    const { favorites } = get();
    const isFav = favorites.find(t => t.id === track.id);
    
    if (isFav) {
      set({ favorites: favorites.filter(t => t.id !== track.id) });
    } else {
      set({ favorites: [...favorites, track] });
    }
  },
  
  isFavorite: (trackId) => {
    return get().favorites.some(t => t.id === trackId);
  }
}));

export default useFavoritesStore;
