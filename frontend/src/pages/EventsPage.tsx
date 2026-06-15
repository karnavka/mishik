import { useState, useMemo, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../api/useAuth';
import { authFetch } from '../utils/api';

type Event = {
    id: number;
    name: string;
    description: string;
    dateOfEvent: string;
    organizerName?: string;
    city?: string;
    region?: string;
    street?: string;
    organizerPhone?: string;
    organizerSocialLinks?: string;
};

const FILTERS = [
    {
        key: 'city',
        label: 'Місто',
        opts: [
            { v: 'Київ', l: 'Київ' },
            { v: 'Львів', l: 'Львів' },
            { v: 'Харків', l: 'Харків' }
        ]
    }
];

type Props = {
    onLoginRequest: () => void;
};

export const EventsPage = ({ onLoginRequest }: Props) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [noPhoneWarning, setNoPhoneWarning] = useState(false);
    const { loggedIn, role } = useAuth();

    useEffect(() => {
        fetch('http://localhost:8080/api/volunteering')
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(err => console.error(err));
    }, []);

    const handleAddClick = async () => {
        if (!loggedIn) { onLoginRequest(); return; }

        if (role === 'ROLE_SHELTER') {
            try {
                const shelterData = await authFetch('http://localhost:8080/api/shelters/me').then(r => r.json());
                if (!shelterData.phoneNumber) {
                    setNoPhoneWarning(true);
                    return;
                }
            } catch {
                setNoPhoneWarning(true);
                return;
            }
        } else if (role === 'ROLE_USER') {
            try {
                const userData = await authFetch('http://localhost:8080/users/api/me').then(r => r.json());
                if (!userData.phoneNumber) {
                    setNoPhoneWarning(true);
                    return;
                }
            } catch {
                setNoPhoneWarning(true);
                return;
            }
        }

        setNoPhoneWarning(false);
        onLoginRequest(); 
    };

    const toggle = (key: string, value: string) =>
        setFilters(prev =>
            prev[key] === value
                ? Object.fromEntries(
                    Object.entries(prev).filter(([k]) => k !== key)
                )
                : { ...prev, [key]: value }
        );

    const visible = useMemo(() => {
        const q = search.toLowerCase();
        return events.filter(ev => {
            if (
                q &&
                !ev.name?.toLowerCase().includes(q) &&
                !ev.organizerName?.toLowerCase().includes(q)
            ) {
                return false;
            }
            return Object.entries(filters).every(([k, v]) => {
                if (!v) return true;
                return (ev as Record<string, unknown>)[k] === v;
            });
        });
    }, [events, search, filters]);

    return (
        <div className="body">
            <div className="animal-filter" style={{ padding: '16px 10px 10px 10px' }}>
                <Sidebar
                    filters={filters}
                    onToggle={toggle}
                    filterGroups={FILTERS}
                    addLabel="+ Додати подію"
                    onAdd={handleAddClick}
                />
            </div>

            <div className="main">
                {noPhoneWarning && (
                    <div style={{
                        margin: '16px 40px 0 20px',
                        padding: '12px 16px',
                        borderRadius: 10,
                        background: '#f39c1215',
                        border: '1px solid #f39c1240',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                    }}>
                        <span style={{ fontSize: 25 }}>☏</span>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#f39c12' }}>Потрібен телефон</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                                Для створення події необхідно вказати номер телефону у профілі.
                            </div>
                        </div>
                        <button
                            onClick={() => setNoPhoneWarning(false)}
                            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-muted)' }}
                        >✕</button>
                    </div>
                )}

                <div className="search-bar" style={{ padding: '16px 40px 0 20px' }}>
                    <input
                        type="text"
                        placeholder="Пошук подій..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className="feed">
                    {visible.length === 0 ? (
                        <div className="empty">Подій не знайдено</div>
                    ) : (
                        visible.map(ev => {
                            const [instagram, facebook, telegram] = (() => {
                                if (!ev.organizerSocialLinks) return [null, null, null];
                                const parts = ev.organizerSocialLinks.split('|');
                                return [parts[0] || null, parts[1] || null, parts[2] || null];
                            })();

                            return (
                                <div key={ev.id} className="card">
                                    <div className="card-avatar">📅</div>

                                    <div className="card-body">
                                        <div className="card-title">{ev.name}</div>

                                        <div className="card-sub">
                                            {ev.organizerName}
                                            {ev.city || ev.region || ev.street ? (
                                                <>
                                                    {' · '}
                                                    {[ev.city, ev.region, ev.street].filter(Boolean).join(', ')}
                                                </>
                                            ) : null}
                                        </div>

                                        <div className="badges">
                                            <span className="badge">
                                                {new Date(ev.dateOfEvent).toLocaleDateString('uk-UA')}
                                            </span>
                                        </div>

                                        <div className="card-fields">
                                            <div className="card-field">
                                                <span>Опис</span>
                                                {ev.description}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 12, flexWrap: 'wrap' }}>
                                            {ev.organizerPhone && (
                                                <button
                                                    className="btn-ghost"
                                                    style={{ fontSize: 13 }}
                                                    onClick={() => window.location.href = `tel:${ev.organizerPhone}`}
                                                >
                                                    ☏ Зателефонувати
                                                </button>
                                            )}
                                        </div>
                                            {(instagram || facebook || telegram) && (
                                                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                                    {instagram && (
                                                        <a href={instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
                                                            <img src="src/assets/free-icon-instagram-717392.png" alt="Instagram" style={{ width: 15, height: 15, objectFit: 'contain' }} />
                                                        </a>
                                                    )}
                                                    {facebook && (
                                                        <a href={facebook} target="_blank" rel="noopener noreferrer" title="Facebook">
                                                            <img src="src/assets/free-icon-facebook-circular-logo-20673.png" alt="Facebook" style={{ width: 15, height: 15, objectFit: 'contain' }} />
                                                        </a>
                                                    )}
                                                    {telegram && (
                                                        <a href={telegram} target="_blank" rel="noopener noreferrer" title="Telegram">
                                                            <img src="src/assets/free-icon-telegram-4701496.png" alt="Telegram" style={{ width: 15, height: 15, objectFit: 'contain' }} />
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                       
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};