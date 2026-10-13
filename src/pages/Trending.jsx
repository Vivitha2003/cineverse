import MovieBrowser from '../components/MovieBrowser';
import PageHeader from '../components/PageHeader';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useMovieList } from '../hooks/useMovieList';
import { getTrending } from '../services/tmdb';

function Trending() {
  useDocumentTitle('Trending');
  const list = useMovieList((page, signal) => getTrending(page, signal));

  return (
    <div className="page container">
      <PageHeader title="Trending" subtitle="The movies people are watching this week." />
      <MovieBrowser list={list} defaultSortLabel="Trending order" />
    </div>
  );
}

export default Trending;
