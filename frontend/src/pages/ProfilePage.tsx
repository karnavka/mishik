import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../api/useAuth';
import { logout } from '../utils/auth';
import { notifyAuthChange } from '../api/useAuth';
import { authFetch } from '../utils/api';
import { AnimalCard } from '../components/animalCard';
import { inp, section, fieldRow, lbl, STATUS } from '../utils/Profilestyles';
import type { StatusKey } from '../utils/Profilestyles';
import { FormField, FTextarea } from '../components/FormField';
import { AnimalForm, EMPTY_ANIMAL_FORM } from '../components/AnimalForm';
import type { AnimalFormState } from '../components/AnimalForm';
import { UserProfileForm }    from '../components/UserProfileForm';
import type { UserProfileFormState } from '../components/UserProfileForm';
import { ShelterProfileForm } from '../components/ShelterProfileForm';
import type { ShelterProfileFormState } from '../components/ShelterProfileForm';

// ── Types ──────────────────────────────────────────────────────────────────
type UserInfo = {
  id: number; firstName: string; lastName: string;
  patronymic: string; sex: string; login: string;
  phoneNumber?: string; phoneVerified?: boolean;
};
type ShelterInfo = {
  id: number; name: string; phoneNumber: string;
  adoptionConditions: string; login: string;
  city?: string; region?: string;
  socialLinks?: string; phoneVerified?: boolean;
};
type Animal = {
  id: number; name: string; age: number; height: number;
  sex: string; description: string; animalType: string;
  shelterName?: string;
};
type Request = {
  userId: number; userLogin: string;
  animalId: number; animalName: string;
  status: string; createdDate: string;
};
type FavAnimal = {
  id: number; name: string; animalType: string; shelterId: number;
  sex: string; age?: number; description?: string; shelterName?: string;
};

// ── Shared small UI ────────────────────────────────────────────────────────
const PhoneBadge = ({ verified }: { verified?: boolean }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600,
    background: verified ? '#27ae6022' : '#f39c1222',
    color: verified ? '#27ae60' : '#f39c12',
  }}>
    {verified ? '✓ Підтверджено' : '⚠ Не підтверджено'}
  </span>
);

const PhoneRequiredNotice = ({ message }: { message: string }) => (
  <div style={{
    padding: '12px 16px', borderRadius: 10, background: '#f39c1215',
    border: '1px solid #f39c1240', display: 'flex', alignItems: 'center', gap: 10,
  }}>
    <span style={{ fontSize: 20 }}>📱</span>
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#f39c12' }}>Потрібен телефон</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{message}</div>
    </div>
  </div>
);

