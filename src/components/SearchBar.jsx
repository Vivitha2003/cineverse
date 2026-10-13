import { useEffect, useId, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

// Search happens when the form is submitted (Enter key or the Search button),
// so we do not send a request on every key press.
function SearchBar({
  initialValue = '',
  onSearch,
  onClear,
  autoFocus = false,
  placeholder = 'Search movies by title',
}) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);
  const inputId = useId(); // unique id, so two search bars on one page never clash

  // If the page changes the search text (for example the URL), keep the input in sync.
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page
    const query = value.trim();
    if (query) onSearch(query);
  }

  function handleClear() {
    setValue('');
    onClear?.();
    inputRef.current?.focus();
  }

  return (
    <form className="search-bar" role="search" onSubmit={handleSubmit}>
      <label htmlFor={inputId} className="sr-only">
        Search movies by title
      </label>
      <Search className="search-bar__icon" size={20} aria-hidden="true" />
      <input
        ref={inputRef}
        id={inputId}
        type="search"
        className="search-bar__input"
        placeholder={placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        autoComplete="off"
      />
      {value && (
        <button type="button" className="search-bar__clear" onClick={handleClear} aria-label="Clear search">
          <X size={18} aria-hidden="true" />
        </button>
      )}
      <button type="submit" className="btn btn--primary search-bar__submit">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
