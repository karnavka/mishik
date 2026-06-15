import type {Animal} from '../types';
import {RoleGuard} from './RoleGuard';
import {useNavigate} from 'react-router-dom';
import {useState} from "react";
import {CancelIcon, BadgeWithIcon} from "../styles/elements.tsx";
import {authFetch} from '../utils/api';

const EMOJI: Record<string, string> = {
    кіт: '🐱', cat: '🐱',
    пес: '🐶', dog: '🐶',
    rabbit: '🐰', parrot: '🦜'
};
const animalEmoji = (s: string) => EMOJI[s?.toLowerCase()] ?? '🐾';

type Props = {
    animal: Animal;
    onBack: () => void;
    onLoginRequest?: () => void;
    isFavorited?: boolean;
    onToggleFavorite?: (id: number) => void;
    requestedIds?: Set<number>;
    adoptedIds?: Set<number>;
    myApprovedIds?: Set<number>;
    onRequestAdded?: (animalId: number) => void;
};

export const AnimalDetail = ({
    animal, onBack, onLoginRequest,
    isFavorited = false, onToggleFavorite,
    requestedIds, adoptedIds, myApprovedIds,
    onRequestAdded
}: Props) => {
    const navigate = useNavigate();

    const [photoIndex, setPhotoIndex] = useState(0);
    const photos = [animal.imageUrl, animal.imageUrl2, animal.imageUrl3].filter(Boolean) as string[];
    const prev = () => setPhotoIndex(i => (i - 1 + photos.length) % photos.length);
    const next = () => setPhotoIndex(i => (i + 1) % photos.length);

    const [hovered,       setHovered]       = useState(false);
    const [requesting,    setRequesting]    = useState(false);
    const [justRequested, setJustRequested] = useState(false);
    const [error,         setError]         = useState<string | null>(null);

    const isAdopted  = adoptedIds?.has(animal.id)   ?? false;
    const myApproved = myApprovedIds?.has(animal.id) ?? false;
    const requested  = justRequested || (requestedIds?.has(animal.id) ?? false);
    const isBlocked  = isAdopted || myApproved || requested || requesting;

    const adoptBtnLabel = requesting ? 'Надсилання...'
                        : myApproved ? '✓ Заявку схвалено'
                        : isAdopted  ? 'Вже знайшла дім'
                        : requested  ? '✓ Заявку подано'
                        : 'Подати заявку';

    const handleAdopt = async () => {
        if (isBlocked) return;
        setRequesting(true);
        setError(null);
        try {
            const res  = await authFetch('http://localhost:8080/api/adoption-requests', {
                method: 'POST',
                body: JSON.stringify({ animalId: animal.id }),
            });
            const text = await res.text();
            const data = text ? JSON.parse(text) : {};
            if (res.status === 403) { setError(data.message ?? 'Потрібен телефон'); return; }
            if (res.status === 409) { setJustRequested(true); return; }
            if (!res.ok)            { setError(data.message ?? 'Помилка сервера'); return; }
            setJustRequested(true);
            setJustRequested(true);
            onRequestAdded?.(animal.id);
        } catch {
            setError("Помилка з'єднання. Спробуйте ще раз.");
        } finally {
            setRequesting(false);
        }
    };

    return (
        <div className="detail-page">
            <button className="detail-back" onClick={onBack}>
                <CancelIcon/>
            </button>

            <div className="detail-card">

                {/* LEFT */}
                <div className="detail-left">
                    <div className='detail-images'>
                        {photos.length > 0 ? (<>
                            <img src={photos[photoIndex]} alt={animal.name} className="detail-carousel-img"/>
                            {photos.length > 1 && (<>
                                <button className="carousel-arrow carousel-arrow--left" onClick={prev}>‹</button>
                                <button className="carousel-arrow carousel-arrow--right" onClick={next}>›</button>
                                <div className="carousel-dots">
                                    {photos.map((_, i) => (
                                        <button
                                            key={i}
                                            className={'carousel-dot' + (i === photoIndex ? ' carousel-dot--active' : '')}
                                            onClick={() => setPhotoIndex(i)}
                                        />
                                    ))}
                                </div>
                            </>)}
                        </>) : (
                            <span className="detail-photo-placeholder">{animalEmoji(animal.animalType)}</span>
                        )}
                    </div>
                </div>

                {/* RIGHT */}
                <div className="detail-body">
                    <div className="detail-header">
                        <h2 className="detail-name">{animal.name}</h2>
                        <BadgeWithIcon id={animal.animalTypeId} label={animal.animalType}/>
                    </div>

                    <div className="detail-general">
                        <div className="detail-general-row">
                            <span className="detail-general-label">Вік</span>
                            <span>{animal.age ? `${animal.age} р.` : '—'}</span>
                        </div>
                        <div className="detail-general-row">
                            <span className="detail-general-label">Висота</span>
                            <span>{animal.height ? `${animal.height} см` : '—'}</span>
                        </div>
                        <div className="detail-general-row">
                            <span className="detail-general-label">Стать</span>
                            <span>
                                {animal.sex === 'MALE' ? '♂ Хлопчик'
                                    : animal.sex === 'FEMALE' ? '♀ Дівчинка'
                                        : '—'}
                            </span>
                        </div>
                    </div>

                    {animal.description && (
                        <p className="detail-description">{animal.description}</p>
                    )}

                    {animal.shelterName && (
                        <div className="detail-shelter"
                             onClick={() => navigate('/shelters', {state: {shelterId: animal.shelterId}})}
                             style={{cursor: 'pointer'}}
                        >
                            <div className="detail-shelter-title">🏠 Притулок</div>
                            <div className="detail-shelter-name">{animal.shelterName}</div>
                        </div>
                    )}

                    {error && (
                        <div style={{
                            fontSize: 12, color: '#e74c3c',
                            background: '#e74c3c12', borderRadius: 8,
                            padding: '6px 10px', marginBottom: 8,
                        }}>
                            ⚠ {error}
                        </div>
                    )}

                    <div className="card-actions" style={{marginTop: '16px'}}>
                        <RoleGuard
                            requireAuth
                            fallback={
                                <button className="btn-primary" onClick={onLoginRequest}
                                    style={{
                                        opacity: isAdopted ? 0.75 : 1,
                                        background: isAdopted ? '#27ae60' : undefined,
                                        borderColor: isAdopted ? '#27ae60' : undefined,
                                        cursor: isAdopted ? 'default' : undefined,
                                    }}
                                >
                                    {isAdopted ? 'Вже знайшла дім' : 'Увійти щоб зв\'язатись'}
                                </button>
                            }
                        >
                            <RoleGuard roles={['ROLE_USER']}>
                                <button
                                    className="btn-primary"
                                    onClick={handleAdopt}
                                    disabled={isBlocked}
                                    style={{
                                        opacity:     isBlocked ? 0.75 : 1,
                                        background:  isBlocked ? '#27ae60' : undefined,
                                        borderColor: isBlocked ? '#27ae60' : undefined,
                                        cursor:      isBlocked ? 'default' : undefined,
                                    }}
                                >
                                    {adoptBtnLabel}
                                </button>

                                <button
                                    className="btn-ghost"
                                    onClick={() => onToggleFavorite?.(animal.id)}
                                    onMouseEnter={() => setHovered(true)}
                                    onMouseLeave={() => setHovered(false)}
                                    title={isFavorited ? 'Видалити з уподобаних' : 'Додати до уподобаних'}
                                    style={{
                                        fontSize: 13, padding: '6px 12px', transition: 'all .15s',
                                        color: isFavorited ? '#322624' : hovered ? '#69605f' : 'var(--text-muted)',
                                        borderColor: isFavorited ? '#797574' : undefined,
                                    }}
                                >
                                    {isFavorited ? '♥' : '♡'}
                                </button>
                            </RoleGuard>
                        </RoleGuard>
                    </div>
                </div>
            </div>
        </div>
    );
};