// A row of genre buttons. value is a genre id, or '' for "All".
function GenreFilter({ genres, value, onChange }) {
  if (genres.length === 0) return null;

  return (
    <div className="genre-filter" role="group" aria-label="Filter by genre">
      <button
        type="button"
        className={`chip ${value === '' ? 'is-active' : ''}`}
        aria-pressed={value === ''}
        onClick={() => onChange('')}
      >
        All genres
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          type="button"
          className={`chip ${value === genre.id ? 'is-active' : ''}`}
          aria-pressed={value === genre.id}
          onClick={() => onChange(genre.id)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}

export default GenreFilter;
