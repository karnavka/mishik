import {useRef, useState} from 'react';
import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {useFetch} from '../api/fetch';


import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import type {Organization} from "../types";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

export const ClinicsPage = () => {

    const {data: clinics, loading, error} = useFetch<Organization>('/api/clinics');
    const [selected, setSelected] = useState<Organization | null>(null);
    const [cityInput, setCityInput] = useState('');

    const mapRef = useRef<L.Map | null>(null);

    const handleGoToCity = async () => {
        if (!cityInput.trim() || !mapRef.current) return;

        // Nominatim геокодування — місто → координати
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityInput)}&format=json&limit=1`
        );
        const data = await res.json();
        if (data.length > 0) {
            mapRef.current.setView([parseFloat(data[0].lat), parseFloat(data[0].lon)], 13);
        }
    };

    const handleMarkerClick = async (clinic: Organization) => {
        setSelected(clinic); // show immediately with what we have

        if (clinic.latitude && clinic.longitude) {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${clinic.latitude}&lon=${clinic.longitude}&format=json`
            );
            const data = await res.json();
            setSelected(prev => {
                if (!prev) return prev;

                return {
                    ...prev,
                    street: prev.street ?? data.address?.road,
                    city: prev.city ?? (data.address?.city || data.address?.town || data.address?.village),
                    region: prev.region ?? data.address?.state,
                };
            });
        }
    };

    //clinics on map
    const mapped = clinics.filter(c => c.latitude != null && c.longitude != null);

    // Default — Kyiv
    // Else- user location (if allowed)
    const defaultCenter: [number, number] = [50.4501, 30.5234];

    return (

        <div className="clinics-layout">

            <div className="clinics-filter">
                <div className="sidebar">
                    <div className="clinics-search">

                        <input className="clinics-input"
                               type="text"
                               placeholder="пошук за адресою..."
                               value={cityInput}
                               onChange={e => setCityInput(e.target.value)}
                               onKeyDown={e => e.key === 'Enter' && handleGoToCity()}
                        />
                        <button className="clinics-search-btn" onClick={handleGoToCity}>
                            →
                        </button>
                    </div>

                    <button className="filter-opt my-loc"
                            style ={{display:'flex', gap: '5px', flexDirection:'row', alignItems: 'center'}}
                            onClick={() => {
                        navigator.geolocation?.getCurrentPosition(pos => {
                            mapRef.current?.setView([pos.coords.latitude, pos.coords.longitude], 14);
                        });
                    }}>
                        <img src = 'src/images/location.png' style = {{width:'35px', height:'35px', padding: '2px 0 0 0'}}/>
                        <span> Моя локація </span>

                    </button>
                </div>
            </div>

            {/* ── Map ── */}
            <div className="clinics-map">
                {loading && <div className="empty">Завантаження...</div>}
                {error && <div className="empty">Помилка: {error}</div>}
                {!loading && !error && (
                    <MapContainer
                        ref={mapRef}
                        center={defaultCenter}
                        zoom={12}
                        style={{width: '100%', height: '100%'}}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <UserLocationMarker/>

                        {mapped.map(clinic => (
                            <Marker
                                key={clinic.id}
                                position={[clinic.latitude!, clinic.longitude!]}
                                eventHandlers={{click: () => handleMarkerClick(clinic)}}
                            >
                                <Popup>{clinic.name}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
                {selected && (
                    <div className="clinics-panel">
                        <button className="detail-back" onClick={() => setSelected(null)}>
                            ✕
                        </button>

                        <div className="clinics-header">
                            <div className="clinics-panel-avatar">🏥</div>
                            <h2 className="detail-name">{selected.name}</h2>
                        </div>

                        <div className="clinics-info">
                            <div className="badges" style={{margin: '8px 0 12px'}}>
                                {selected.city && <span className="badge">{selected.city}</span>}
                                {selected.region && <span className="badge">{selected.region}</span>}
                                {selected.street && <span className="badge">{selected.street}</span>}
                            </div>

                            <div className="detail-fields">
                                {selected.phoneNumber && <Row label="Тел." value={selected.phoneNumber}/>}
                                {selected.hoursOfOperation && <Row label="Години" value={selected.hoursOfOperation}/>}
                            </div>

                            <div className="card-actions" style={{marginTop: '16px'}}>
                                {selected.phoneNumber && (<button className="btn-primary"
                                                                  onClick={() => window.location.href = `tel:${selected.phoneNumber}`}>
                                    Зателефонувати
                                </button>)}
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};
export default ClinicsPage

// Moves map to user's location on mount
const UserLocationMarker = () => {
    const map = useMap();
    navigator.geolocation?.getCurrentPosition(pos => {
        map.setView([pos.coords.latitude, pos.coords.longitude], 13);
    });
    return null;
};

const Row = ({label, value}: { label: string; value: string }) => (
    <div className="card-field">
        <span>{label}</span>{value}
    </div>
);
