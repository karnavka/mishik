import { useState, useMemo, useEffect } from 'react';
import { RoleGuard } from '../components/RoleGuard';
import { Sidebar } from '../components/Sidebar';

type Event = {
    id: number;
    name: string;
    description: string;
    dateOfEvent: string;
    organizerName?: string;
    city?: string;
    region?: string;
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

    useEffect(() => {
        fetch('http://localhost:8080/api/volunteering')
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(err => console.error(err));
    }, []);

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
            <Sidebar
                filters={filters}
                onToggle={toggle}
                filterGroups={FILTERS}
                addLabel="+ Додати подію"
                onAdd={onLoginRequest}
            />

            <div className="main">
                <div className="search-bar">
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
                        visible.map(ev => (
                            <div key={ev.id} className="card">
                                <div className="card-avatar">📅</div>

                                <div className="card-body">
                                    <div className="card-title">{ev.name}</div>

                                    <div className="card-sub">
                                        {ev.organizerName} · {ev.city}
                                    </div>

                                    <div className="badges">
                    <span className="badge">
                      {new Date(ev.dateOfEvent).toLocaleDateString(
                          'uk-UA'
                      )}
                    </span>
                                    </div>

                                    <div className="card-fields">
                                        <div className="card-field">
                                            <span>Опис</span>
                                            {ev.description}
                                        </div>
                                    </div>

                                    <div className="card-actions">
                                        <RoleGuard
                                            requireAuth
                                            fallback={
                                                <button
                                                    className="btn-primary"
                                                    onClick={onLoginRequest}
                                                >
                                                    Увійти щоб записатись
                                                </button>
                                            }
                                        >
                                            <button
                                                className="btn-primary"
                                                onClick={() => alert('TODO')}
                                            >
                                                Записатись
                                            </button>
                                        </RoleGuard>

                                        <button
                                            className="btn-ghost"
                                            onClick={() => alert('TODO')}
                                        >
                                            Поділитись
                                        </button>

                                        <RoleGuard roles={['MODERATOR', 'ADMIN', 'SHELTER']}>
                                            <button
                                                className="btn-ghost"
                                                onClick={() => alert('TODO')}
                                            >
                                                ✏️ Редагувати
                                            </button>
                                        </RoleGuard>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};