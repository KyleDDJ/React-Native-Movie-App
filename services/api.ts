import { ROUTES } from "@/constants/routes";

export const TMDB_CONFIG = {
    BASE_URL: process.env.EXPO_PUBLIC_MOVIE_BASE_URL!,
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
    }
}

export const fetchMovies = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}${ROUTES.search_movies}${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}${ROUTES.discover_movies}`;
 
    
  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();

  return data.results;
};

export const fetchMovieDetails = async (movieId: string): Promise<MovieDetails> => {
  try {
    const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`, {
      method: 'GET',
      headers: TMDB_CONFIG.headers,
    });

    if(!response.ok) throw new Error('Failed to fetch movie details')

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const fetchGenres = async () => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/genre/movie/list?language=en`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) throw new Error("Failed to fetch genres");

    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error(error);
    return [];
  }
};
