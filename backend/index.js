const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Dummy track data for testing UI without real Spotify connection
const dummyTracks = [
  {
    id: 'track-1',
    title: 'Neon Nights',
    artist: 'Static Pulse',
    genres: ['Synthwave', 'Electronic'],
    image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&h=500&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 'track-2',
    title: 'Cyber Dreams',
    artist: 'Velvet Echo',
    genres: ['Cyberpunk', 'Chill'],
    image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500&h=500&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 'track-3',
    title: 'Electric Horizon',
    artist: 'The Circuit',
    genres: ['Electronic', "Dance"],
    image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=500&h=500&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: 'track-4',
    title: 'Midnight Drive',
    artist: 'Kavinsky',
    genres: ['Synthwave', "Driving"],
    image: 'https://images.unsplash.com/photo-1517430529647-90cce5b4fb15?w=500&h=500&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  }
];

// Health route
app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'Backend API is running 🚀',
  });
});

// Spotify Status Map
app.get('/api/spotify/status', (req, res) => {
  // Returns dummy status
  res.json({
    configured: true,
    available: false,
    message: 'Spotify is not connected. Serving dummy local backend tracks.'
  });
});

// Mock recommendation generation based on payload
app.post('/api/recommendations', (req, res) => {
  const { artists = [], genres = [], mood = 'chilled', intensity = 50, profile = {} } = req.body || {};
  
  // Here we would normally plug into Spotify API or a Python ML script, 
  // but for now we return our dummyTracks with a fake explanation.
  const explanation = `Returning ${dummyTracks.length} local dummy tracks for mood "${mood}" and intensity ${intensity}. Integrate real logic here.`;
  
  setTimeout(() => {
     res.json({
       recommendations: dummyTracks,
       explanation: explanation,
       source: 'dummy-local'
     });
  }, 1200); // add a slight delay to simulate network/computation so skeleton loaders spin
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});