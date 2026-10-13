import { useState } from 'react';

// Holds the genre filter, the sort choice and the grid/list layout for a page.
export function useBrowseControls(initial = {}) {
  const [genreId, setGenreId] = useState(initial.genreId ?? '');
  const [sortBy, setSortBy] = useState('default');
  const [layout, setLayout] = useState('grid');

  return { genreId, setGenreId, sortBy, setSortBy, layout, setLayout };
}
