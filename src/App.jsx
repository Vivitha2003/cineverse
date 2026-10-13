import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { FavoritesProvider } from './context/FavoritesContext';
import { GenresProvider } from './context/GenresContext';
import Discover from './pages/Discover';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import NotFound from './pages/NotFound';
import SearchResults from './pages/SearchResults';
import TopRated from './pages/TopRated';
import Trending from './pages/Trending';

// Jump back to the top whenever the user opens a different page.
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <GenresProvider>
      <FavoritesProvider>
        <ScrollToTop />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/top-rated" element={<TopRated />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </FavoritesProvider>
    </GenresProvider>
  );
}

export default App;
