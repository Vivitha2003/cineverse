import MovieBrowser from '../components/MovieBrowser';
import PageHeader from '../components/PageHeader';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useMovieList } from '../hooks/useMovieList';
import { getTopRated } from '../services/tmdb';

function TopRated() {
  useDocumentTitle('Top rated');
  const list = useMovieList((page, signal) => getTopRated(page, signal));

  return (
    <div className="page container">
      <PageHeader title="Top rated" subtitle="The highest-rated movies on TMDB, voted on by thousands of viewers." />
      <MovieBrowser list={list} defaultSortLabel="Highest rated first" />
    </div>
  );
}

export default TopRated;
