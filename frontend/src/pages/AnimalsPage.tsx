import { useState, useMemo, useEffect } from 'react';
import type { Animal } from '../types';
import { useFetch } from '../api/fetch';
import { AnimalCard } from '../components/animalCard';
import { Sidebar } from '../components/Sidebar';
import { AnimalDetail } from '../components/animalDetail.tsx';
import { useLocation } from 'react-router-dom';
import { getToken } from '../utils/auth';
import { authFetch } from '../utils/api.ts';

type Props = { onLoginRequest: () => void };

export const AnimalsPage = ({ onLoginRequest }: Props) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Animal | null>(null);
  const location = useLocation();

  const [filters, setFilters] = useState<Record<string, string>>(() => {
    const state = location.state as { shelterId?: string } | null;
    return state?.shelterId ? { shelterId: state.shelterId } : {};
  });

  // ── Уподобані ── всі хуки ВГОРІ, до будь-яких return
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!getToken()) return;
    authFetch('http://localhost:8080/api/favorites')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data))
          setFavorites(new Set(data.map((a: any) => a.id)));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setSelected(null);
    const state = location.state as { shelterId?: string } | null;
    setFilters(state?.shelterId ? { shelterId: state.shelterId } : {});
  }, [location]);

  const { data: animalTypes } = useFetch<{ id: number; type: string }>('/api/animal-types');
  const typeFilter = {
    key: 'typeId',
    label: 'Вид',
    opts: animalTypes.map(t => ({ v: String(t.id), l: t.type })),
  };

  const filterGroups = [
    typeFilter,
    {
      key: 'sex',
      label: 'Стать',
      opts: [
        { v: 'MALE',   l: '♂ Хлопчик' },
        { v: 'FEMALE', l: '♀ Дівчинка' },
      ],
    },
  ];

  const toggle = (key: string, value: string) =>
    setFilters(prev =>
      prev[key] === value
        ? Object.fromEntries(Object.entries(prev).filter(([k]) => k !== key))
        : { ...prev, [key]: value }
    );

  const query = new URLSearchParams(filters).toString();
  const url   = '/api/animals' + (query ? '?' + query : '');

  const { data: animals, loading, error } = useFetch<Animal>(url);

  const visible = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return animals;
    return animals.filter(a => a.name?.toLowerCase().includes(q));
  }, [animals, search]);

  const toggleFavorite = async (id: number) => {
    const isFav = favorites.has(id);
    // Оновити UI одразу (optimistic)
    setFavorites(prev => {
      const next = new Set(prev);
      isFav ? next.delete(id) : next.add(id);
      return next;
    });
    // Запит до API
    await authFetch(`http://localhost:8080/api/favorites/${id}`, {
      method: isFav ? 'DELETE' : 'POST',
    }).catch(() => {
      // Відкотити при помилці
      setFavorites(prev => {
        const next = new Set(prev);
        isFav ? next.add(id) : next.delete(id);
        return next;
      });
    });
  };

  // ── Умовний return ПІСЛЯ всіх хуків ──
  if (selected) {
    return (
      <AnimalDetail
        animal={selected}
        onBack={() => setSelected(null)}
        onLoginRequest={onLoginRequest}
        isFavorited={favorites.has(selected.id)}
        onToggleFavorite={toggleFavorite}
      />
    );
  }

  return (
    <div className="body">
      <Sidebar
        filters={filters}
        onToggle={toggle}
        filterGroups={filterGroups}
        addLabel="+ Додати тварину"
        onAdd={onLoginRequest}
      />
      <div className="main">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Пошук за ім'ям..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
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
                />
              ))
          }
        </div>
      </div>
    </div>
  );
};