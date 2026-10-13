import { useSearchParams } from 'react-router-dom';
import { Clapperboard, SearchX } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import MovieBrowser from '../components/MovieBrowser';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useMovieList } from '../hooks/useMovieList';
import { searchMovies } from '../services/tmdb';

// Fetches and shows results for one search text.
// The parent gives it key={query}, so a new search starts from a clean slate.
function SearchResultsList({ query }) {
  const list = useMovieList((page, signal) => searchMovies(query, page, signal), [query]);

  return (
    <MovieBrowser
      list={list}
      defaultSortLabel="Best match"
      emptyState={
        <EmptyState
          icon={SearchX}
          title={`No movies found for "${query}"`}
          message="Check the spelling, or try a shorter title or a different keyword."
        />
      }
    />
  );
}

function SearchResults() {
  // The search text lives in the URL (/search?q=inception),
  // so results survive a refresh and can be shared as a link.
  const [params, setParams] = useSearchParams();
  const query = (params.get('q') ?? '').trim();

  useDocumentTitle(query ? `Search: ${query}` : 'Search');

  return (
    <div className="page container">
      <PageHeader
        title="Search"
        subtitle={query ? `Results for "${query}"` : 'Find any movie by its title.'}
      />

      <div className="page__search">
        <SearchBar
          initialValue={query}
          onSearch={(text) => setParams({ q: text })}
          onClear={() => setParams({})}
        />
      </div>

      {query ? (
        <SearchResultsList key={query} query={query} />
      ) : (
        <EmptyState
          icon={Clapperboard}
          title="What do you want to watch?"
          message="Type a movie title above and press Enter."
        />
      )}
    </div>
  );
}

export default SearchResults;
