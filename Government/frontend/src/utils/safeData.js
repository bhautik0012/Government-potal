/** Prevent white-screen crashes when API returns an object instead of an array */
export function asArray(data) {
  if (Array.isArray(data)) return data;
  return [];
}

export const DEFAULT_AVATAR =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="110" height="110"><rect fill="#dbeafe" width="110" height="110"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#1e40af" font-size="42" font-family="sans-serif">?</text></svg>'
  );
