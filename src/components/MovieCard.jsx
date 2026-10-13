import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import Poster from './Poster';
import { useGenres } from '../hooks/useGenres';
import { formatRating, getYear } from '../utils/format';

// layout: "grid" (poster + title) or "list" (poster beside details).
function MovieCard({ movie, layout = 'grid' }) {
  const { genreMap } = useGenres();
  const genreNames = (movie.genre_ids ?? [])
    .map((id) => genreMap[id])
    .filter(Boolean)
    .slice(0, 3);

  return (
    <article className={`movie-card movie-card--${layout}`}>
      <Link to={`/movie/${movie.id}`} className="movie-card__link">
        <div className="movie-card__media">
          <Poster path={movie.poster_path} title={movie.title} decorative />
          <span className="movie-card__rating">
            <Star size={13} fill="currentColor" aria-hidden="true" />
            <span className="sr-only">Rating: </span>
            {formatRating(movie.vote_average)}
          </span>
        </div>

        <div className="movie-card__body">
          <h3 className="movie-card__title">{movie.title}</h3>
          <p className="movie-card__meta">
            <span>{getYear(movie.release_date)}</span>
            {layout === 'list' && genreNames.length > 0 && <span>{genreNames.join(', ')}</span>}
          </p>
          {layout === 'list' && (
            <p className="movie-card__overview">{movie.overview || 'No overview available.'}</p>
          )}
        </div>
      </Link>

      <FavoriteButton movie={movie} />
    </article>
  );
}

export default MovieCard;
