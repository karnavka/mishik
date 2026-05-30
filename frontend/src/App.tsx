import './App.css'
import { useAuth } from '.api/useAuth.ts';
import { useState, useMemo } from 'react';
import type {Animal, Organization} from "./types";
import { useFetch } from './api/fetch';
import { MOCK_ANIMALS, MOCK_ORGS } from './utils/mocks.ts';
import {AnimalCard} from "./components/animalCard.tsx";
import {OrgCard} from "./components/orgCard.tsx";
import { RoleGuard } from './components/RoleGuard.tsx';

// ─── Main App ─────────────────────────────────────────────────────────────────

type Tab = 'animals' | 'orgs';
export const AnimalPage = () => {
  const { loggedIn } = useAuth();
 export default function App() {
    
    const [tab, setTab] = useState<Tab>('animals');
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<Record<string, string>>({});

    // Reset filters when switching tabs
    function handleTabSwitch(t: Tab) {
        setTab(t);
        setSearch('');
        setFilters({});
    }

    function toggleFilter(key: string, value: string) {
        setFilters(prev =>
            prev[key] === value
                ? Object.fromEntries(Object.entries(prev).filter(([k]) => k !== key))
                : { ...prev, [key]: value }
        );
    }

    const { data: animals, loading: animalsLoading, error: animalsError } =
        useFetch<Animal>(null, MOCK_ANIMALS);
        //useFetch<Animal>('/api/animals', MOCK_ANIMALS);

    const { data: orgs, loading: orgsLoading, error: orgsError } =
        useFetch<Organization>(null, MOCK_ORGS);
        //useFetch<Organization>('/api/organizations', MOCK_ORGS);

    const visibleAnimals = useMemo(() => {
        const q = search.toLowerCase();
        return animals.filter(a => {
            if (q && !a.name?.toLowerCase().includes(q) && !a.breed?.toLowerCase().includes(q)) return false;
            return Object.entries(filters).every(([k, v]) => !v || String((a as Record<string, unknown>)[k]) === v);
        });
    }, [animals, search, filters]);   // ← animals added to deps

    const visibleOrgs = useMemo(() => {
        const q = search.toLowerCase();
        return orgs.filter(o => {
            if (q && !o.name?.toLowerCase().includes(q)) return false;
            return Object.entries(filters).every(([k, v]) => !v || String((o as Record<string, unknown>)[k]) === v);
        });
    }, [orgs, search, filters]);

    // ── Sidebar filter config ──
    const sidebarFilters =
        tab === 'animals'
            ? [
                { key: 'species', label: 'Вид',    opts: [{ v: 'Кіт', l: '🐱 Кіт' }, { v: 'Пес', l: '🐶 Пес' }] },
                { key: 'gender',  label: 'Стать',  opts: [{ v: 'Хлопчик', l: '♂ Хлопчик' }, { v: 'Дівчинка', l: '♀ Дівчинка' }] },
                { key: 'size',    label: 'Розмір', opts: [{ v: 'Маленький', l: 'Маленький' }, { v: 'Середній', l: 'Середній' }, { v: 'Великий', l: 'Великий' }] },
            ]
            : [
                { key: 'type', label: 'Тип',   opts: [{ v: 'Притулок', l: '🏠 Притулок' }, { v: 'Клініка', l: '🏥 Клініка' }, { v: 'Фонд', l: '❤️ Фонд' }] },
                { key: 'city', label: 'Місто', opts: [{ v: 'Київ', l: 'Київ' }, { v: 'Львів', l: 'Львів' }, { v: 'Харків', l: 'Харків' }] },
            ];

    

    return (
        <>
            <div className="app">

                {/* Header */}
                <header className="header">
                    <span className="logo">🐾 Mishik</span>
                    <button
                        className={'tab-btn' + (tab === 'animals' ? ' active' : '')}
                        onClick={() => handleTabSwitch('animals')}
                    >
                        Знайти друга
                    </button>
                    <button
                        className={'tab-btn' + (tab === 'orgs' ? ' active' : '')}
                        onClick={() => handleTabSwitch('orgs')}
                    >
                        Організації
                    </button>
                </header>

                <div className="body">

                    {/* Sidebar */}
                    <aside className="sidebar">
                        <span className="sidebar-title">Фільтри</span>
                        {sidebarFilters.map(fg => (
                            <div className="filter-group" key={fg.key}>
                                <span className="filter-group-label">{fg.label}</span>
                                {fg.opts.map(o => (
                                    <button
                                        key={o.v}
                                        className={'filter-opt' + (filters[fg.key] === o.v ? ' selected' : '')}
                                        onClick={() => toggleFilter(fg.key, o.v)}
                                    >
                                        {o.l}
                                    </button>
                                ))}
                            </div>
                        ))}
                        <RoleGuard>
                        <button
                            className="add-btn"
                            onClick={() => alert('TODO: open form')}
                        >
                            {tab === 'animals' ? '+ Додати тварину' : '+ Додати організацію'}
                        </button>
        
                        </RoleGuard>
                    </aside>

                    {/* Main */}
                    <div className="main">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder={tab === 'animals' ? "Пошук за ім'ям або породою..." : 'Пошук за назвою...'}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="feed">
                             
                            {tab === 'animals' && (
                                animalsLoading     ? <div className="empty">Завантаження...</div> :
                                    animalsError       ? <div className="empty">Помилка: {animalsError}</div> :
                                        visibleAnimals.length === 0 ? <div className="empty">🐾 Тварин не знайдено</div> :
                                            visibleAnimals.map(a => <AnimalCard key={a.id} animal={a} />)
                            )}
                            {tab === 'orgs' && (
                                orgsLoading        ? <div className="empty">Завантаження...</div> :
                                    orgsError          ? <div className="empty">Помилка: {orgsError}</div> :
                                        visibleOrgs.length === 0 ? <div className="empty">🏠 Організацій не знайдено</div> :
                                            visibleOrgs.map(o => <OrgCard key={o.id} org={o} />)
                            )}
                                                    </div>
                    </div>

                </div>
            </div>
        </>
    );
}
};

