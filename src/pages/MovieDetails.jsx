import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, ExternalLink, Star } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';
import FavoriteButton from '../components/FavoriteButton';
import { DetailsSkeleton } from '../components/LoadingSkeleton';
import MovieRow from '../components/MovieRow';
import Poster from '../components/Poster';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useFetch } from '../hooks/useFetch';
import { getMovieDetails, getSimilarMovies } from '../services/tmdb';
import { formatRating, formatReleaseDate, formatRuntime } from '../utils/format';
import { BACKDROP_SIZES, imageSrcSet, imageUrl } from '../utils/images';

function MovieDetails() {
  // The movie id comes from the URL (/movie/603), so refreshing the page works.
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const details = useFetch((signal) => getMovieDetails(id, signal), [id]);
  const similar = useFetch((signal) => getSimilarMovies(id, 1, signal), [id]);
  const movie = details.data;

  useDocumentTitle(movie?.title);

  // If the user landed here directly (no earlier page in this app), Back goes Home.
  function goBack() {
    if (location.key !== 'default') navigate(-1);
    else navigate('/');
  }

  const backButton = (
    <button type="button" className="btn btn--glass details__back" onClick={goBack}>
      <ArrowLeft size={18} aria-hidden="true" />
      Back
    </button>
  );

  if (details.loading) {
    return (
      <div className="details">
        <div className="container details__inner">
          {backButton}
          <DetailsSkeleton />
        </div>
      </div>
    );
  }

  if (details.error) {
    return (
      <div className="details">
        <div className="container details__inner">
          {backButton}
          <ErrorMessage error={details.error} onRetry={details.retry} />
        </div>
      </div>
    );
  }

  const runtime = formatRuntime(movie.runtime);
  const genres = movie.genres ?? [];
  const companies = movie.production_companies ?? [];
  const showSimilar = similar.loading || similar.error || (similar.data?.results.length ?? 0) > 0;

  return (
    <article className="details">
      {movie.backdrop_path && (
        <div className="details__backdrop" aria-hidden="true">
          <img
            src={imageUrl(movie.backdrop_path, 'w1280')}
            srcSet={imageSrcSet(movie.backdrop_path, BACKDROP_SIZES)}
            sizes="100vw"
            alt=""
          />
        </div>
      )}

      <div className="container details__inner">
        {backButton}

        <div className="details__layout">
          <div className="details__poster">
            <Poster path={movie.poster_path} title={movie.title} sizes="(max-width: 760px) 60vw, 320px" />
          </div>

          <div className="details__info">
            <h1 className="details__title">{movie.title}</h1>
            {movie.tagline && <p className="details__tagline">{movie.tagline}</p>}

            <ul className="details__meta">
              <li className="pill">
                <Calendar size={15} aria-hidden="true" />
                {formatReleaseDate(movie.release_date)}
              </li>
              {runtime && (
                <li className="pill">
                  <Clock size={15} aria-hidden="true" />
                  {runtime}
                </li>
              )}
              <li className="pill pill--rating">
                <Star size={15} fill="currentColor" aria-hidden="true" />
                <span className="sr-only">Rating: </span>
                {formatRating(movie.vote_average)} / 10
                {movie.vote_count > 0 && <span className="pill__faint">({movie.vote_count.toLocaleString()} votes)</span>}
              </li>
            </ul>

            {genres.length > 0 && (
              <ul className="chips" aria-label="Genres">
                {genres.map((genre) => (
                  <li key={genre.id}>
                    <Link className="chip" to={`/discover?genre=${genre.id}`}>
                      {genre.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <section>
              <h2 className="details__heading">Overview</h2>
              <p className="details__overview">{movie.overview || 'No overview is available for this movie yet.'}</p>
            </section>

            <div className="details__actions">
              <FavoriteButton movie={movie} variant="pill" />
              {movie.homepage && (
                <a className="btn btn--ghost" href={movie.homepage} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} aria-hidden="true" />
                  Official site
                </a>
              )}
            </div>

            {companies.length > 0 && (
              <section>
                <h2 className="details__heading">Production companies</h2>
                <ul className="chips">
                  {companies.map((company) => (
                    <li key={company.id} className="chip chip--static">
                      {company.name}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        {showSimilar && (
          <div className="details__similar">
            <MovieRow
              title="Similar movies"
              movies={similar.data?.results ?? []}
              loading={similar.loading}
              error={similar.error}
              onRetry={similar.retry}
            />
          </div>
        )}
      </div>
    </article>
  );
}

export default MovieDetails;
