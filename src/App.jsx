import { useEffect, useState } from 'react'
import './App.css'
import SearchBar from './components/SearchBar'
import SongCard from './components/SongCard'
import MoodBoard from './components/MoodBoard'
import { searchSongs } from './services/musicApi'

function App() {
  const [songs, setSongs] = useState([])
  const [moodBoard, setMoodBoard] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const savedBoard = localStorage.getItem('music-mood-board')
    if (savedBoard) {
      try {
        setMoodBoard(JSON.parse(savedBoard))
      } catch {
        setMoodBoard([])
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('music-mood-board', JSON.stringify(moodBoard))
  }, [moodBoard])

  const handleSearch = async (query) => {
    setLoading(true)
    setError('')
    try {
      const results = await searchSongs(query)
      setSongs(results)
    } catch {
      setSongs([])
      setError('Something went wrong while searching. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const addToMoodBoard = (song, mood) => {
    setMoodBoard((prev) => {
      const exists = prev.some((item) => item.id === song.id)
      if (exists) {
        return prev
      }
      return [...prev, { ...song, mood }]
    })
  }

  const removeFromMoodBoard = (songId) => {
    setMoodBoard((prev) => prev.filter((song) => song.id !== songId))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Music Mood Board</h1>
        <p>Search songs and build your vibe list.</p>
      </header>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {error ? <p className="error-message">{error}</p> : null}

      <section className="songs-section">
        <h2>Search Results</h2>
        {loading ? <p className="status-text">Loading songs...</p> : null}
        {!loading && songs.length === 0 ? (
          <p className="status-text">Search for a song to get started.</p>
        ) : null}
        <div className="song-grid">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} onAdd={addToMoodBoard} />
          ))}
        </div>
      </section>

      <MoodBoard songs={moodBoard} onRemove={removeFromMoodBoard} />
    </div>
  )
}

export default App
