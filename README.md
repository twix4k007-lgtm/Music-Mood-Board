# Music Mood Board Web App

A beginner-friendly React app to search songs and save them into a personal mood board.

## Tech Stack

- HTML
- CSS (custom, no framework)
- JavaScript
- React (functional components + hooks)
- Vite

## Features

- Search songs from a public music API
- Show songs as clean card layout
- Add songs to Mood Board
- Remove songs from Mood Board
- Choose a mood category (`Chill`, `Hype`, `Sad`)
- Persist Mood Board in `localStorage`
- Fallback data if API fails (app still works)

## APIs Used

### Primary API (no key needed)

- **iTunes Search API**: `https://itunes.apple.com/search`
- Free and public
- No API key required

### Fallback API (optional key)

- **Jamendo API**: `https://api.jamendo.com`
- Used only if iTunes request fails and a Jamendo key is provided

### Final fallback

- Local mock dataset (`src/data/mockSongs.js`) so the app never fully breaks

## Folder Structure

```bash
music-mood-board/
├── src/
│   ├── components/
│   │   ├── MoodBoard.jsx
│   │   ├── SearchBar.jsx
│   │   └── SongCard.jsx
│   ├── data/
│   │   └── mockSongs.js
│   ├── services/
│   │   └── musicApi.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .env.example
├── package.json
└── README.md
```

## Setup Guide (Step by Step)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the app:

   ```bash
   npm run dev
   ```

3. Open the local URL shown in terminal (usually `http://localhost:5173`).

## API Key Setup (Optional for Jamendo fallback)

You do **not** need any key for iTunes.

If you also want Jamendo fallback:

1. Create a free Jamendo developer account at [Jamendo Developer](https://developer.jamendo.com/v3.0)
2. Copy your `client_id`
3. Create a `.env` file in project root
4. Add:

   ```env
   VITE_JAMENDO_CLIENT_ID=your_client_id_here
   ```

5. Restart dev server after editing `.env`

## Where API key is read in code

- `src/services/musicApi.js`
- Variable used: `import.meta.env.VITE_JAMENDO_CLIENT_ID`

## Example API response handling

From iTunes API, fields are mapped like this:

- `trackId` -> `id`
- `trackName` -> `title`
- `artistName` -> `artist`
- `collectionName` -> `album`
- `artworkUrl100` -> `artwork`

If API returns empty/invalid data or network fails:

- try Jamendo (if key exists)
- else use `mockSongs`

## Notes for Beginners

- Main state is in `App.jsx` using `useState` and `useEffect`
- `SearchBar` handles input and submit
- `SongCard` shows each song and mood select
- `MoodBoard` lists saved songs and remove action
- `localStorage` keeps your board after refresh
