import type { Models } from "appwrite";

// The fields the app uses from a TMDB movie (TMDB returns more)
export interface Movie {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string | null;
  release_date: string;
  original_language: string;
}

// Shape of /search/movie and /discover/movie responses
export interface TmdbMovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// A document in the Appwrite search-count collection
export interface TrendingMovie extends Models.Document {
  searchTerm: string;
  count: number;
  movie_id: number;
  poster_url: string;
}
