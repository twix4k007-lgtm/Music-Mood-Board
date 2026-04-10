import { useState } from 'react'

const MOODS = ['Chill', 'Hype', 'Sad']

function SongCard({ song, onAdd }) {
  const [selectedMood, setSelectedMood] = useState(MOODS[0])

  return (
    <article className="song-card">
      <img src={song.artwork} alt={`${song.title} cover`} />
      <div className="song-info">
        <h3>{song.title}</h3>
        <p>{song.artist}</p>
        <p className="sub-text">{song.album}</p>
      </div>
      <div className="song-actions">
        <select
          value={selectedMood}
          onChange={(event) => setSelectedMood(event.target.value)}
        >
          {MOODS.map((mood) => (
            <option key={mood} value={mood}>
              {mood}
            </option>
          ))}
        </select>
        <button onClick={() => onAdd(song, selectedMood)}>Add</button>
      </div>
    </article>
  )
}

export default SongCard
