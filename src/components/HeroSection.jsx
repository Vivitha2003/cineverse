import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Info, Star } from 'lucide-react';
import ErrorMessage from './ErrorMessage';
import FavoriteButton from './FavoriteButton';
import { HeroSkeleton } from './LoadingSkeleton';
import { useGenres } from '../hooks/useGenres';
import { formatRating, getYear } from '../utils/format';
import { BACKDROP_SIZES, imageSrcSet, imageUrl } from '../utils/images';

// Big cinematic banner. It picks one of this week's top trending movies at random,
// so the featured movie is never hardcoded.
function HeroSection({ movies, loading, error, onRetry }) {
  const { genreMap } = useGenres();

  const featured = useMemo(() => {
    const candidates = (movies ?? []).filter((movie) => movie.backdrop_path && movie.overview).slice(0, 6);
    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }, [movies]);

  if (loading) return <HeroSkeleton />;

  if (error) {
    return (
      <section className="hero hero--message">
        <div className="container">
          <ErrorMessage error={error} onRetry={onRetry} />
        </div>
      </section>
    );
  }

  if (!featured) return null;

  const genreNames = (featured.genre_ids ?? []).map((id) => genreMap[id]).filter(Boolean).slice(0, 3);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <img
        className="hero__backdrop"
        src={imageUrl(featured.backdrop_path, 'w1280')}
        srcSet={imageSrcSet(featured.backdrop_path, BACKDROP_SIZES)}
        sizes="100vw"
        alt=""
        fetchpriority="high"
      />

      <div className="container hero__content">
        <h1 id="hero-title" className="hero__title">
          {featured.title}
        </h1>

        <ul className="hero__meta">
          <li className="pill">{getYear(featured.release_date)}</li>
          <li className="pill pill--rating">
            <Star size={14} fill="currentColor" aria-hidden="true" />
            <span className="sr-only">Rating: </span>
            {formatRating(featured.vote_average)} / 10
          </li>
          {genreNames.map((name) => (
            <li className="pill" key={name}>
              {name}
            </li>
          ))}
        </ul>

        <p className="hero__overview">{featured.overview}</p>

        <div className="hero__actions">
          <Link to={`/movie/${featured.id}`} className="btn btn--primary">
            <Info size={18} aria-hidden="true" />
            View details
          </Link>
          <FavoriteButton movie={featured} variant="pill" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
