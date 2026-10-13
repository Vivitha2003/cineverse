import { useId, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ErrorMessage from './ErrorMessage';
import LoadingSkeleton from './LoadingSkeleton';
import MovieCard from './MovieCard';

// A horizontally scrolling row of movies with a title.
function MovieRow({ title, subtitle, movies = [], loading = false, error = null, onRetry, seeAllTo }) {
  const trackRef = useRef(null);
  const headingId = useId();
  const hasMovies = !loading && !error && movies.length > 0;

  function scrollRow(direction) {
    const track = trackRef.current;
    if (!track) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  return (
    <section className="row" aria-labelledby={headingId}>
      <div className="row__header">
        <div>
          <h2 id={headingId} className="row__title">
            {title}
          </h2>
          {subtitle && <p className="row__subtitle">{subtitle}</p>}
        </div>

        <div className="row__actions">
          {seeAllTo && (
            <Link to={seeAllTo} className="row__link">
              See all
            </Link>
          )}
          {hasMovies && (
            <>
              <button type="button" className="icon-btn row__nav" onClick={() => scrollRow(-1)} aria-label={`Scroll ${title} left`}>
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button type="button" className="icon-btn row__nav" onClick={() => scrollRow(1)} aria-label={`Scroll ${title} right`}>
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>

      {loading && <LoadingSkeleton variant="row" count={8} />}
      {error && <ErrorMessage compact error={error} onRetry={onRetry} />}
      {!loading && !error && movies.length === 0 && (
        <p className="row__empty">Nothing to show here right now.</p>
      )}
      {hasMovies && (
        <ul className="row__track" ref={trackRef}>
          {movies.map((movie) => (
            <li className="row__item" key={movie.id}>
              <MovieCard movie={movie} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default MovieRow;
