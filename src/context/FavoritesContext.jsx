import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

export const FavoritesContext = createContext(null);

const STORAGE_KEY = 'cineverse:favorites';

// Read saved favorites once, when the app starts.
function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return []; // storage blocked or data corrupted: start fresh
  }
}

// Keep only the fields we need, so saved data stays small.
// The details API returns "genres" (objects) while list APIs return "genre_ids",
// so we convert both into genre_ids.
function toFavoriteMovie(movie) {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview ?? '',
    poster_path: movie.poster_path ?? null,
    backdrop_path: movie.backdrop_path ?? null,
    release_date: movie.release_date ?? '',
    vote_average: movie.vote_average ?? 0,
    genre_ids: movie.genre_ids ?? movie.genres?.map((genre) => genre.id) ?? [],
  };
}

export function FavoritesProvider({ children }) {
  // Passing a function to useState means it only runs on the first render.
  const [favorites, setFavorites] = useState(readFavorites);

  // Every time the favorites change, save them to the browser.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // If saving fails (private mode, full storage), the app still works for this session.
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (movieId) => favorites.some((movie) => movie.id === movieId),
    [favorites]
  );

  const toggleFavorite = useCallback((movie) => {
    setFavorites((current) =>
      current.some((item) => item.id === movie.id)
        ? current.filter((item) => item.id !== movie.id)
        : [toFavoriteMovie(movie), ...current]
    );
  }, []);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, clearFavorites }),
    [favorites, isFavorite, toggleFavorite, clearFavorites]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
