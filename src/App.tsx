import { useEffect, useState } from "react";
import "./App.css";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";
import headerImg from "./assets/header.jpeg";
import type { Movie, TmdbMovieListResponse, TrendingMovie } from "./types";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS: RequestInit = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([]);


  // debounce search for 500ms before calling the search api
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])


  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(Array.isArray(movies) ? movies : []);
    } catch (error) {
      console.error("Error loading trending movies", error);
    }
  };

  // `signal` lets the effect cancel this request if a newer search starts,
  // so a slow, stale response can't overwrite newer results.
  const fetchMovies = async (query: string, signal: AbortSignal) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, { ...API_OPTIONS, signal });
      if (!response.ok) {
        throw new Error(`TMDB request failed with status ${response.status}`);
      }

      const data: TmdbMovieListResponse = await response.json();
      const results = data.results ?? [];
      setMovieList(results);
      setIsLoading(false);

      if (query && results.length > 0) {
        await updateSearchCount(query, results[0]);
        loadTrendingMovies();
      }
    } catch (error) {
      // superseded by a newer search
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Error fetching movies", error);
      setErrorMessage("Error fetching movies. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchMovies(debouncedSearchTerm.trim(), controller.signal);
    return () => controller.abort();
  }, [debouncedSearchTerm]);

 useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img
            className="block w-full max-w-75 aspect-square object-cover mx-auto"
            src={headerImg}
            alt="Movie Theater"
          />
          <h1 className="my-8 font-bold text-3xl sm:text-5xl">
            Find <span className="text-gradient">Movies</span> You'll Enjoy{" "}
            <br />
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2 className="mt-10 mb-4 text-2xl font-bold text-white">Trending Movies</h2>
            <ul className="flex flex-wrap justify-center gap-4">
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id} className="w-24 sm:w-48">
                  <p className="mb-1 text-lg font-bold">{index + 1}</p>
                  <img className="w-full rounded-lg" src={movie.poster_url} alt={movie.searchTerm} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="mt-10 mb-4 text-2xl font-bold text-white">All Movies</h2>

          {isLoading ? (
            <div className="flex justify-center"><Spinner /></div>
          ): errorMessage ? (
            <p className="text-red-700">{errorMessage}</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movieList.map((movie) => (
                    <MovieCard key={movie.id} movie={movie}/>
                ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
