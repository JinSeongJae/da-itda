interface LatLng {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Great-circle distance between two points, in kilometers. */
export function haversineDistanceKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return EARTH_RADIUS_KM * c;
}

/** Simple midpoint (adequate for short, city-scale distances). */
export function midpoint(a: LatLng, b: LatLng): LatLng {
  return { lat: (a.lat + b.lat) / 2, lng: (a.lng + b.lng) / 2 };
}

/** Maps a km distance to a 0-100 "closeness" score. Closer = higher score. */
export function distanceToScore(km: number, maxKm = 10): number {
  const clamped = Math.max(0, Math.min(km, maxKm));
  return Math.round(100 - (clamped / maxKm) * 100);
}

/** Ranks safe zones by distance from a midpoint, nearest first. */
export function sortByDistanceFrom<T extends LatLng>(point: LatLng, zones: T[]): T[] {
  return [...zones].sort(
    (a, b) => haversineDistanceKm(point, a) - haversineDistanceKm(point, b)
  );
}
