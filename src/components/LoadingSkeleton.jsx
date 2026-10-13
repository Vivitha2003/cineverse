// Grey shimmering placeholders shown while data loads.

function SkeletonCard({ list = false }) {
  return (
    <div className={`skeleton-card ${list ? 'skeleton-card--list' : ''}`} aria-hidden="true">
      <div className="skeleton skeleton--poster" />
      <div className="skeleton-card__lines">
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line skeleton--short" />
        {list && <div className="skeleton skeleton--line" />}
      </div>
    </div>
  );
}

// variant: "grid" | "list" | "row"
function LoadingSkeleton({ variant = 'grid', count = 12 }) {
  const items = Array.from({ length: count }, (_, index) => index);

  if (variant === 'row') {
    return (
      <div className="row__track" role="status" aria-label="Loading movies">
        {items.map((index) => (
          <div className="row__item" key={index}>
            <SkeletonCard />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`movie-grid movie-grid--${variant}`} role="status" aria-label="Loading movies">
      {items.map((index) => (
        <SkeletonCard key={index} list={variant === 'list'} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section className="hero hero--skeleton" role="status" aria-label="Loading featured movie">
      <div className="container hero__content" aria-hidden="true">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--line" style={{ width: 'min(320px, 70%)' }} />
        <div className="skeleton skeleton--line" style={{ width: 'min(520px, 100%)' }} />
        <div className="skeleton skeleton--line" style={{ width: 'min(460px, 90%)' }} />
      </div>
    </section>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="details__layout" role="status" aria-label="Loading movie details">
      <div className="skeleton skeleton--poster details__poster" aria-hidden="true" />
      <div className="details__info" aria-hidden="true">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--line" style={{ width: 'min(360px, 80%)' }} />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line skeleton--short" />
      </div>
    </div>
  );
}

export default LoadingSkeleton;
