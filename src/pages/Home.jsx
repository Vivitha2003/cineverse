import { useState } from 'react';
import HeroSection from '../components/HeroSection';
import MovieRow from '../components/MovieRow';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useFavorites } from '../hooks/useFavorites';
import { useFetch } from '../hooks/useFetch';
import {
  discoverMovies,
  getPopular,
  getRecommendations,
  getTopRated,
  getTrending,
  getUpcoming,
} from '../services/tmdb';

// A row that fetches its own movies.
function FetchedRow({ fetcher, deps = [], ...rowProps }) {
  const { data, loading, error, retry } = useFetch(fetcher, deps);

  return (
    <MovieRow {...rowProps} movies={data?.results ?? []} loading={loading} error={error} onRetry={retry} />
  );
}

function Home() {
  useDocumentTitle('Discover movies');

  const { favorites } = useFavorites();

  // Remember the most recent favorite when the page opens, so the
  // "Recommended" row does not reload every time you tap a heart.
  const [seed] = useState(() => favorites[0] ?? null);

  // Trending is used twice (hero + first row), so we fetch it once here.
  const trending = useFetch((signal) => getTrending(1, signal), []);

  // Recommendations come from your latest favorite. With no favorites,
  // we show the highest-rated movies instead.
  async function fetchRecommended(signal) {
    if (seed) {
      const data = await getRecommendations(seed.id, 1, signal);
      if (data.results.length > 0) return data;
    }
    return discoverMovies({ sortBy: 'rating' }, signal);
  }

  return (
    <>
      <HeroSection
        movies={trending.data?.results}
        loading={trending.loading}
        error={trending.error}
        onRetry={trending.retry}
      />

      <div className="container home__rows">
        <MovieRow
          title="Trending this week"
          subtitle="What everyone is watching right now."
          seeAllTo="/trending"
          movies={trending.data?.results ?? []}
          loading={trending.loading}
          error={trending.error}
          onRetry={trending.retry}
        />

        <FetchedRow
          title="Popular movies"
          subtitle="Crowd favorites across every genre."
          seeAllTo="/discover"
          fetcher={(signal) => getPopular(1, signal)}
        />

        <FetchedRow
          title="Top rated of all time"
          subtitle="Films that critics and viewers rate the highest."
          seeAllTo="/top-rated"
          fetcher={(signal) => getTopRated(1, signal)}
        />

        <FetchedRow
          title="Coming soon"
          subtitle="Upcoming releases to look out for."
          fetcher={(signal) => getUpcoming(1, signal)}
        />

        <FetchedRow
          title="Recommended for you"
          subtitle={
            seed
              ? `Picked using ${seed.title} from your favorites.`
              : 'Save a favorite and these picks will match your taste.'
          }
          fetcher={fetchRecommended}
          deps={[seed?.id]}
        />
      </div>
    </>
  );
}

export default Home;
