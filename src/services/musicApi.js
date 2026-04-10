import { mockSongs } from '../data/mockSongs'

const ITUNES_BASE_URL = 'https://itunes.apple.com/search'
const JAMENDO_BASE_URL = 'https://api.jamendo.com/v3.0/tracks/'
const jamendoClientId = import.meta.env.VITE_JAMENDO_CLIENT_ID

const mapItunesSong = (item) => ({
  id: String(item.trackId),
  title: item.trackName,
  artist: item.artistName,
  album: item.collectionName,
  artwork:
    item.artworkUrl100?.replace('100x100', '300x300') ||
    'https://via.placeholder.com/300x300.png?text=No+Cover',
})

const mapJamendoSong = (item) => ({
  id: `jamendo-${item.id}`,
  title: item.name,
  artist: item.artist_name,
  album: item.album_name || 'Unknown album',
  artwork: item.image || 'https://via.placeholder.com/300x300.png?text=No+Cover',
})

async function searchJamendo(query) {
  if (!jamendoClientId) {
    return []
  }

  const jamendoUrl =
    `${JAMENDO_BASE_URL}?client_id=${jamendoClientId}` +
    `&format=json&limit=12&namesearch=${encodeURIComponent(query)}`

  const response = await fetch(jamendoUrl)
  if (!response.ok) {
    throw new Error('Jamendo request failed.')
  }

  const data = await response.json()
  if (!data.results || data.results.length === 0) {
    return []
  }

  return data.results.map(mapJamendoSong)
}

export async function searchSongs(query) {
  const url = `${ITUNES_BASE_URL}?term=${encodeURIComponent(query)}&entity=song&limit=12`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('API response was not successful.')
    }

    const data = await response.json()
    if (!data.results || data.results.length === 0) {
      return mockSongs
    }

    return data.results.map(mapItunesSong)
  } catch {
    try {
      const jamendoResults = await searchJamendo(query)
      if (jamendoResults.length > 0) {
        return jamendoResults
      }
      return mockSongs
    } catch {
      return mockSongs
    }
  }
}
