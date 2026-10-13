import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import MovieBrowser from '../components/MovieBrowser';
import PageHeader from '../components/PageHeader';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useFavorites } from '../hooks/useFavorites';

function Favorites() {
  useDocumentTitle('My favorites');
  const { favorites, clearFavorites } = useFavorites();

  // MovieBrowser expects the same shape that useMovieList returns.
  // Favorites are already in memory, so there is nothing to load.
  const list = {
    movies: favorites,
    status: 'ready',
    error: null,
    moreError: null,
    hasMore: false,
    retry: () => {},
    loadMore: () => {},
  };

  function handleClear() {
    if (window.confirm('Remove every movie from your favorites?')) clearFavorites();
  }

  return (
    <div className="page container">
      <PageHeader
        title="My favorites"
        subtitle="Saved on this device, so they are still here when you come back."
      >
        {favorites.length > 0 && (
          <button type="button" className="btn btn--ghost" onClick={handleClear}>
            Clear all
          </button>
        )}
      </PageHeader>

      <MovieBrowser
        list={list}
        defaultSortLabel="Recently added"
        emptyState={
          <EmptyState
            icon={Heart}
            title="No favorites yet"
            message="Tap the heart on any movie to save it here."
          >
            <Link to="/discover" className="btn btn--primary">
              Find movies to save
            </Link>
          </EmptyState>
        }
      />
    </div>
  );
}

export default Favorites;
