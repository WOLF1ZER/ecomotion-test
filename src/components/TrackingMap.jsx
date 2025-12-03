import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import { FaCrosshairs } from "react-icons/fa";

//marker fix
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const TrackingMap = () => {
  const [pos, setPos] = useState(null);
  const [path, setPath] = useState([]);


  useEffect(() => {
    if (!navigator.geolocation) return;

    const watch = navigator.geolocation.watchPosition(
      (p) => {
        const newPos = { lat: p.coords.latitude, lng: p.coords.longitude };
        setPos(newPos);
        setPath((prev) => [...prev, newPos]);
      },
      (err) => console.log(err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  function MapFollower() {
    const map = useMap();
    useEffect(() => {
      if (pos) map.setView(pos);
    }, [pos]);
    return null;
  }

  //recenter 
  function recenter(map) {
  if (!pos) return;

  map.invalidateSize(true);

  map.setView(pos, 16, { animate: true });
}


function MapRecenterButton({ onClick }) {
  const map = useMap();

//fix marker 
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;



  return (
    <button
      onClick={() => map && onClick(map)}
      className="absolute bottom-4 right-4 bg-white p-3 rounded-full 
                 shadow-lg hover:bg-gray-100 transition z-999"
    >
      <FaCrosshairs className="text-primary" size={18} />
    </button>
  );
}


  


  return (
    <MapContainer
      center={[51.5, -0.09]}
      zoom={15}
      className="h-96 rounded-2xl shadow"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {pos && <Marker position={pos} />}
      <MapFollower />

      {path.length > 1 && (
        <Polyline positions={path} color="green" weight={4} />
      )}

      <MapRecenterButton onClick={recenter} />
    </MapContainer>
  );
};

export default TrackingMap;
