import type {Animal} from '../types';
import {RoleGuard} from './RoleGuard';
import {useNavigate} from 'react-router-dom';
import {useState} from "react";
import {CancelIcon, BadgeWithIcon} from "../styles/elements.tsx";

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
};

export const AnimalDetail = ({animal, onBack, onLoginRequest}: Props) => {
    const navigate = useNavigate();

    const [photoIndex, setPhotoIndex] = useState(0);
    const photos = [animal.imageUrl, animal.imageUrl2, animal.imageUrl3].filter(Boolean) as string[];
    const prev = () => setPhotoIndex(i => (i - 1 + photos.length) % photos.length);
    const next = () => setPhotoIndex(i => (i + 1) % photos.length);

    return (
        <div className="detail-page">

            <button className="detail-back" onClick={onBack}>
                <CancelIcon/>
            </button>

            <div className="detail-card">

                {/* LEFT  */}
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
                                        />))}
                                </div>
                            </>)}

                        </>) : (
                            <span className="detail-photo-placeholder">{animalEmoji(animal.animalType)}</span>
                        )}
                    </div>

                </div>

                {/* RIGhT*/}
                <div className="detail-body">

                    <div className="detail-header">
                        <h2 className="detail-name">{animal.name}</h2>
                        <BadgeWithIcon
                            id = {animal.animalTypeId}
                            label = {animal.animalType}
                        />
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

                    <div className="card-actions" style={{marginTop: '16px'}}>
                        <RoleGuard
                            requireAuth
                            fallback={
                                <button className="btn-primary" onClick={onLoginRequest}>
                                    Увійти щоб зв'язатись
                                </button>
                            }
                        >
                            <button className="btn-primary" onClick={() => alert('TODO: contact')}>
                                Зв'язатися з притулком
                            </button>
                        </RoleGuard>

                        <RoleGuard requireAuth>
                            <button className="btn-ghost" onClick={() => alert('TODO: save')}>
                                ♡ Зберегти
                            </button>
                        </RoleGuard>
                    </div>
                </div>
            </div>
        </div>
    );
}
