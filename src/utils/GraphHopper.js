export async function getRoute(start, end, mode = "foot") {
  const url = `https://graphhopper.com/api/1/route?point=${start.lat},${start.lng}&point=${end.lat},${end.lng}&vehicle=${mode}&points_encoded=false`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.paths?.length) return null;

  return {
    distance: data.paths[0].distance,
    time: data.paths[0].time,
    points: data.paths[0].points.coordinates.map(([lng, lat]) => ({ lat, lng })),
  };
}
