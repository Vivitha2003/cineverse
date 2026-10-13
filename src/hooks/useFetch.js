import { useCallback, useEffect, useState } from 'react';

// Fetches ONE thing (a single movie, one row of movies).
// fetcher: a function that receives an AbortSignal and returns a Promise.
// deps:    when any value in this array changes, we fetch again.
export function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });

    fetcher(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (error.name === 'AbortError') return; // we cancelled it, not a real error
        setState({ data: null, loading: false, error });
      });

    // Cleanup: cancel the request if the component unmounts or deps change.
    return () => controller.abort();
  }, [attempt, ...deps]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  return { ...state, retry };
}
