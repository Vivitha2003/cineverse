# React learning guide for CineVerse

Read this next to the code. Every example below comes from a real file in the project.

## 1. Components and props

A **component** is a function that returns UI. **Props** are the inputs you pass to it, like attributes on an HTML tag.

```jsx
// src/components/MovieGrid.jsx
function MovieGrid({ movies, layout = 'grid' }) {
  return (
    <ul className={`movie-grid movie-grid--${layout}`}>
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} layout={layout} />
        </li>
      ))}
    </ul>
  );
}
```

- `{ movies, layout = 'grid' }` pulls the props out of the object React passes in. `'grid'` is a default value.
- `movies.map(...)` turns an array of data into an array of elements.
- `key={movie.id}` helps React track which item is which when the list changes. Use a stable id, never the array index.
- `MovieCard` receives `movie` as a prop and never changes it. Props are read-only.

## 2. useState: memory for a component

`useState` stores a value that, when changed, makes the component draw itself again.

```jsx
// src/components/Navbar.jsx
const [menuOpen, setMenuOpen] = useState(false);

<button onClick={() => setMenuOpen((open) => !open)}>
```

- `menuOpen` is the current value. `setMenuOpen` is the only correct way to change it.
- Never write `menuOpen = true`. React would not notice.
- `(open) => !open` says "take the previous value and flip it". Use this form when the new value depends on the old one.

## 3. Conditional rendering

Show different UI depending on state. CineVerse uses this everywhere:

```jsx
// src/components/MovieBrowser.jsx
{isLoading && <LoadingSkeleton />}
{isError && <ErrorMessage error={error} onRetry={retry} />}
{isEmpty && <EmptyState title="No movies found" />}
{!isLoading && !isError && visibleMovies.length > 0 && <MovieGrid movies={visibleMovies} />}
```

`condition && <Thing />` shows `<Thing />` only when the condition is true. This is why the screen is never blank: every possible state has something to show.

## 4. useEffect: do something after rendering

Use it for work outside of drawing: fetching data, timers, reading the browser.

```jsx
// src/hooks/useFetch.js (simplified)
useEffect(() => {
  const controller = new AbortController();

  fetcher(controller.signal).then(setData);

  return () => controller.abort();   // cleanup
}, [id]);                            // dependency array
```

- The **dependency array** `[id]` means: run again only when `id` changes. `[]` means run once. No array means run after every render.
- The **cleanup function** runs before the next run and when the component disappears. Here it cancels the old request.

## 5. Fetching data from an API

The steps live in `src/services/tmdb.js`:

1. Build a URL with the endpoint and the API key (`new URL(...)` plus `searchParams`).
2. `await fetch(url)` to send the request.
3. Check `response.ok`. If it is false, throw a `TmdbError` that says what went wrong (401 invalid key, 404 not found, 429 rate limit).
4. `await response.json()` to read the data.

Components never repeat this. They call functions like `getTrending(page, signal)`.

### Why AbortController?

If you type "Matrix", then quickly search "Inception", two requests are in flight. If "Matrix" is slower and arrives last, it would overwrite the right results. Each effect creates an `AbortController`. When the search changes, the cleanup function aborts the old request, so a stale answer can never replace a newer one. The `if (controller.signal.aborted) return;` check is a second safety net.

## 6. Custom hooks

A custom hook is a function that starts with `use` and calls other hooks. It lets you reuse logic.

| Hook | Job |
| --- | --- |
| `useFetch(fetcher, deps)` | Load one thing (a movie, one row) and report `loading`, `error`, `data` |
| `useMovieList(fetchPage, deps)` | Load a paginated list with `loadMore` and no duplicates |
| `useBrowseControls()` | Remember genre, sort and layout choices |
| `useFavorites()` | Read and change favorites from any component |
| `useGenres()` | Turn genre ids into names |

## 7. Context: sharing data without passing props everywhere

Favorites are needed by cards, the navbar, the hero and the details page. Passing them as props through every level would be painful. **Context** puts the data in one provider that wraps the app:

```jsx
// src/App.jsx
<FavoritesProvider>
  <Navbar />
  <Routes>...</Routes>
</FavoritesProvider>

// any component inside
const { isFavorite, toggleFavorite } = useFavorites();
```

## 8. localStorage: saving favorites

`localStorage` keeps text in the browser even after you close the tab. It only stores strings, so we convert with `JSON.stringify` (save) and `JSON.parse` (load).

```jsx
// src/context/FavoritesContext.jsx
const [favorites, setFavorites] = useState(readFavorites); // load once at start

useEffect(() => {
  localStorage.setItem('cineverse:favorites', JSON.stringify(favorites));
}, [favorites]);                                             // save on every change
```

Both steps are wrapped in `try/catch` because storage can be blocked (for example in private mode). The app still works if saving fails.

## 9. React Router

- `<Route path="/movie/:id" element={<MovieDetails />} />` defines a page. `:id` is a variable.
- `const { id } = useParams()` reads it inside the page.
- `<Link to="/discover">` changes page without reloading.
- `useSearchParams()` reads and writes `?q=matrix`. Search text lives in the URL, so refresh and sharing both work.
- Deployed sites need a rewrite rule (`vercel.json`, `public/_redirects`) so a refresh on `/movie/603` serves the app instead of a 404.

## 10. useMemo: only when it helps

```jsx
const visibleMovies = useMemo(
  () => sortMovies(filterByGenre(movies, activeGenre), sortBy),
  [movies, activeGenre, sortBy]
);
```

Filtering and sorting hundreds of movies is derived data. `useMemo` recalculates it only when one of the three inputs changes. Do not wrap everything in `useMemo`; use it for real calculations like this.

## 11. Why some filters happen in two places

- **Discover page:** TMDB filters and sorts for you (`with_genres`, `sort_by`), so results cover every movie in the database.
- **Trending, Top Rated, Search, Favorites:** the API does not offer these options, so we filter and sort the movies already loaded. The genre buttons only list genres that appear in those movies, so every button does something.

## 12. Try it yourself

1. Change the hero to pick the single top trending movie instead of a random one (`HeroSection.jsx`).
2. Add a "Today / This week" switch to the Trending page using `/trending/movie/day`.
3. Remember the grid/list choice in `localStorage`.
4. Add a cast section using `/movie/{id}/credits`.
