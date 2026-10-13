import { AlertTriangle, KeyRound, RefreshCw, SearchX, WifiOff } from 'lucide-react';

// Each kind of TmdbError gets its own plain-language explanation.
const MESSAGES = {
  'missing-key': {
    icon: KeyRound,
    title: 'TMDB API key is missing',
    text: 'Create a file named .env in the project root, add VITE_TMDB_API_KEY=your_key, then stop and restart npm run dev.',
    canRetry: false,
  },
  'invalid-key': {
    icon: KeyRound,
    title: 'TMDB rejected your API key',
    text: 'Check that the key in your .env file is the v3 "API Key" from your TMDB account settings, then restart npm run dev.',
    canRetry: false,
  },
  network: {
    icon: WifiOff,
    title: 'You seem to be offline',
    text: 'We could not reach TMDB. Check your internet connection and try again.',
    canRetry: true,
  },
  'rate-limit': {
    icon: AlertTriangle,
    title: 'Too many requests',
    text: 'TMDB asked us to slow down. Wait a few seconds and try again.',
    canRetry: true,
  },
  'not-found': {
    icon: SearchX,
    title: 'We could not find that',
    text: 'This movie does not exist or has been removed from TMDB.',
    canRetry: false,
  },
  server: {
    icon: AlertTriangle,
    title: 'TMDB is having problems',
    text: 'Their servers returned an error. This usually fixes itself, so try again in a moment.',
    canRetry: true,
  },
};

const FALLBACK = {
  icon: AlertTriangle,
  title: 'Something went wrong',
  text: 'An unexpected error happened while loading movies. Try again.',
  canRetry: true,
};

function ErrorMessage({ error, onRetry, compact = false }) {
  const info = MESSAGES[error?.type] ?? FALLBACK;
  const Icon = info.icon;

  return (
    <div className={`state state--error ${compact ? 'state--compact' : ''}`} role="alert">
      <div className="state__icon">
        <Icon size={compact ? 22 : 30} aria-hidden="true" />
      </div>
      <div className="state__text">
        <h3 className="state__title">{info.title}</h3>
        <p>{info.text}</p>
      </div>
      {info.canRetry && onRetry && (
        <button type="button" className="btn btn--primary" onClick={onRetry}>
          <RefreshCw size={16} aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
