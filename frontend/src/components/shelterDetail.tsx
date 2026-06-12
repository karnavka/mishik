import type {Organization} from "../types";
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';

type Props = {
    org: Organization;
    onBack: () => void;
    onLoginRequest?: () => void;

};

export const ShelterDetail = ({org,onBack,onLoginRequest}:Props) => {

    // Build a search query from available address parts
    const addressQuery = [org.street, org.city, org.region]
        .filter(Boolean)
        .join(', ');

    const mapSrc = addressQuery
        ? `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}&output=embed&z=15`
        : null;

    const navigate = useNavigate();

    const handleViewAnimals = () => {
        navigate('/', { state: { shelterId: String(org.id) } });
    };

    const handleDonate = () => {
        if (!isLoggedIn()) {
            onLoginRequest?.();
            return;
        }

        navigate('/donate', {
            state: {
                from: '/shelters',
                shelterId: org.id,
                shelterName: org.name,
            },
        });
    };

    return (

        <div className="detail-page">
            <button className="detail-back" onClick={onBack}>
                ←
            </button>

            <div className="detail-card">

                <div className="detail-photo">
                    {
                        org.imageUrl ? <img src={org.imageUrl}/> : <span className="detail-photo-placeholder"> 🏠 </span>
                    }
                </div>

                <button className="btn-ghost" onClick={handleViewAnimals}>
                    🐾 Переглянути тварин
                </button>
                <button className="btn-primary" onClick={handleDonate}>
                    Задонатити притулку
                </button>

                <div className="detail-body">
                    <h2 className="detail-name">{org.name}</h2>

                    <div className="badges" style={{marginBottom: '12px'}}>
                        {org.type && <span className="badge">{org.type}</span>}
                        {org.city && <span className="badge">{org.city}</span>}
                        {org.region && <span className="badge">{org.region}</span>}
                    </div>

                    <div className="detail-fields">
                        {org.phoneNumber && <Row label="Тел." value={org.phoneNumber}/>}
                        {org.street && <Row label="Адреса" value={[org.street, org.city].filter(Boolean).join(', ')}/>}
                        {org.adoptionConditions && <Row label="Умови" value={org.adoptionConditions}/>}
                        {org.donationDetails?.recipientName && <Row label="Отримувач" value={org.donationDetails.recipientName}/>}
                        {org.donationDetails?.iban && <Row label="IBAN" value={org.donationDetails.iban}/>}
                    </div>

                    {/* Map */}
                    {mapSrc && (
                        <div className="detail-map">
                            <div className="detail-shelter-title">📍 На мапі</div>
                            <iframe
                                src={mapSrc}
                                width="100%"
                                height="260"
                                style={{ border: 'none', borderRadius: '12px', marginTop: '8px' }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={`Карта: ${org.name}`}
                            />
                        </div>
                    )}

                </div>
            </div>
        </div>


    );
};

const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="card-field">
        <span>{label}</span>{value}
    </div>
);

