// TMDB image URLs look like:  https://image.tmdb.org/t/p/{size}{file_path}
// Example: https://image.tmdb.org/t/p/w342/abc123.jpg
// {size} is w92, w154, w185, w342, w500, w780, w1280 or "original".
// We offer several sizes with srcSet so phones download small images
// and big screens download sharp ones.

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const POSTER_SIZES = [
  ['w185', 185],
  ['w342', 342],
  ['w500', 500],
];

export const BACKDROP_SIZES = [
  ['w780', 780],
  ['w1280', 1280],
];

export function imageUrl(path, size) {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}

export function imageSrcSet(path, sizes) {
  if (!path) return undefined;
  return sizes.map(([name, width]) => `${imageUrl(path, name)} ${width}w`).join(', ');
}
