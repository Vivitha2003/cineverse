import { useSearchParams } from 'react-router-dom';
import MovieBrowser from '../components/MovieBrowser';
import PageHeader from '../components/PageHeader';
import { useBrowseControls } from '../hooks/useBrowseControls';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useMovieList } from '../hooks/useMovieList';
import { useGenres } from '../hooks/useGenres';
import { discoverMovies } from '../services/tmdb';

// Discover asks TMDB to filter by genre and sort, so it works across ALL movies,
// not only the ones already on screen.
function Discover() {
  useDocumentTitle('Discover');

  // A genre chip on the details page links here as /discover?genre=28
  const [params] = useSearchParams();
  const { genreMap } = useGenres();
  const controls = useBrowseControls({ genreId: Number(params.get('genre')) || '' });

  const list = useMovieList(
    (page, signal) => discoverMovies({ page, genreId: controls.genreId, sortBy: controls.sortBy }, signal),
    [controls.genreId, controls.sortBy]
  );

  const genreName = genreMap[controls.genreId];

  return (
    <div className="page container">
      <PageHeader
        title={genreName ? `Discover ${genreName} movies` : 'Discover'}
        subtitle="Pick a genre, choose how to sort, and keep loading more."
      />
      <MovieBrowser list={list} controls={controls} clientSide={false} defaultSortLabel="Most popular" />
    </div>
  );
}

export default Discover;
