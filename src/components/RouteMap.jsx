import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { useState } from "react";
import { getRoute } from "../utils/GraphHopper";

const RouteMap = () => {
  const [start] = useState({ lat: 51.5, lng: -0.09 });
  const [end] = useState({ lat: 51.51, lng: -0.1 });
  const [routePoints, setRoutePoints] = useState([]);

  async function fetchRoute() {
    const route = await getRoute(start, end, "bike"); // or "foot"
    if (route) {
      setRoutePoints(route.points);
      console.log("Distance (m):", route.distance);
      console.log("Time (ms):", route.time);
    }
  }

  return (
    <div>
      <button
        onClick={fetchRoute}
        className="bg-primary text-white px-4 py-2 rounded-lg mb-3"
      >
        Draw Route
      </button>

      <MapContainer
        center={start}
        zoom={14}
        style={{ height: "400px", width: "100%" }}
        className="rounded-2xl shadow-md"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={start} />
        <Marker position={end} />
        {routePoints.length > 1 && (
          <Polyline positions={routePoints} color="#1E88E5" weight={5} />
        )}
      </MapContainer>
    </div>
  );
};

export default RouteMap;
