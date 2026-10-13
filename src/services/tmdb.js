// All TMDB API calls live in this one file.
// Components never call fetch() directly. They call these small functions instead.

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// A custom error type so the UI can show a helpful message for each problem.
// type: 'missing-key' | 'invalid-key' | 'not-found' | 'rate-limit' | 'server' | 'network' | 'unknown'
export class TmdbError extends Error {
  constructor(message, type = 'unknown', status = null) {
    super(message);
    this.name = 'TmdbError';
    this.type = type;
    this.status = status;
  }
}

// The one function that talks to the network.
async function request(endpoint, params = {}, signal) {
  if (!API_KEY || API_KEY === 'your_tmdb_api_key_here') {
    throw new TmdbError('No TMDB API key was found.', 'missing-key');
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'en-US');

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  let response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    // AbortError means we cancelled on purpose, so pass it on untouched.
    if (error.name === 'AbortError') throw error;
    throw new TmdbError('The network request failed.', 'network');
  }

  if (!response.ok) {
    if (response.status === 401) throw new TmdbError('Invalid API key.', 'invalid-key', 401);
    if (response.status === 404) throw new TmdbError('Not found.', 'not-found', 404);
    if (response.status === 429) throw new TmdbError('Rate limit reached.', 'rate-limit', 429);
    if (response.status >= 500) throw new TmdbError('TMDB server error.', 'server', response.status);
    throw new TmdbError(`Unexpected response (${response.status}).`, 'unknown', response.status);
  }

  try {
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new TmdbError('TMDB sent a response we could not read.', 'unknown');
  }
}

// Makes sure list responses always look the same, even if some data is missing.
function normalizeList(data) {
  const results = Array.isArray(data?.results) ? data.results.filter((movie) => movie?.id) : [];
  return { results, total_pages: data?.total_pages ?? 1 };
}

// ---------- Movie lists ----------
export const getTrending = (page = 1, signal) =>
  request('/trending/movie/week', { page }, signal).then(normalizeList);

export const getPopular = (page = 1, signal) =>
  request('/movie/popular', { page }, signal).then(normalizeList);

export const getTopRated = (page = 1, signal) =>
  request('/movie/top_rated', { page }, signal).then(normalizeList);

export const getUpcoming = (page = 1, signal) =>
  request('/movie/upcoming', { page }, signal).then(normalizeList);

export const getRecommendations = (movieId, page = 1, signal) =>
  request(`/movie/${movieId}/recommendations`, { page }, signal).then(normalizeList);

export const getSimilarMovies = (movieId, page = 1, signal) =>
  request(`/movie/${movieId}/similar`, { page }, signal).then(normalizeList);

export const searchMovies = (query, page = 1, signal) =>
  request('/search/movie', { query, page, include_adult: false }, signal).then(normalizeList);

// ---------- Discover (genre filter + sorting are done by TMDB itself) ----------
const DISCOVER_SORT = {
  default: 'popularity.desc',
  rating: 'vote_average.desc',
  newest: 'primary_release_date.desc',
  oldest: 'primary_release_date.asc',
  title: 'title.asc',
};

export function discoverMovies({ page = 1, genreId = '', sortBy = 'default' } = {}, signal) {
  const params = {
    page,
    with_genres: genreId,
    sort_by: DISCOVER_SORT[sortBy] ?? DISCOVER_SORT.default,
    include_adult: false,
  };

  // Without a minimum vote count, the top of these lists is full of obscure films.
  if (sortBy === 'rating') params['vote_count.gte'] = 300;
  else if (sortBy !== 'default') params['vote_count.gte'] = 100;

  // "Newest first" should not start with movies that have not been released yet.
  if (sortBy === 'newest') params['primary_release_date.lte'] = new Date().toISOString().slice(0, 10);

  return request('/discover/movie', params, signal).then(normalizeList);
}

// ---------- Single movie + genres ----------
export const getMovieDetails = (movieId, signal) => request(`/movie/${movieId}`, {}, signal);

export const getGenres = (signal) =>
  request('/genre/movie/list', {}, signal).then((data) => data?.genres ?? []);
