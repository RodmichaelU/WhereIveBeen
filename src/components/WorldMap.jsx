import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function createTripIcon(isActive, visitCount) {
  const size = isActive ? 22 : 16
  const bg = isActive ? '#f97316' : '#ea580c'
  const ring = isActive ? 'rgba(249,115,22,0.4)' : 'rgba(234,88,12,0.2)'
  const badge = visitCount > 1
    ? `<div style="
        position:absolute;top:-5px;right:-5px;
        min-width:14px;height:14px;
        background:#1e293b;color:#f1f5f9;
        border-radius:7px;border:1.5px solid #94a3b8;
        font-size:8px;font-weight:800;
        font-family:system-ui,sans-serif;
        display:flex;align-items:center;justify-content:center;
        padding:0 2px;line-height:1;
      ">${visitCount}</div>`
    : ''

  return L.divIcon({
    html: `<div style="position:relative;width:${size}px;height:${size}px;">
      <div style="
        width:${size}px;height:${size}px;
        background:${bg};border:2.5px solid white;border-radius:50%;
        box-shadow:0 0 0 3px ${ring},0 2px 10px rgba(0,0,0,0.35);cursor:pointer;
      "></div>
      ${badge}
    </div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

export default function WorldMap({ trips, selectedTrip, onTripSelect }) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      maxZoom={12}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      maxBounds={[[-90, -180], [90, 180]]}
      maxBoundsViscosity={0.8}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
        attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a>'
        maxZoom={19}
      />

      {trips.map(trip => (
        <Marker
          key={trip.id}
          position={trip.coordinates}
          icon={createTripIcon(selectedTrip?.id === trip.id, trip.visits.length)}
          eventHandlers={{
            click: () => onTripSelect(trip),
          }}
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={1}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              {trip.name}
              {trip.visits.length > 1 && (
                <span style={{ fontSize: '10px', fontWeight: '600', color: '#f97316', marginLeft: '5px' }}>
                  {trip.visits.length}x
                </span>
              )}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              {trip.country} &middot; {trip.visits[trip.visits.length - 1].visitDate}
            </div>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  )
}
