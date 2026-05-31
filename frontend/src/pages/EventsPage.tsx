import { useState, useMemo } from 'react';
import { RoleGuard } from '../components/RoleGuard';
import { Sidebar } from '../components/Sidebar';

const MOCK_EVENTS = [
  { id: 1, title: 'День усиновлення', date: '15 червня 2025', org: 'Притулок Лапки', city: 'Київ', type: 'Усиновлення', description: 'Приходьте знайти свого улюбленця!' },
  { id: 2, title: 'Збір корму для притулку', date: '20 червня 2025', org: 'Ноїв Ківчег', city: 'Львів', type: 'Збір', description: 'Допоможіть зібрати корм для безпритульних тварин.' },
  { id: 3, title: 'Виставка тварин', date: '5 липня 2025', org: 'Добрі руки', city: 'Харків', type: 'Виставка', description: 'Виставка та майстер-класи для власників домашніх тварин.' },
  { id: 4, title: 'Вакцинація безкоштовна', date: '10 липня 2025', org: 'Вет клініка Айболить', city: 'Київ', type: 'Медицина', description: 'Безкоштовна вакцинація для домашніх тварин.' },
];

const FILTERS = [
  { key: 'city', label: 'Місто', opts: [{ v:'Київ', l:'Київ' }, { v:'Львів', l:'Львів' }, { v:'Харків', l:'Харків' }] },
  { key: 'type', label: 'Тип',   opts: [{ v:'Усиновлення', l:'🐾 Усиновлення' }, { v:'Збір', l:'📦 Збір' }, { v:'Виставка', l:'🏆 Виставка' }, { v:'Медицина', l:'💉 Медицина' }] },
];

type Props = { onLoginRequest: () => void };

export const EventsPage = ({ onLoginRequest }: Props) => {
  const [search, setSearch]   = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const toggle = (key: string, value: string) =>
    setFilters(prev =>
      prev[key] === value
        ? Object.fromEntries(Object.entries(prev).filter(([k]) => k !== key))
        : { ...prev, [key]: value }
    );

  const visible = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_EVENTS.filter(ev => {
      if (q && !ev.title.toLowerCase().includes(q) && !ev.org.toLowerCase().includes(q)) return false;
      return Object.entries(filters).every(([k, v]) => !v || (ev as Record<string,unknown>)[k] === v);
    });
  }, [search, filters]);

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
          <input type="text" placeholder="Пошук подій..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="feed">
          {visible.length === 0
            ? <div className="empty"> Подій не знайдено</div>
            : visible.map(ev => (
              <div key={ev.id} className="card">
                <div className="card-avatar" style={{ fontSize: 28 }}>
                  {}
                </div>
                <div className="card-body">
                  <div className="card-title">{ev.title}</div>
                  <div className="card-sub">{ev.org} · {ev.city}</div>
                  <div className="badges">
                    <span className="badge">{ev.date}</span>
                    <span className="badge">{ev.type}</span>
                  </div>
                  <div className="card-fields">
                    <div className="card-field"><span>Опис</span>{ev.description}</div>
                  </div>
                  <div className="card-actions">
                    <RoleGuard requireAuth
                      fallback={
                        <button className="btn-primary" onClick={onLoginRequest}>
                          Увійти щоб записатись
                        </button>
                      }
                    >
                      <button className="btn-primary" onClick={() => alert('TODO: register')}>
                        Записатись
                      </button>
                    </RoleGuard>
                    <button className="btn-ghost" onClick={() => alert('TODO: share')}>Поділитись</button>
                    <RoleGuard roles={['MODERATOR', 'ADMIN', 'SHELTER']}>
                      <button className="btn-ghost" onClick={() => alert('TODO: edit')}>✏️ Редагувати</button>
                    </RoleGuard>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};