// Sorting and filtering for lists that are already loaded in the browser.

export function getSortOptions(defaultLabel = 'Default order') {
  return [
    { value: 'default', label: defaultLabel },
    { value: 'rating', label: 'Rating, high to low' },
    { value: 'newest', label: 'Release date, newest first' },
    { value: 'oldest', label: 'Release date, oldest first' },
    { value: 'title', label: 'Title, A to Z' },
  ];
}

export function filterByGenre(movies, genreId) {
  if (!genreId) return movies;
  return movies.filter((movie) => movie.genre_ids?.includes(genreId));
}

export function sortMovies(movies, sortBy) {
  const list = [...movies]; // copy, so we never change the original array

  switch (sortBy) {
    case 'rating':
      return list.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    case 'newest':
      return list.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
    case 'oldest':
      // Movies with no date go to the end.
      return list.sort((a, b) =>
        (a.release_date || '9999').localeCompare(b.release_date || '9999')
      );
    case 'title':
      return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    default:
      return list;
  }
}
