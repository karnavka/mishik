import { useState, useMemo } from 'react';
import type { Animal } from '../types';
import { useFetch } from '../api/fetch';
import { MOCK_ANIMALS } from '../utils/mocks';
import { AnimalCard } from '../components/animalCard';
import { Sidebar } from '../components/Sidebar';

const FILTERS = [
  { key: 'species', label: 'Вид',    opts: [{ v: 'Кіт', l: '🐱 Кіт' }, { v: 'Пес', l: '🐶 Пес' }] },
  { key: 'gender',  label: 'Стать',  opts: [{ v: 'Хлопчик', l: '♂ Хлопчик' }, { v: 'Дівчинка', l: '♀ Дівчинка' }] },
  { key: 'size',    label: 'Розмір', opts: [{ v: 'Маленький', l: 'Маленький' }, { v: 'Середній', l: 'Середній' }, { v: 'Великий', l: 'Великий' }] },
];

type Props = { onLoginRequest: () => void };

export const AnimalsPage = ({ onLoginRequest }: Props) => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const toggle = (key: string, value: string) =>
    setFilters(prev =>
      prev[key] === value
        ? Object.fromEntries(Object.entries(prev).filter(([k]) => k !== key))
        : { ...prev, [key]: value }
    );

  const { data: animals, loading, error } = useFetch<Animal>(null, MOCK_ANIMALS);
  // замінити null на '/api/animals' коли backend готовий

  const visible = useMemo(() => {
    const q = search.toLowerCase();
    return animals.filter(a => {
      if (q && !a.name?.toLowerCase().includes(q) && !a.breed?.toLowerCase().includes(q)) return false;
      return Object.entries(filters).every(([k, v]) => !v || String((a as Record<string, unknown>)[k]) === v);
    });
  }, [animals, search, filters]);

  return (
    <div className="body">
      <Sidebar
        filters={filters}
        onToggle={toggle}
        filterGroups={FILTERS}
        addLabel="+ Додати тварину"
        onAdd={onLoginRequest}
      />
      <div className="main">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Пошук за ім'ям або породою..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="feed">
          {loading  ? <div className="empty">Завантаження...</div>
          : error   ? <div className="empty">Помилка: {error}</div>
          : visible.length === 0 ? <div className="empty">🐾 Тварин не знайдено</div>
          : visible.map(a => (
              <AnimalCard key={a.id} animal={a} onLoginRequest={onLoginRequest} />
            ))
          }
        </div>
      </div>
    </div>
  );
};