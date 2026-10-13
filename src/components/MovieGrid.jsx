import MovieCard from './MovieCard';

// Shows many movies as a grid or a list. Each movie's stable id is the React key.
function MovieGrid({ movies, layout = 'grid' }) {
  return (
    <ul className={`movie-grid movie-grid--${layout}`}>
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} layout={layout} />
        </li>
      ))}
    </ul>
  );
}

export default MovieGrid;
