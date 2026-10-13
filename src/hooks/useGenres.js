import { useContext } from 'react';
import { GenresContext } from '../context/GenresContext';

export function useGenres() {
  const context = useContext(GenresContext);
  if (!context) throw new Error('useGenres must be used inside <GenresProvider>.');
  return context;
}