const Grid2 = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
    {children}
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const s = STATUS[status as StatusKey];
  if (!s) return <span>{status}</span>;
  return (
    <span style={{
      fontSize: 12, padding: '3px 12px', borderRadius: 20, fontWeight: 600,
      background: s.color + '22', color: s.color,
    }}>{s.label}</span>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// USER TABS
// ══════════════════════════════════════════════════════════════════════════
const UserInfoTab = () => {
  const [info, setInfo] = useState<UserInfo | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<UserProfileFormState>({
    firstName: '', lastName: '', patronymic: '', phoneNumber: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    authFetch('http://localhost:8080/users/api/me')
      .then(r => r.json()).then(setInfo).catch(() => {});
  }, []);

  const startEdit = () => {
    if (!info) return;
    setForm({
      firstName:   info.firstName   ?? '',
      lastName:    info.lastName    ?? '',
      patronymic:  info.patronymic  ?? '',
      phoneNumber: info.phoneNumber ?? '',
    });
    setEditing(true);
  };

  const save = async () => {
    await authFetch('http://localhost:8080/users/me', { method: 'PUT', body: JSON.stringify(form) });
    setInfo(prev => prev
      ? { ...prev, ...form, phoneVerified: form.phoneNumber !== prev.phoneNumber ? false : prev.phoneVerified }
      : prev);
    setEditing(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!info) return <div style={{ color: 'var(--text-muted)', fontSize: 14, padding: 20, textAlign: 'center' }}>Завантаження...</div>;

  const hasPhone = !!info.phoneNumber;

  if (editing)
    return (
      <UserProfileForm
        form={form} setForm={setForm}
        onSave={save} onCancel={() => setEditing(false)}
      />
    );

  return (
    <div style={section}>
      {!hasPhone  && <PhoneRequiredNotice message="Для подачі заявок на усиновлення необхідно вказати та підтвердити номер телефону." />}
      {hasPhone && !info.phoneVerified && <PhoneRequiredNotice message="Номер телефону вказано, але ще не підтверджено. Заявки на усиновлення недоступні до підтвердження." />}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FormField label="Логін" disabled value={info.login} />
        <FormField label="Стать" disabled
          value={info.sex === 'MALE' ? '♂ Чоловіча' : info.sex === 'FEMALE' ? '♀ Жіноча' : '—'} />
      </div>

      <FormField label="Повне ім'я" disabled
        value={[info.firstName, info.lastName, info.patronymic].filter(Boolean).join(' ') || '—'} />

      <FormField
        label="Номер телефону"
        disabled value={info.phoneNumber || '—'}
        headerRight={hasPhone ? <PhoneBadge verified={info.phoneVerified} /> : undefined}
      />

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button className="btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={startEdit}>
          ✏️ Редагувати профіль
        </button>
        {saved && <span style={{ color: '#27ae60', fontSize: 13 }}>✓ Збережено</span>}
      </div>
    </div>
  );
};

const MOCK_FAV_ANIMALS: FavAnimal[] = [
  { id: 1, name: 'Барсик', animalType: 'Кіт', shelterId: 1, sex: 'MALE', age: 2, description: 'Дружелюбний котик', shelterName: 'Притулок №1' },
  { id: 2, name: 'Рекс',   animalType: 'Пес', shelterId: 2, sex: 'MALE', age: 4, description: 'Активний пес',      shelterName: 'Притулок №2' },
];

const UserFavoritesTab = ({ favorites, onToggleFavorite }: {
  favorites: Set<number>;
  onToggleFavorite: (id: number) => void;
}) => {
  const favAnimals = MOCK_FAV_ANIMALS.filter(a => favorites.has(a.id));

  if (favAnimals.length === 0)
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>♡</div>
        <div style={{ fontSize: 15, fontWeight: 500 }}>Немає уподобаних тварин</div>
        <div style={{ fontSize: 13, marginTop: 6 }}>Натисніть ♡ на картці тварини, щоб зберегти</div>
      </div>
    );

  return (
    <Grid2>
      {favAnimals.map(a => (
        <AnimalCard key={a.id} animal={a as any} isFavorited onToggleFavorite={onToggleFavorite} />
      ))}
    </Grid2>
  );
};

const UserRequestsTab = () => {
  const [requests, setRequests] = useState<Request[]>([
    { userId: 1, userLogin: 'me', animalId: 3, animalName: 'Сніжинка', status: 'PENDING',  createdDate: '2025-06-01' },
    { userId: 1, userLogin: 'me', animalId: 4, animalName: 'Бублик',   status: 'APPROVED', createdDate: '2025-05-20' },
    { userId: 1, userLogin: 'me', animalId: 5, animalName: 'Пуговка',  status: 'REJECTED', createdDate: '2025-05-10' },
  ]);

  if (requests.length === 0)
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
        <div style={{ fontSize: 15, fontWeight: 500 }}>Немає активних заявок</div>
      </div>
    );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {requests.map(r => (
        <div key={r.animalId} style={{
          padding: '14px 18px', borderRadius: 12,
          border: '1px solid var(--border)', background: 'var(--surface)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>🐾 {r.animalName}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
              Подано: {new Date(r.createdDate).toLocaleDateString('uk-UA')}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <StatusBadge status={r.status} />
            {r.status === 'PENDING' && (
              <button className="btn-ghost" style={{ color: '#e74c3c', borderColor: '#e74c3c', fontSize: 12 }}
                onClick={() => setRequests(prev => prev.filter(x => x.animalId !== r.animalId))}>✕</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SHELTER TABS
// ══════════════════════════════════════════════════════════════════════════
const ShelterInfoTab = () => {
  const [info, setInfo] = useState<ShelterInfo | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ShelterProfileFormState>({
    name: '', phoneNumber: '', adoptionConditions: '', socialLinks: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    authFetch('http://localhost:8080/api/shelters/me')
      .then(r => r.json()).then(setInfo).catch(() => {});
  }, []);

  const startEdit = () => {
    if (!info) return;
    setForm({
      name:               info.name               ?? '',
      phoneNumber:        info.phoneNumber        ?? '',
      adoptionConditions: info.adoptionConditions ?? '',
      socialLinks:        info.socialLinks        ?? '',
    });
    setEditing(true);
  };

  const save = async () => {
    await authFetch('http://localhost:8080/api/shelters/me', { method: 'PUT', body: JSON.stringify(form) });
    setInfo(prev => prev ? { ...prev, ...form } : prev);
    setEditing(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!info) return <div style={{ color: 'var(--text-muted)', fontSize: 14, padding: 20, textAlign: 'center' }}>Завантаження...</div>;

  const hasPhone = !!info.phoneNumber;

  if (editing)
    return (
      <ShelterProfileForm
        form={form} setForm={setForm}
        onSave={save} onCancel={() => setEditing(false)}
      />
    );

  return (
    <div style={section}>
      {!hasPhone && <PhoneRequiredNotice message="Для додавання тварин у базу необхідно вказати номер телефону притулку." />}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FormField label="Логін" disabled value={info.login} />
        {info.city && (
          <FormField label="Розташування" disabled value={[info.city, info.region].filter(Boolean).join(', ')} />
        )}
      </div>

      <FormField label="Назва" disabled value={info.name ?? '—'} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FormField
          label="Телефон" disabled value={info.phoneNumber || '—'}
          headerRight={hasPhone ? <PhoneBadge verified={info.phoneVerified} /> : undefined}
        />
        <FormField label="Соц. мережі" disabled value={info.socialLinks || '—'} />
      </div>

      <div style={fieldRow}>
        <span style={lbl}>Умови усиновлення</span>
        <FTextarea value={info.adoptionConditions ?? '—'} disabled minHeight={80} resize="none" />
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button className="btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={startEdit}>
          ✏️ Редагувати профіль
        </button>
        {saved && <span style={{ color: '#27ae60', fontSize: 13 }}>✓ Збережено</span>}
      </div>
    </div>
  );
};

const ShelterRequestsTab = () => {
  const [requests, setRequests] = useState<Request[]>([
    { userId: 5, userLogin: 'ivan_k',  animalId: 1, animalName: 'Барсик', status: 'PENDING',  createdDate: '2025-06-03' },
    { userId: 6, userLogin: 'olena_m', animalId: 2, animalName: 'Рекс',   status: 'PENDING',  createdDate: '2025-06-05' },
    { userId: 7, userLogin: 'petro_v', animalId: 3, animalName: 'Муся',   status: 'APPROVED', createdDate: '2025-06-01' },
  ]);

  const updateStatus = (animalId: number, userId: number, status: string) =>
    setRequests(r => r.map(x => x.animalId === animalId && x.userId === userId ? { ...x, status } : x));

  const pending  = requests.filter(r => r.status === 'PENDING');
  const resolved = requests.filter(r => r.status !== 'PENDING');

  if (requests.length === 0)
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
        <div style={{ fontSize: 15, fontWeight: 500 }}>Немає заявок</div>
      </div>
    );

  const RequestCard = ({ r }: { r: Request }) => (
    <div style={{ padding: '14px 18px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: r.status === 'PENDING' ? 12 : 0 }}>
        <div>
          <div style={{ fontWeight: 500, fontSize: 14 }}>🐾 {r.animalName}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
            👤 {r.userLogin} · {new Date(r.createdDate).toLocaleDateString('uk-UA')}
          </div>
        </div>
        <StatusBadge status={r.status} />
      </div>
      {r.status === 'PENDING' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-primary" style={{ background: '#27ae60', borderColor: '#27ae60', fontSize: 12 }}
            onClick={() => updateStatus(r.animalId, r.userId, 'APPROVED')}>✓ Схвалити</button>
          <button className="btn-ghost" style={{ color: '#e74c3c', borderColor: '#e74c3c', fontSize: 12 }}
            onClick={() => updateStatus(r.animalId, r.userId, 'REJECTED')}>✕ Відхилити</button>
        </div>
      )}
    </div>
  );

  const SectionGroup = ({ title, items }: { title: string; items: Request[] }) =>
    items.length === 0 ? null : (
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 10 }}>
          {title}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(r => <RequestCard key={`${r.animalId}-${r.userId}`} r={r} />)}
        </div>
      </div>
    );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionGroup title={`Нові заявки (${pending.length})`} items={pending} />
      <SectionGroup title="Опрацьовані" items={resolved} />
    </div>
  );
};

const ShelterAnimalsTab = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editForm, setEditForm] = useState<AnimalFormState>(EMPTY_ANIMAL_FORM);
  const [addForm,  setAddForm]  = useState<AnimalFormState>(EMPTY_ANIMAL_FORM);
  const [shelterHasPhone, setShelterHasPhone] = useState(true);

  useEffect(() => {
    authFetch('http://localhost:8080/api/shelters/me')
      .then(r => r.json()).then(s => setShelterHasPhone(!!s.phoneNumber)).catch(() => {});
    authFetch('http://localhost:8080/api/shelters/me/animals')
      .then(r => r.json()).then(setAnimals).catch(() => {
        setAnimals([
          { id: 1, name: 'Барсик', age: 2, height: 30, sex: 'MALE', description: 'Дружелюбний', animalType: 'Кіт' },
          { id: 2, name: 'Рекс',   age: 4, height: 60, sex: 'MALE', description: 'Активний',    animalType: 'Пес' },
        ]);
      });
  }, []);

  const startEdit = (a: Animal) => {
    setEditingId(a.id);
    setEditForm({ name: a.name, age: a.age, height: a.height, description: a.description ?? '', sex: a.sex, animalType: a.animalType });
  };

  const saveEdit = async (id: number) => {
    await authFetch(`http://localhost:8080/api/shelters/me/${id}`, { method: 'PUT', body: JSON.stringify(editForm) });
    setAnimals(list => list.map(a => a.id === id ? { ...a, ...editForm } : a));
    setEditingId(null);
  };

  const remove = async (id: number) => {
    if (!confirm('Видалити тварину?')) return;
    await authFetch(`http://localhost:8080/api/shelters/me/${id}`, { method: 'DELETE' });
    setAnimals(list => list.filter(a => a.id !== id));
  };

  const addAnimal = async () => {
    const res  = await authFetch('http://localhost:8080/api/shelters/me/animals', { method: 'POST', body: JSON.stringify(addForm) });
    const data = await res.json();
    if (data.animal) {
      setAnimals(list => [...list, data.animal]);
      setShowAddForm(false);
      setAddForm(EMPTY_ANIMAL_FORM);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {!shelterHasPhone && <PhoneRequiredNotice message="Вкажіть номер телефону у вкладці «Про притулок» перед тим, як додавати тварин." />}

      {shelterHasPhone && !showAddForm && (
        <button className="btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => setShowAddForm(true)}>
          ➕ Додати тварину
        </button>
      )}

      {showAddForm && (
        <AnimalForm form={addForm} setForm={setAddForm} onSave={addAnimal} onCancel={() => setShowAddForm(false)} />
      )}

      {animals.length === 0 && !showAddForm && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🐾</div>
          <div style={{ fontSize: 15, fontWeight: 500 }}>Немає тварин у притулку</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Натисніть «Додати тварину», щоб розпочати</div>
        </div>
      )}

      <Grid2>
        {animals.map(a => (
          editingId === a.id ? (
            <AnimalForm key={a.id} id={a.id} form={editForm} setForm={setEditForm}
              onSave={() => saveEdit(a.id)} onCancel={() => setEditingId(null)} />
          ) : (
            <div key={a.id} style={{ position: 'relative' }}>
              <AnimalCard animal={a as any} />
              <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 4 }}>
                <button className="btn-ghost" style={{ fontSize: 11, padding: '3px 8px' }} onClick={() => startEdit(a)}>✏️</button>
                <button className="btn-ghost" style={{ color: '#e74c3c', borderColor: '#e74c3c', fontSize: 11, padding: '3px 8px' }}
                  onClick={() => remove(a.id)}>✕</button>
              </div>
            </div>
          )
        ))}
      </Grid2>
    </div>
  );
};

// ── Role config ────────────────────────────────────────────────────────────
const ROLE_META: Record<string, { text: string; color: string }> = {
  ROLE_ADMIN: { text: '👑 Адміністратор', color: '#9b59b6' },
  MODERATOR:  { text: '🛡️ Модератор',     color: '#3498db' },
  SHELTER:    { text: '🏠 Притулок',       color: '#27ae60' },
  USER:       { text: '👤 Користувач',     color: '#7f8c8d' },
};

// ══════════════════════════════════════════════════════════════════════════
// MAIN ProfilePage
// ══════════════════════════════════════════════════════════════════════════
export const ProfilePage = () => {
  const { loggedIn, role } = useAuth();
  const [tab, setTab] = useState(0);
  const [favorites, setFavorites] = useState<Set<number>>(new Set([1, 2]));

  const toggleFavorite = (id: number) =>
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  if (!loggedIn) return <Navigate to="/" replace />;

  const handleLogout = () => { logout(); notifyAuthChange(); };

  const isShelter = role === 'ROLE_SHELTER';
  const tabs = isShelter
    ? [{ label: 'Про притулок', icon: '🏠' }, { label: 'Заявки', icon: '📬' }, { label: 'Тварини', icon: '🐾' }]
    : [{ label: 'Про мене', icon: '👤' }, { label: 'Уподобані', icon: '♡' }, { label: 'Мої заявки', icon: '📋' }];

  const rl = role ? ROLE_META[role] : null;

  return (
    <div style={{ minHeight: '100vh', padding: '32px 24px', boxSizing: 'border-box', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        <div className="header" style={{ justifyContent: 'space-between', marginBottom: 28, borderRadius: 12, position: 'static' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="logo" style={{ fontSize: 18 }}>{isShelter ? '🏠' : '👤'}</span>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Особистий кабінет</span>
            {rl && (
              <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 12, fontWeight: 600, background: rl.color + '22', color: rl.color }}>
                {rl.text}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {tabs.map((t, i) => (
              <button key={t.label} onClick={() => setTab(i)} className={'tab-btn' + (tab === i ? ' active' : '')}>
                <span style={{ marginRight: 5 }}>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>

          <button className="tab-btn" style={{ color: '#e74c3c' }} onClick={handleLogout}>Вийти</button>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 28, border: '1px solid var(--border)', minHeight: 300 }}>
          {!isShelter && tab === 0 && <UserInfoTab />}
          {!isShelter && tab === 1 && <UserFavoritesTab favorites={favorites} onToggleFavorite={toggleFavorite} />}
          {!isShelter && tab === 2 && <UserRequestsTab />}
          {isShelter  && tab === 0 && <ShelterInfoTab />}
          {isShelter  && tab === 1 && <ShelterRequestsTab />}
          {isShelter  && tab === 2 && <ShelterAnimalsTab />}
        </div>
      </div>
    </div>
  );
};