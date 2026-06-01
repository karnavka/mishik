import type { Animal } from '../types';
import { RoleGuard } from './RoleGuard';

const EMOJI: Record<string, string> = {
    кіт: '🐱', cat: '🐱',
    пес: '🐶', dog: '🐶',
    rabbit: '🐰', parrot: '🦜'
};
const animalEmoji = (s: string) => EMOJI[s?.toLowerCase()] ?? '🐾';

type Props = { animal: Animal; onLoginRequest?: () => void };

//додати через бек картинки!!🦧
export const AnimalCard = ({ animal, onLoginRequest }: Props) => (
    <div className="card">
        <div className="card-avatar">
            {/*animal.imageUrl ? <img src={animal.imageUrl} alt={animal.name} /> : */animalEmoji(animal.animalType)}
        </div>
        <div className="card-body">
            <div className="card-title">{animal.name}</div>
            <div className="card-sub">{[animal.animalType, animal.shelterName].filter(Boolean).join(' · ')}</div>

            <div className="badges">
                <span className="badge">{animal.animalType}</span>
                <span className="badge">{animal.sex === 'MALE' ? '♂ Хлопчик' : '♀ Дівчинка'}</span>
            </div>

            <div className="card-fields">
                {animal.age && <div className="card-field"><span>Вік</span>{animal.age} р.</div>}
                {animal.description && <div className="card-field"><span>Опис</span>{animal.description}</div>}
            </div>

            <div className="card-actions">
                {/* Видно всім — зв'язатись */}
                <RoleGuard
                    requireAuth
                    fallback={
                        <button className="btn-primary" onClick={onLoginRequest}>
                            Увійти щоб зв'язатись
                        </button>
                    }
                >
                    <button className="btn-primary" onClick={e => { e.stopPropagation(); alert('TODO: contact'); }}>
                        Зв'язатися
                    </button>
                </RoleGuard>

                {/* Зберегти — тільки залогінені */}
                <RoleGuard requireAuth>
                    <button className="btn-ghost" onClick={e => { e.stopPropagation(); alert('TODO: save'); }}>
                        ♡ Зберегти
                    </button>
                </RoleGuard>

             {/*   Редагувати — притулок або адмін *
                <RoleGuard roles={['SHELTER', 'ADMIN']}>
                    <button className="btn-ghost" onClick={e => { e.stopPropagation(); alert('TODO: edit'); }}>
                        Редагувати
                    </button>
                </RoleGuard>
                
                {/* Блокувати — модератор або адмін 
                <RoleGuard roles={['MODERATOR', 'ADMIN']}>
                    <button className="btn-ghost" style={{ color: '#c0392b' }}
                        onClick={e => { e.stopPropagation(); alert('TODO: block'); }}>
                        Заблокувати
                    </button>
                </RoleGuard>
                */}
            </div>
        </div>
    </div>
);