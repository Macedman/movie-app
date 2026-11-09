# Movie Finder

Find movies you'll enjoy without the hassle. Browse popular movies or search thousands of titles, powered by [The Movie Database (TMDB)](https://www.themoviedb.org/) API.

**Live demo:** https://macedman.github.io/movie-app/

![Movie Finder screenshot](docs/screenshot.png)

## Features

- **Popular movies:** the home page loads the most popular movies from TMDB.
- **Search:** search by title. Requests are debounced (500 ms) so the API isn't called on every keystroke.
- **Movie cards:** each card shows the poster, title, rating, original language and release year.
- **Trending searches:** search counts are stored in [Appwrite](https://appwrite.io/), and the 5 most-searched movies are shown as "Trending Movies".
- Loading spinner and error message while fetching.

## Tech stack

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Appwrite](https://appwrite.io/) (database for search counts)
- [react-use](https://github.com/streamich/react-use) (`useDebounce`)
- Deployed on GitHub Pages

## Running locally

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/Macedman/movie-app.git
   cd movie-app
   npm install
   ```

2. Create a `.env.local` file in the project root:

   ```env
   VITE_TMDB_API_KEY=your_tmdb_read_access_token
   VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
   VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id
   VITE_APPWRITE_COLLECTION_ID=your_appwrite_collection_id
   ```

   - The TMDB value is the **API Read Access Token** from your [TMDB API settings](https://www.themoviedb.org/settings/api).
   - The Appwrite collection needs the attributes `searchTerm` (string), `count` (integer), `movie_id` (integer) and `poster_url` (string). Appwrite is optional: without it the app still works, just without the Trending section.

3. Start the dev server:

   ```bash
   npm run dev
   ```

   Then open http://localhost:5173.

## Scripts

| Command           | What it does                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start the dev server                  |
| `npm run build`   | Build for production into `dist/`     |
| `npm run preview` | Preview the production build locally  |
| `npm run lint`    | Run ESLint                            |

## Deployment

The site is hosted on GitHub Pages from the `gh-pages` branch, which holds the contents of `dist/`. To update the live site, run `npm run build` and push the new `dist/` folder to `gh-pages`.

## Project structure

```
src/
├── App.jsx              # Main page: search, trending, movie list
├── appwrite.js          # Appwrite client: save search counts, get trending
├── components/
│   ├── MovieCard.jsx
│   ├── Search.jsx
│   └── Spinner.jsx
├── assets/              # Images and icons
└── index.css            # Tailwind and global styles
```
