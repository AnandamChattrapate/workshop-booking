// Returns a positive integer id, or null for anything else ("abc", "0", "1.5").
export function parseId(value) {
  if (!/^\d+$/.test(String(value))) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
