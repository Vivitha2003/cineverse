import { createContext, useEffect, useMemo, useState } from 'react';
import { getGenres } from '../services/tmdb';

export const GenresContext = createContext(null);

// Loads the genre list from TMDB once, so every card can turn genre ids into names.
export function GenresProvider({ children }) {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    getGenres(controller.signal)
      .then(setGenres)
      .catch(() => {
        // Genres are a nice extra. If they fail, the rest of the app still works.
      });

    return () => controller.abort();
  }, []);

  const value = useMemo(
    () => ({
      genres,
      genreMap: Object.fromEntries(genres.map((genre) => [genre.id, genre.name])),
    }),
    [genres]
  );

  return <GenresContext.Provider value={value}>{children}</GenresContext.Provider>;
}
