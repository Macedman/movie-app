import { useEffect, useState } from "react";
import "./App.css";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies,updateSearchCount } from "./appwrite";
import headerImg from "./assets/header.jpeg";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
 
  const [trendingMovies, setTrendingMovies] = useState([]);


  // debounce search for 500ms before calling the search api
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])


  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Response was not ok");
      } else {
        const data = await response.json();
        console.log(data);
        
        if(data.Response === 'False') {
            setErrorMessage(data.Error || 'Failed to fetch movies')
            setMovieList([]);
            return;
        }

        setMovieList(data.results || []);

        if(query && data.results?.length > 0) {
            await updateSearchCount(query, data.results[0]);
        }
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage(`Error fetching movies. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(Array.isArray(movies) ? movies : []);
    } catch (error) {
      console.log(`Error loading trending movies`, error);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
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
            className="size-75 display-block m-auto"
            src={headerImg}
            alt="Movie Theater"
          />
          <h1 className="m-5 p-5 font-bold text-5xl">
            Find <span className="text-gradient">Movies</span> You'll Enjoy{" "}
            <br />
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2 className="mt-[40px] text-white">Trending Movies {trendingMovies.length}</h2>
            <ul className="grid grid-cols-4 gap-4">
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="mt-[40px] text-white">All Movies</h2>

          {isLoading ? (
            <Spinner />
          ): errorMessage ? (
            <p className="text-red-700">{errorMessage}</p>
          ) : (
            <ul className="grid grid-cols-4 gap-4">
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
