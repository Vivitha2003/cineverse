import { useEffect, useRef, useState } from 'react';

const MAX_PAGES = 500; // TMDB never serves more than 500 pages

// Adds new movies to the list without repeating any movie we already have.
function mergeUnique(current, incoming) {
  const seen = new Set(current.map((movie) => movie.id));
  return [...current, ...incoming.filter((movie) => !seen.has(movie.id))];
}

// Loads a PAGINATED list of movies and supports "Load more".
// fetchPage: (page, signal) => Promise<{ results, total_pages }>
// deps:      when these change (for example a new search text), the list starts over.
//
// status is one of: 'loading' | 'ready' | 'loadingMore' | 'error'
export function useMovieList(fetchPage, deps = []) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [moreError, setMoreError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const moreController = useRef(null);

  // Load page 1 (runs again whenever deps change or the user presses Retry).
  useEffect(() => {
    const controller = new AbortController();

    setStatus('loading');
    setError(null);
    setMoreError(null);
    setMovies([]);
    setPage(1);
    setTotalPages(1);

    fetchPage(1, controller.signal)
      .then((data) => {
        // If a newer request replaced this one, ignore this old answer.
        if (controller.signal.aborted) return;
        setMovies(mergeUnique([], data.results));
        setTotalPages(Math.min(data.total_pages, MAX_PAGES));
        setStatus('ready');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err);
        setStatus('error');
      });

    return () => {
      controller.abort();
      moreController.current?.abort();
    };
  }, [attempt, ...deps]);

  // Load the next page and add it to the end of the list.
  function loadMore() {
    if (status !== 'ready' || page >= totalPages) return;

    const controller = new AbortController();
    moreController.current = controller;

    setMoreError(null);
    setStatus('loadingMore');

    fetchPage(page + 1, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setMovies((current) => mergeUnique(current, data.results));
        setPage(page + 1);
        setStatus('ready');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setMoreError(err);
        setStatus('ready');
      });
  }

  return {
    movies,
    status,
    error,
    moreError,
    hasMore: page < totalPages,
    retry: () => setAttempt((count) => count + 1),
    loadMore,
  };
}
