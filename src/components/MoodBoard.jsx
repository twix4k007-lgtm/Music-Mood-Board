function MoodBoard({ songs, onRemove }) {
  return (
    <section className="mood-board">
      <h2>Your Mood Board</h2>
      {songs.length === 0 ? (
        <p className="status-text">No songs yet. Add songs from search results.</p>
      ) : null}
      <div className="mood-list">
        {songs.map((song) => (
          <article key={song.id} className="mood-item">
            <div>
              <h3>{song.title}</h3>
              <p>{song.artist}</p>
            </div>
            <span className={`mood-tag mood-${song.mood.toLowerCase()}`}>
              {song.mood}
            </span>
            <button onClick={() => onRemove(song.id)}>Remove</button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default MoodBoard
