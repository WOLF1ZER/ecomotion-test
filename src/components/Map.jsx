import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useEffect, useState } from "react";

//marker fix
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const Map = () => {
  const [pos, setPos] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setPos({ lat: 51.5, lng: -0.09 })
    );
  }, []);

  if (!pos) return <div className="h-48 bg-gray-200 rounded-xl"></div>;

  //fix marker 
  const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconAnchor: [12, 41],
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  return (
    <MapContainer
      center={pos}
      zoom={14}
      className="h-48 w-full rounded-2xl"
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      zoomControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={pos} />
    </MapContainer>
  );
};

export default Map;
