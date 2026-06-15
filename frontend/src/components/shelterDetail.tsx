import type { Organization } from "../types";
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';
import {BadgeWithIcon, CancelIcon} from "../styles/elements.tsx";

type Props = {
    org: Organization;
    onBack: () => void;
    onLoginRequest?: () => void;
};

export const ShelterDetail = ({ org, onBack, onLoginRequest }: Props) => {
    const navigate = useNavigate();

    const addressQuery = [org.street, org.city, org.region]
        .filter(Boolean)
        .join(', ');

    const mapSrc = addressQuery
        ? `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}&output=embed&z=15`
        : null;

    const handleViewAnimals = () => {
        navigate('/', { state: { shelterId: String(org.id) } });
    };

    const handleDonate = () => {
        if (!isLoggedIn()) { onLoginRequest?.(); return; }
        navigate('/donate', {
            state: { from: '/shelters', shelterId: org.id, shelterName: org.name },
        });
    };

    return (
        <div className="detail-page">
            <button className="detail-back" onClick={onBack}><CancelIcon/></button>

            <div className="detail-card">

                {/* LEFT*/}
                <div className="detail-left shelter-map-col">
                    {mapSrc ? (
                        <iframe
                            src={mapSrc}
                            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`Карта: ${org.name}`}
                        />
                    ) : (
                        <div className="shelter-no-map">
                            <span style={{ fontSize: 48 }}>📍</span>
                            <span style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
                                Адреса не вказана
                            </span>
                        </div>
                    )}
                </div>

                {/* RIGHT*/}
                <div className="detail-body">

                    {/* header: logo + name + address */}
                    <div className="shelter-header">
                        <div className="shelter-logo">
                            {org.imageUrl
                                ? <img src={org.imageUrl} alt={org.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
                                : <img src='\images\shelters.png' alt={org.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}/>
                            }
                        </div>
                        <div className="shelter-header-text">
                            <h2 className="detail-name" style={{ marginBottom: 4 }}>{org.name}</h2>
                            {addressQuery && (
                                <BadgeWithIcon
                                imgsrc= {"/images/location.png"}
                                label = {org.city}
                                />

                            )}
                        </div>
                    </div>


                    <div className="detail-general">
                        <div className="detail-general-row">
                            <span className="detail-general-label">Адреса</span>
                            <span>
                                {org.region} {org.city? org.city : '-'} {org.street}
                            </span>
                        </div>
                        <div className="detail-general-row">
                            <span className="detail-general-label">Тел.</span>
                            <span>{org.phoneNumber? org.phoneNumber : '-'}</span>
                        </div>
                    </div>

                    {org.adoptionConditions && (
                        <p className="detail-description">{org.adoptionConditions}</p>
                    )}
                    {/*/!* badges *!/*/}
                    {/*<div className="badges">*/}
                    {/*    {org.type   && <span className="badge">{org.type}</span>}*/}
                    {/*    {org.city   && <span className="badge">{org.city}</span>}*/}
                    {/*    {org.region && <span className="badge">{org.region}</span>}*/}
                    {/*</div>*/}

                    {/*/!* info rows *!/*/}
                    {/*<div className="detail-fields">*/}

                    {/*    {org.phoneNumber        && <Row label="Тел."      value={org.phoneNumber} />}*/}
                    {/*    {org.adoptionConditions && <Row label="Умови"     value={org.adoptionConditions} />}*/}
                    {/*    {org.donationDetails?.recipientName && (*/}
                    {/*        <Row label="Отримувач" value={org.donationDetails.recipientName} />*/}
                    {/*    )}*/}
                    {/*    {org.donationDetails?.iban && (*/}
                    {/*        <Row label="IBAN" value={org.donationDetails.iban} />*/}
                    {/*    )}*/}
                    {/*</div>*/}

                    {/* buttons */}
                    <div className="card-actions" style={{ marginTop: 'auto', paddingTop: 16 }}>
                        <button className="btn-ghost" onClick={handleViewAnimals}>
                            🐾 Переглянути тварин
                        </button>
                        <button className="btn-primary" onClick={handleDonate}>
                            Задонатити
                        </button>
                    </div>
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

