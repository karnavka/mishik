import {useState, useMemo, useEffect} from 'react';
import type {Animal, Organization} from '../types';
import {useFetch} from '../api/fetch';
import {AnimalCard} from '../components/animalCard';
import {Sidebar} from '../components/Sidebar';
import {AnimalDetail} from "../components/animalDetail.tsx";
import {useLocation} from "react-router-dom";
import {Footer} from "../components/Footer.tsx";
import {TYPE_ALIASES} from "../types";
import { useAuth } from '../api/useAuth';
import { authFetch } from '../utils/api';

type Props = { onLoginRequest: () => void };

export const AnimalsPage = ({ onLoginRequest }: Props) => {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<Animal | null>(null);
    const location = useLocation();

    const [filters, setFilters] = useState<Record<string, string>>(() => {
        const state = location.state as { shelterId?: string } | null;
        return state?.shelterId ? { shelterId: state.shelterId } : {};
    });

    const [favorites,      setFavorites]      = useState<Set<number>>(new Set());
    const [requestedIds,   setRequestedIds]   = useState<Set<number>>(new Set());
    const [adoptedIds,     setAdoptedIds]     = useState<Set<number>>(new Set());
    const [myApprovedIds,  setMyApprovedIds]  = useState<Set<number>>(new Set());
    const { isUser } = useAuth();
    const handleRequestAdded = (animalId: number) => {
    setRequestedIds(prev => new Set(prev).add(animalId));
    };
    useEffect(() => {
        if (!isUser) return;
        authFetch('http://localhost:8080/api/favorites')
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data))
                    setFavorites(new Set(data.map((a: any) => a.id)));
            })
            .catch(() => {});
    }, [isUser]);

    useEffect(() => {
        if (!isUser) return;
        authFetch('http://localhost:8080/api/adoption-requests/my')
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data))
                    setRequestedIds(new Set(data.map((r: any) => r.animalId)));
            })
            .catch(() => {});
    }, [isUser]);

    useEffect(() => {
        fetch('http://localhost:8080/api/adoption-requests/adopted-animal-ids')
            .then(r => r.json())
            .then((ids: number[]) => setAdoptedIds(new Set(ids)))
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!isUser) return;
        authFetch('http://localhost:8080/api/adoption-requests/my-approved-animal-ids')
            .then(r => r.json())
            .then((ids: number[]) => setMyApprovedIds(new Set(ids)))
            .catch(() => {});
    }, [isUser]);

    useEffect(() => {
        setSelected(null);
        const state = location.state as { shelterId?: string } | null;
        setFilters(state?.shelterId ? { shelterId: state.shelterId } : {});
    }, [location]);

    const toggle = (key: string, value: string) =>
        setFilters(prev =>
            prev[key] === value || value === ''
                ? Object.fromEntries(Object.entries(prev).filter(([k]) => k !== key))
                : { ...prev, [key]: value }
        );

    const query = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([k]) => k !== 'age'))
    ).toString();
    const url = '/api/animals' + (query ? '?' + query : '');

    const { data: animals, loading, error } = useFetch<Animal>(url);

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase();
        const ageRange = filters['age'];
        const aliasEntries = Object.entries(TYPE_ALIASES);

        return animals.filter(a => {
            const matchSearch = !q || (() => {
                const matchedTypeIds = aliasEntries
                    .filter(([alias]) => alias.startsWith(q))
                    .map(([, id]) => id);
                if (matchedTypeIds.length > 0)
                    return matchedTypeIds.includes(String(a.animalTypeId));
                return a.animalType?.toLowerCase().startsWith(q);
            })();

            const matchAge = !ageRange || (() => {
                const age = a.age;
                if (ageRange === '0-1') return age < 1;
                if (ageRange === '1-2') return age >= 1 && age < 2;
                if (ageRange === '2-5') return age >= 2 && age <= 5;
                if (ageRange === '5+') return age > 5;
                return true;
            })();
            return matchSearch && matchAge;
        });
    }, [animals, search, filters]);

    const { data: allAnimals } = useFetch<Animal>('/api/animals');
    const cities = useMemo(() => {
        const unique = new Set(allAnimals.map(a => a.city).filter(Boolean));
        return Array.from(unique) as string[];
    }, [allAnimals]);
    const { data: shelters } = useFetch<Organization>('/api/shelters');

    const toggleFavorite = async (id: number) => {
        const isFav = favorites.has(id);
        setFavorites(prev => {
            const next = new Set(prev);
            isFav ? next.delete(id) : next.add(id);
            return next;
        });
        await authFetch(`http://localhost:8080/api/favorites/${id}`, {
            method: isFav ? 'DELETE' : 'POST',
        }).catch(() => {
            setFavorites(prev => {
                const next = new Set(prev);
                isFav ? next.add(id) : next.delete(id);
                return next;
            });
        });
    };

    const filterGroups = [{
        key: 'typeId',
        label: 'Вид',
        opts: [
            {v: 2, l: 'кітик', icon: `/images/Cat.png`},
            {v: 1, l: 'пес',   icon: `/images/Dog.png`},
            {v: 3, l: 'кролик', icon: `/images/Rabbit.png`},
            {v: 4, l: 'папужка', icon: `/images/Parrot.png`}
        ],
        columns: 2
    }, {
        key: 'sex',
        label: 'Стать',
        opts: [
            {v: 'MALE',   l: 'хлопчик', icon: '/images/MALE.png'},
            {v: 'FEMALE', l: 'дівчинка', icon: '/images/FEMALE.png'},
        ],
        columns: 2,
    }, {
        key: 'city',
        label: 'Місто',
        icon: '/images/location.png',
        type: 'select' as const,
        opts: cities.map(c => ({ v: c, l: c })),
    }, {
        key: 'shelterId',
        label: 'Притулок',
        icon: '/images/shelters.png',
        type: 'select' as const,
        opts: shelters.map(s => ({ v: String(s.id), l: s.name })),
    }, {
        key: 'age',
        label: 'Вік',
        opts: [
            { v: '0-1', l: 'До 1 року' },
            { v: '1-2', l: '1–2 роки'  },
            { v: '2-5', l: '2–5 років' },
            { v: '5+',  l: 'Більше 5'  },
        ],
        columns: 2,
    }];

    if (selected) {
        return (
            <AnimalDetail
                animal={selected}
                onBack={() => setSelected(null)}
                onLoginRequest={onLoginRequest}
                isFavorited={favorites.has(selected.id)}
                onToggleFavorite={toggleFavorite}
                adoptedIds={adoptedIds}
                myApprovedIds={myApprovedIds}
                onRequestAdded={handleRequestAdded}
                requestedIds={requestedIds}
            />
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'auto' }}>
            <div className="body">
                <div className="animal-filter">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Пошук за видом..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <Sidebar
                        filters={filters}
                        onToggle={toggle}
                        filterGroups={filterGroups}
                        addLabel="+ Додати тварину"
                        onAdd={onLoginRequest}
                    />
                </div>

                <div className="main">
                    <div className="feed">
                        {loading
                            ? <div className="empty">Завантаження...</div>
                            : error
                            ? <div className="empty">Помилка: {error}</div>
                            : visible.length === 0
                            ? <div className="empty">🐾 Тварин не знайдено</div>
                            : visible.map(a => (
                                <AnimalCard
                                    key={a.id}
                                    animal={a}
                                    onLoginRequest={onLoginRequest}
                                    onClick={() => setSelected(a)}
                                    isFavorited={favorites.has(a.id)}
                                    onToggleFavorite={toggleFavorite}
                                    requestedIds={requestedIds}
                                    adoptedIds={adoptedIds}
                                    myApprovedIds={myApprovedIds}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};