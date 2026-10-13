import { useState } from 'react';
import { Film } from 'lucide-react';
import { POSTER_SIZES, imageSrcSet, imageUrl } from '../utils/images';

// Shows a movie poster. If there is no poster (or it fails to load), shows a fallback.
function Poster({ path, title, decorative = false, sizes = '(max-width: 600px) 45vw, 240px' }) {
  const [failed, setFailed] = useState(false);

  if (!path || failed) {
    return (
      <div className="poster poster--fallback" role="img" aria-label={`No poster available for ${title}`}>
        <Film size={34} aria-hidden="true" />
        <span aria-hidden="true">{title}</span>
      </div>
    );
  }

  return (
    <img
      className="poster"
      src={imageUrl(path, 'w342')}
      srcSet={imageSrcSet(path, POSTER_SIZES)}
      sizes={sizes}
      alt={decorative ? '' : `${title} poster`}
      width="342"
      height="513"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default Poster;
