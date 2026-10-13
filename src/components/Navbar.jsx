import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Film, Menu, Search, X } from 'lucide-react';
import SearchBar from './SearchBar';
import { useFavorites } from '../hooks/useFavorites';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/discover', label: 'Discover' },
  { to: '/trending', label: 'Trending' },
  { to: '/top-rated', label: 'Top Rated' },
  { to: '/favorites', label: 'My Favorites' },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  // Close the menu and the search panel whenever the page changes.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  // Make the bar solid once the user scrolls down.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleSearch(query) {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  const solid = scrolled || menuOpen || searchOpen;

  return (
    <header className={`navbar ${solid ? 'is-solid' : ''}`}>
      <div className="container navbar__bar">
        <Link to="/" className="navbar__brand" aria-label="CineVerse home">
          <span className="navbar__mark">
            <Film size={18} aria-hidden="true" />
          </span>
          CineVerse
        </Link>

        <nav
          id="primary-navigation"
          className={`navbar__links ${menuOpen ? 'is-open' : ''}`}
          aria-label="Main"
        >
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className="navbar__link">
              {link.label}
              {link.to === '/favorites' && favorites.length > 0 && (
                <span className="navbar__badge" aria-label={`${favorites.length} saved`}>
                  {favorites.length}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => setSearchOpen((open) => !open)}
            aria-expanded={searchOpen}
            aria-controls="navbar-search"
            aria-label={searchOpen ? 'Close search' : 'Open search'}
          >
            {searchOpen ? <X size={20} aria-hidden="true" /> : <Search size={20} aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="icon-btn navbar__toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div
          id="navbar-search"
          className="navbar__search"
          onKeyDown={(event) => event.key === 'Escape' && setSearchOpen(false)}
        >
          <div className="container">
            <SearchBar autoFocus onSearch={handleSearch} />
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
