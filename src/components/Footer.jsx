import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__brand">CineVerse</p>
        <p className="footer__text">
          This product uses the{' '}
          <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
            TMDB
          </a>{' '}
          API but is not endorsed or certified by TMDB. Movie data and images belong to their owners.
        </p>
        <nav className="footer__links" aria-label="Footer">
          <Link to="/discover">Discover</Link>
          <Link to="/trending">Trending</Link>
          <Link to="/favorites">My Favorites</Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
