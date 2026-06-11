import type { Animal } from '../types';
import { RoleGuard } from './RoleGuard';
import { useNavigate } from 'react-router-dom';

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

export const AnimalDetail = ({ animal, onBack, onLoginRequest }: Props) => {
    const navigate = useNavigate();
    return(
        <div className="detail-page">

            {/* Back button */}
            <button className="detail-back" onClick={onBack}>
                ←
            </button>

            <div className="detail-card">

                <div className="detail-photo">
                    {animal.imageUrl
                        ? <img src={animal.imageUrl} />
                        : <span className="detail-photo-placeholder">{animalEmoji(animal.animalType)}</span>
                    }
                </div>

                {/* Info */}
                <div className="detail-body">
                    <h2 className="detail-name">{animal.name}</h2>
                    <p className="detail-sub">{animal.animalType}</p>

                    <div className="badges" style={{ marginBottom: '12px' }}>

                    {animal.sex !== 'UNKNOWN' && (
                        <span className="badge">
                            {animal.sex === 'MALE'
                                ? '♂ Хлопчик'
                                : '♀ Дівчинка'}
                        </span>
                    )}
                </div>

                    <div className="detail-fields">
                        {animal.age        && <Row label="Вік"      value={`${animal.age} р.`} />}
                        {animal.height     && <Row label="Висота"   value={`${animal.height} см`} />}
                        {animal.description && <Row label="Опис"    value={animal.description} />}
                    </div>

                    {/* Shelter block */}
                    {animal.shelterName && (
                        <div className="detail-shelter"
                             onClick={() => navigate('/shelters', { state: { shelterId: animal.shelterId } })}
                             style={{ cursor: 'pointer' }}
                        >
                            <div className="detail-shelter-title">🏠 Притулок</div>
                            <div className="detail-shelter-name">{animal.shelterName}</div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="card-actions" style={{ marginTop: '16px' }}>
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

const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="card-field">
        <span>{label}</span>{value}
    </div>
);
