import { Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';

// variant "icon": small round heart on posters. variant "pill": full button with text.
function FavoriteButton({ movie, variant = 'icon' }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(movie.id);

  if (variant === 'pill') {
    return (
      <button
        type="button"
        className={`btn btn--glass ${active ? 'is-active' : ''}`}
        onClick={() => toggleFavorite(movie)}
      >
        <Heart size={18} fill={active ? 'currentColor' : 'none'} aria-hidden="true" />
        {active ? 'In favorites' : 'Add to favorites'}
      </button>
    );
  }

  const label = active ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`;

  return (
    <button
      type="button"
      className={`fav-btn ${active ? 'is-active' : ''}`}
      onClick={() => toggleFavorite(movie)}
      aria-label={label}
      title={label}
    >
      <Heart size={18} fill={active ? 'currentColor' : 'none'} aria-hidden="true" />
    </button>
  );
}

export default FavoriteButton;
