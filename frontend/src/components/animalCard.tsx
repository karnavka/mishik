// src/components/animalCard.tsx
import { useState, useEffect } from 'react';
import type { Animal } from '../types';
import { RoleGuard } from './RoleGuard';
import { authFetch } from '../utils/api';
import { getToken } from '../utils/auth';

const EMOJI: Record<string, string> = {
    кіт: '🐱', cat: '🐱',
    пес: '🐶', dog: '🐶',
    rabbit: '🐰', parrot: '🦜',
};
const animalEmoji = (s: string) => EMOJI[s?.toLowerCase()] ?? '🐾';

type Props = {
    animal: Animal;
    onLoginRequest?: () => void;
    onClick?: () => void;
    isFavorited?: boolean;
    onToggleFavorite?: (id: number) => void;
    // режим кабінету притулку
    shelterMode?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
};

export const AnimalCard = ({
    animal,
    onLoginRequest,
    onClick,
    isFavorited = false,
    onToggleFavorite,
    shelterMode = false,
    onEdit,
    onDelete,
}: Props) => {
    const [hovered,    setHovered]    = useState(false);
    const [requesting, setRequesting] = useState(false);
    const [requested,  setRequested]  = useState(false);
    const [error,      setError]      = useState<string | null>(null);

    useEffect(() => {
        if (!getToken() || shelterMode) return;
        authFetch('http://localhost:8080/api/adoption-requests/my')
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const alreadySent = data.some((r: any) => r.animalId === animal.id);
                    if (alreadySent) setRequested(true);
                }
            })
            .catch(() => {});
    }, [animal.id, shelterMode]);

    const handleAdopt = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (requested || requesting) return;
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
            if (res.status === 409) { setRequested(true); return; }
            if (!res.ok)            { setError(data.message ?? 'Помилка сервера'); return; }
            setRequested(true);
        } catch {
            setError('Помилка з\'єднання. Спробуйте ще раз.');
        } finally {
            setRequesting(false);
        }
    };

    return (
        <div
            className="card"
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : undefined }}
        >
            <div className="card-avatar">
                {animal.imageUrl
                    ? <img src={animal.imageUrl} alt={animal.name} />
                    : animalEmoji(animal.animalType)
                }
            </div>

            <div className="card-body">
                <div className="card-title">{animal.name}</div>

                <div className="badges">
                    <span className="badge">{animal.animalType}</span>
                    {animal.sex !== 'UNKNOWN' && (
                        <span className="badge">
                            {animal.sex === 'MALE' ? '♂ Хлопчик' : '♀ Дівчинка'}
                        </span>
                    )}
                </div>

                <div className="card-fields">
                    {animal.age && (
                        <div className="card-field"><span>Вік</span>{animal.age} р.</div>
                    )}
                    {animal.description && (
                        <div className="card-field"><span>Опис</span>{animal.description}</div>
                    )}
                </div>

                {error && (
                    <div style={{
                        fontSize: 12, color: '#e74c3c',
                        background: '#e74c3c12', borderRadius: 8,
                        padding: '6px 10px', marginBottom: 8,
                    }}>
                        ⚠ {error}
                    </div>
                )}

                <div className="card-actions">
                    {/* ── Режим кабінету притулку ── */}
                    {shelterMode ? (
                        <>
                            <button
                                className="btn-ghost"
                                style={{ fontSize: 12, padding: '6px 12px' }}
                                onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
                            >
                                ⛏︎
                            </button>
                            <button
                                className="btn-ghost"
                                style={{ color: '#e74c3c', borderColor: '#e74c3c', fontSize: 12, padding: '6px 12px' }}
                                onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                            >
                                🗑 Видалити
                            </button>
                        </>
                    ) : (
                        /* ── Звичайний режим ── */
                        <>
                            <RoleGuard
                                requireAuth
                                fallback={
                                    <button
                                        className="btn-primary"
                                        onClick={(e) => { e.stopPropagation(); onLoginRequest?.(); }}
                                    >
                                        Увійти щоб зв'язатись
                                    </button>
                                }
                            >
                                <button
                                    className="btn-primary"
                                    onClick={handleAdopt}
                                    disabled={requesting || requested}
                                    style={{
                                        opacity:     requested ? 0.75 : 1,
                                        background:  requested ? '#27ae60' : undefined,
                                        borderColor: requested ? '#27ae60' : undefined,
                                        cursor:      requested ? 'default' : undefined,
                                    }}
                                >
                                    {requesting ? 'Надсилання...' : requested ? '✓ Заявку подано' : 'Подати заявку'}
                                </button>
                            </RoleGuard>

                            <RoleGuard requireAuth>
                                <button
                                    className="btn-ghost"
                                    onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(animal.id); }}
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};