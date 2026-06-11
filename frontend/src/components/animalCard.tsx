import { useState } from 'react';
import type { Animal } from '../types';
import { RoleGuard } from './RoleGuard';

const EMOJI: Record<string, string> = {
    кіт: '🐱',
    cat: '🐱',
    пес: '🐶',
    dog: '🐶',
    rabbit: '🐰',
    parrot: '🦜',
};

const animalEmoji = (s: string) => EMOJI[s?.toLowerCase()] ?? '🐾';

type Props = {
    animal: Animal;
    onLoginRequest?: () => void;
    onClick?: () => void;
    isFavorited?: boolean;
    onToggleFavorite?: (id: number) => void;
};

export const AnimalCard = ({
    animal,
    onLoginRequest,
    onClick,
    isFavorited = false,
    onToggleFavorite,
}: Props) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="card"
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : undefined }}
        >
            <div className="card-avatar">
                {animal.imageUrl ? (
                    <img
                        src={animal.imageUrl}
                        alt={animal.name}
                    />
                ) : (
                    animalEmoji(animal.animalType)
                )}
            </div>

            <div className="card-body">
                <div className="card-title">{animal.name}</div>

                <div className="card-sub">
                    {[animal.animalType, animal.shelterName]
                        .filter(Boolean)
                        .join(' · ')}
                </div>

                <div className="badges">
                    <span className="badge">{animal.animalType}</span>

                    {animal.sex !== 'UNKNOWN' && (
                        <span className="badge">
                            {animal.sex === 'MALE'
                                ? '♂ Хлопчик'
                                : '♀ Дівчинка'}
                        </span>
                    )}
                </div>

                <div className="card-fields">
                    {animal.age && (
                        <div className="card-field">
                            <span>Вік</span>
                            {animal.age} р.
                        </div>
                    )}

                    {animal.description && (
                        <div className="card-field">
                            <span>Опис</span>
                            {animal.description}
                        </div>
                    )}
                </div>

                <div className="card-actions">
                    {/* Зв'язатися */}
                    <RoleGuard
                        requireAuth
                        fallback={
                            <button
                                className="btn-primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onLoginRequest?.();
                                }}
                            >
                                Увійти щоб зв'язатись
                            </button>
                        }
                    >
                        <button
                            className="btn-primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                alert('TODO: contact');
                            }}
                        >
                            Зв'язатися
                        </button>
                    </RoleGuard>

                    {/* Уподобані */}
                    <RoleGuard requireAuth>
                        <button
                            className="btn-ghost"
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite?.(animal.id);
                            }}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                            title={
                                isFavorited
                                    ? 'Видалити з уподобаних'
                                    : 'Додати до уподобаних'
                            }
                            style={{
                                fontSize: 13,
                                padding: '6px 12px',
                                transition: 'all .15s',
                                color: isFavorited
                                    ? '#322624'
                                    : hovered
                                    ? '#69605f'
                                    : 'var(--text-muted)',
                                borderColor: isFavorited
                                    ? '#797574'
                                    : undefined,
                            }}
                        >
                            {isFavorited ? '♥' : '♡'}
                        </button>
                    </RoleGuard>

                    {/*
                    <RoleGuard roles={['SHELTER', 'ADMIN']}>
                        <button
                            className="btn-ghost"
                            onClick={(e) => {
                                e.stopPropagation();
                                alert('TODO: edit');
                            }}
                        >
                            Редагувати
                        </button>
                    </RoleGuard>

                    <RoleGuard roles={['MODERATOR', 'ADMIN']}>
                        <button
                            className="btn-ghost"
                            style={{ color: '#c0392b' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                alert('TODO: block');
                            }}
                        >
                            Заблокувати
                        </button>
                    </RoleGuard>
                    */}
                </div>
            </div>
        </div>
    );
};