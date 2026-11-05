// Client-safe copy of the country list (mock-db.ts pulls in faker and must stay server-side).
export const COUNTRIES = [
  "Australia",
  "Bangladesh",
  "Brazil",
  "Canada",
  "France",
  "Germany",
  "India",
  "Japan",
  "United Kingdom",
  "United States",
] as const;
