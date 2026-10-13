import { useMemo } from 'react';
import { Search } from 'lucide-react';
import BrowseControls from './BrowseControls';
import EmptyState from './EmptyState';
import ErrorMessage from './ErrorMessage';
import GenreFilter from './GenreFilter';
import LoadingSkeleton from './LoadingSkeleton';
import MovieGrid from './MovieGrid';
import { useBrowseControls } from '../hooks/useBrowseControls';
import { useGenres } from '../hooks/useGenres';
import { filterByGenre, getSortOptions, sortMovies } from '../utils/sorting';

// The reusable "browse a list of movies" block used by most pages.
// It shows filters, sorting, the grid/list, loading, errors and the Load more button.
//
// list:       the object returned by useMovieList (or a similar object for Favorites)
// controls:   optional. Pass these in when the PAGE needs to know the genre/sort,
//             for example Discover, which asks TMDB to filter and sort.
// clientSide: true  -> filter and sort the movies we already loaded
//             false -> the parent already fetched filtered/sorted movies from the API
function MovieBrowser({ list, controls: externalControls, clientSide = true, defaultSortLabel, emptyState }) {
  const internalControls = useBrowseControls();
  const controls = externalControls ?? internalControls;
  const { genreId, setGenreId, sortBy, setSortBy, layout, setLayout } = controls;
  const { genres: allGenres } = useGenres();
  const { movies, status, error, moreError, hasMore, retry, loadMore } = list;

  // In client-side mode only offer genres that exist in the loaded movies,
  // so every button on screen really does something.
  const genres = useMemo(() => {
    if (!clientSide) return allGenres;
    const present = new Set(movies.flatMap((movie) => movie.genre_ids ?? []));
    return allGenres.filter((genre) => present.has(genre.id));
  }, [clientSide, allGenres, movies]);

  const activeGenre = clientSide && !genres.some((genre) => genre.id === genreId) ? '' : genreId;

  const visibleMovies = useMemo(
    () => (clientSide ? sortMovies(filterByGenre(movies, activeGenre), sortBy) : movies),
    [clientSide, movies, activeGenre, sortBy]
  );

  const isLoading = status === 'loading';
  const isError = status === 'error';
  const isEmpty = !isLoading && !isError && movies.length === 0;
  const showControls = !isError && (isLoading || movies.length > 0 || !clientSide);

  const countText = isLoading
    ? 'Loading movies'
    : `${visibleMovies.length} ${visibleMovies.length === 1 ? 'movie' : 'movies'}${hasMore ? ' so far' : ''}`;

  return (
    <div className="browser">
      {showControls && (
        <div className="browser__controls">
          <GenreFilter genres={genres} value={activeGenre} onChange={setGenreId} />
          <BrowseControls
            countText={countText}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOptions={getSortOptions(defaultSortLabel)}
            layout={layout}
            onLayoutChange={setLayout}
          />
        </div>
      )}

      {isLoading && <LoadingSkeleton variant={layout} count={layout === 'list' ? 6 : 12} />}

      {isError && <ErrorMessage error={error} onRetry={retry} />}

      {isEmpty &&
        (emptyState ?? (
          <EmptyState
            icon={Search}
            title="No movies match these filters"
            message="Try a different genre or sort option."
          />
        ))}

      {!isLoading && !isError && visibleMovies.length > 0 && (
        <MovieGrid movies={visibleMovies} layout={layout} />
      )}

      {!isLoading && !isError && movies.length > 0 && (
        <div className="browser__more">
          {moreError && <ErrorMessage compact error={moreError} onRetry={loadMore} />}
          {hasMore && !moreError && (
            <button
              type="button"
              className="btn btn--primary"
              onClick={loadMore}
              disabled={status === 'loadingMore'}
            >
              {status === 'loadingMore' ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Loading
                </>
              ) : (
                'Load more movies'
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default MovieBrowser;
