import {useState, useMemo, useEffect} from 'react';
import type { Organization } from '../types';
import { useFetch } from '../api/fetch';
import { OrgCard } from '../components/orgCard';
import { Sidebar } from '../components/Sidebar';
import {ShelterDetail} from "../components/shelterDetail.tsx";
import {useLocation} from "react-router-dom";

// const FILTERS = [
//   { key: 'type', label: 'Тип',   opts: [{ v: 'Притулок', l: '🏠 Притулок' }, { v: 'Клініка', l: '🏥 Клініка' }, { v: 'Фонд', l: '❤️ Фонд' }] },
//   { key: 'city', label: 'Місто', opts: [{ v: 'Київ', l: 'Київ' }, { v: 'Львів', l: 'Львів' }, { v: 'Харків', l: 'Харків' }] },
// ];

type Props = { onLoginRequest: () => void };

export const SheltersPage = ({ onLoginRequest}: Props) => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Organization | null>(null);

  const location = useLocation();

  useEffect(() => {
    const state = location.state as { shelterId?: number } | null;
    if (state?.shelterId) {
      fetch(`/api/shelters/${state.shelterId}`)
          .then(r => r.json())
          .then(data => setSelected(data));
    } else {
      setSelected(null);
    }
  }, [location]);

  const toggle = (key: string, value: string) =>
    setFilters(prev =>
      prev[key] === value
        ? Object.fromEntries(Object.entries(prev).filter(([k]) => k !== key))
        : { ...prev, [key]: value }
    );

  const query = new URLSearchParams(filters).toString();
  const url   = '/api/shelters' + (query ? '?' + query : '');

  const { data: shelters, loading, error } = useFetch<Organization>(url);
  //const { data: orgs, loading, error } = useFetch<Organization>(null, MOCK_ORGS);

  const { data: allShelters } = useFetch<Organization>('/api/shelters');

  const visible = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return shelters;
    return shelters.filter(s => s.name?.toLowerCase().includes(q));
  }, [shelters, search]);

  const cities = useMemo(() => {
    const unique = new Set(shelters.map(s => s.city).filter(Boolean));
    return Array.from(unique) as string[];
  }, [allShelters]);

  const filterGroups = [
    {
      key: 'city',
      label: 'Місто',
      opts: cities.map(c => ({ v: c, l: c })),
    },
  ];

  if(selected){
    return(
        <ShelterDetail
          org = {selected}
          onBack = {()=>setSelected(null)}
          onLoginRequest = {onLoginRequest}
        />
    )
  }

  return (
    <div className="body">
      <Sidebar
        filters={filters}
        onToggle={toggle}
        filterGroups={filterGroups}
        addLabel="+ Додати організацію"
        onAdd={onLoginRequest}
      />
      <div className="main">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Пошук за назвою..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="feed">
          {loading  ? <div className="empty">Завантаження...</div>
          : error   ? <div className="empty">Помилка: {error}</div>
          : visible.length === 0 ? <div className="empty">Організацій не знайдено</div>
          : visible.map(o => <OrgCard key={o.id} org={o} onClick = {()=>setSelected(o)} />)
          }
        </div>
      </div>
    </div>
  );
};