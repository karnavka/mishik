import type { Organization } from "../types";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';
import { BadgeWithIcon, CancelIcon } from "../styles/elements.tsx";

type Props = {
    org: Organization;
    onBack: () => void;
    onLoginRequest?: () => void;
};

export const ShelterDetail = ({ org, onBack, onLoginRequest }: Props) => {
    const navigate = useNavigate();
    const [imageFailed, setImageFailed] = useState(false);
    const imageUrl = org.imageUrl?.trim();

    const [instagram, facebook, telegram] = (() => {
        if (!org.socialLinks) return [null, null, null];
        const parts = org.socialLinks.split('|');
        return [parts[0] || null, parts[1] || null, parts[2] || null];
    })();

    const addressParts = [org.street, org.city, org.region].filter(Boolean);
    const primaryAddress = addressParts[0];
    const addressQuery = addressParts.join(', ');

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

    const handleCall = () => {
        if (org.phoneNumber) window.location.href = `tel:${org.phoneNumber}`;
    };

    return (
        <div className="detail-page">
            <button className="detail-back" onClick={onBack}><CancelIcon/></button>

            <div className="detail-card">

                {/* LEFT */}
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

                {/* RIGHT */}
                <div className="detail-body">

                    <div className="shelter-header">
                        <div className="shelter-logo">
                            {imageUrl && !imageFailed
                                ? <img src={imageUrl} alt={org.name} onError={() => setImageFailed(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
                                : <img src="/images/shelters.png" alt={org.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}/>
                            }
                        </div>
                        <div className="shelter-header-text">
                            <h2 className="detail-name" style={{ marginBottom: 4 }}>{org.name}</h2>
                            {primaryAddress && (
                                <BadgeWithIcon imgsrc="/images/location.png" label={primaryAddress} />
                            )}
                        </div>
                    </div>

                    <div className="detail-general">
                        <div className="detail-general-row">
                            <span className="detail-general-label">Адреса</span>
                            <span>{addressQuery || '—'}</span>
                        </div>
                        <div className="detail-general-row">
                            <span className="detail-general-label">Тел.</span>
                            <span>{org.phoneNumber || '—'}</span>
                        </div>
                    </div>

                    {org.adoptionConditions && (
                        <p className="detail-description">{org.adoptionConditions}</p>
                    )}
                   {(instagram || facebook || telegram) && (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
                {instagram && (
                    <a href={instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
                        <img src="src/assets/free-icon-instagram-717392.png" alt="Instagram" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                    </a>
                )}
                {facebook && (
                    <a href={facebook} target="_blank" rel="noopener noreferrer" title="Facebook">
                        <img src="src/assets/free-icon-facebook-circular-logo-20673.png" alt="Facebook" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                    </a>
                )}
                {telegram && (
                    <a href={telegram} target="_blank" rel="noopener noreferrer" title="Telegram">
                        <img src="src/assets/free-icon-telegram-4701496.png" alt="Telegram" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                    </a>
                )}
            </div>
)}
                    <div className="card-actions" style={{ marginTop: 'auto', paddingTop: 16 }}>
                        <button className="btn-ghost" onClick={handleViewAnimals}>
                            🐾 Переглянути тварин
                        </button>
                        {org.phoneNumber && (
                            <button className="btn-ghost" onClick={handleCall}>
                                ☏ Зателефонувати
                            </button>
                        )}
                        <button className="btn-primary" onClick={handleDonate}>
                            Задонатити
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
