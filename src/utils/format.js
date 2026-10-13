export function getYear(date) {
  return date ? date.slice(0, 4) : 'TBA';
}

export function formatRating(value) {
  return value > 0 ? value.toFixed(1) : 'NR';
}

export function formatRuntime(minutes) {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
}

export function formatReleaseDate(date) {
  if (!date) return 'Release date unknown';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
