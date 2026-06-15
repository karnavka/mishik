import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../api/useAuth';
import { logout } from '../utils/auth';
import { notifyAuthChange } from '../api/useAuth';
import { authFetch } from '../utils/api';
import { AnimalCard } from '../components/animalCard';
import { AnimalDetail } from '../components/animalDetail';
import { inp, section, fieldRow, lbl, STATUS } from '../utils/Profilestyles';
import type { StatusKey } from '../utils/Profilestyles';
import {FInput, FormField, FTextarea } from '../components/FormField';
import { AnimalForm, EMPTY_ANIMAL_FORM } from '../components/AnimalForm';
import type { AnimalFormState, AnimalTypeOption } from '../components/AnimalForm';
import { UserProfileForm }    from '../components/UserProfileForm';
import type { UserProfileFormState } from '../components/UserProfileForm';
import { ShelterProfileForm } from '../components/ShelterProfileForm';
import type { ShelterProfileFormState } from '../components/ShelterProfileForm';
import { useNavigate } from 'react-router-dom';

type UserInfo = {
  id: number; firstName: string; lastName: string;
  patronymic: string; sex: string; login: string;
  phoneNumber?: string; phoneVerified?: boolean;
};
type ShelterInfo = {
  id: number; name: string; phoneNumber: string;
  adoptionConditions: string; login: string;
  city?: string; region?: string; street?: string;
  instagram?: string; facebook?: string; telegram?: string;
  phoneVerified?: boolean;
};
type Animal = {
  id: number; name: string; age: number; height: number;
  sex: string; description: string; animalType: string;
  animalTypeId?: number; imageUrl?: string; shelterName?: string;
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
type Event = {
    id: number;
    name: string;
    description: string;
    dateOfEvent: string;
    city?: string;
    organizerName?: string;
};
const EMPTY_EVENT = {
    name: '',
    description: '',
    dateOfEvent: '',
};

const PhoneRequiredNotice = ({ message }: { message: string }) => (
  <div style={{
    padding: '12px 16px', borderRadius: 10, background: '#f39c1215',
    border: '1px solid #f39c1240', display: 'flex', alignItems: 'center', gap: 10,
  }}>
    <span style={{ fontSize: 25 }}>☏</span>
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#f39c12' }}>Потрібен телефон</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{message}</div>
    </div>
  </div>
);

const Grid2 = ({ children }: { children: React.ReactNode }) => (
    <div className="animal-grid">
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

const UserInfoTab = () => {
  const [info, setInfo] = useState<UserInfo | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<UserProfileFormState>({
    firstName: '', lastName: '', patronymic: '', sex: 'UNKNOWN', phoneNumber: '',
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
      sex:         (info.sex as any) ?? 'UNKNOWN',
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

  const sexLabel = info.sex === 'MALE' ? '♂ Чоловіча' : info.sex === 'FEMALE' ? '♀ Жіноча' : '—';

  return (
    <div style={section}>
      {!hasPhone && <PhoneRequiredNotice message="Для подачі заявок на усиновлення необхідно вказати та підтвердити номер телефону." />}

      {/* Row 1: login + sex */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FormField label="Логін" disabled value={info.login} />
        <FormField label="Стать" disabled value={sexLabel} />
      </div>

      {/* Row 2: first + last name */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FormField label="Ім'я" disabled value={info.firstName || '—'} />
        <FormField label="Прізвище" disabled value={info.lastName || '—'} />
      </div>

      {/* Patronymic */}
      <FormField label="По батькові" disabled value={info.patronymic || '—'} />

      {/* Phone */}
      <FormField label="Номер телефону" disabled value={info.phoneNumber || '—'} />

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button className="btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={startEdit}>⛏︎</button>
        {saved && <span style={{ color: '#27ae60', fontSize: 13 }}>✓ Збережено</span>}
      </div>
    </div>
  );
};

const UserRequestsTab = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    authFetch('http://localhost:8080/api/adoption-requests/my')
      .then(r => r.json())
      .then(data => setRequests(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cancelRequest = async (animalId: number) => {
    await authFetch(`http://localhost:8080/api/adoption-requests/${animalId}`, { method: 'DELETE' });
    setRequests(prev => prev.filter(x => x.animalId !== animalId));
  };

  if (loading)
    return <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>Завантаження...</div>;

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
            <button className="btn-ghost" style={{ fontSize: 12 }}
              onClick={() => navigate(`/requests/${r.animalId}/my`, { state: { request: r } })}>
              Деталі →
            </button>
            {r.status === 'PENDING' && (
              <button className="btn-ghost"
                style={{ color: '#e74c3c', borderColor: '#e74c3c', fontSize: 12 }}
                onClick={() => cancelRequest(r.animalId)}>✕</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const ShelterInfoTab = () => {
  const [info, setInfo] = useState<ShelterInfo | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ShelterProfileFormState>({
    name: '', phoneNumber: '', instagram: '', facebook: '', telegram: '',
    adoptionConditions: '',
    address: { city: '', region: '', street: '' },
  });
  const [saved, setSaved] = useState(false);

const parseSocialLinks = (raw: string | undefined) => {
  if (!raw) return { instagram: '', facebook: '', telegram: '' };
  const [instagram = '', facebook = '', telegram = ''] = raw.split('|');
  return { instagram, facebook, telegram };
};

useEffect(() => {
  authFetch('http://localhost:8080/api/shelters/me')
    .then(r => r.json())
    .then(data => {
      const socials = parseSocialLinks(data.socialLinks);
      setInfo({ ...data, ...socials });
    })
    .catch(() => {});
}, []);

  const startEdit = () => {
    if (!info) return;
    setForm({
      name:               info.name               ?? '',
      phoneNumber:        info.phoneNumber        ?? '',
      instagram:          info.instagram          ?? '',
      facebook:           info.facebook           ?? '',
      telegram:           info.telegram           ?? '',
      adoptionConditions: info.adoptionConditions ?? '',
      address: {
        city:   info.city   ?? '',
        region: info.region ?? '',
        street: info.street ?? '',
      },
    });
    setEditing(true);
  };

  const normalizeCity = (value: string) =>
      value.trim().toLowerCase().split(/\s+/)
          .map(
              word =>
                  word.charAt(0).toUpperCase() +
                  word.slice(1)
          )
          .join(' ');

  const save = async () => {
    const normalizedCity = normalizeCity(form.address.city);
    const payload = {
      ...form,
      address: {
        ...form.address,
        city: normalizedCity,
      },
      socialLinks: [form.instagram, form.facebook, form.telegram].join('|'),
    };
    await authFetch('http://localhost:8080/api/shelters/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    setInfo(prev => prev ? {
      ...prev,
      name:               form.name,
      phoneNumber:        form.phoneNumber,
      adoptionConditions: form.adoptionConditions,
      instagram:          form.instagram,
      facebook:           form.facebook,
      telegram:           form.telegram,
      city:               normalizeCity(form.address.city),
      region:             form.address.region,
      street:             form.address.street,
    } : prev);
    setEditing(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!info) return (
    <div style={{ color: 'var(--text-muted)', fontSize: 14, padding: 20, textAlign: 'center' }}>
      Завантаження...
    </div>
  );

  if (editing)
    return (
      <ShelterProfileForm
        form={form} setForm={setForm}
        onSave={save} onCancel={() => setEditing(false)}
      />
    );

  const hasPhone = !!info.phoneNumber;
  const addressDisplay = [info.street, info.city, info.region].filter(Boolean).join(', ');

  return (
    <div style={section}>
      {!hasPhone && (
        <PhoneRequiredNotice message="Для додавання тварин у базу необхідно вказати номер телефону притулку." />
      )}

      {/* Row 1: login + location */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FormField label="Логін" disabled value={info.login} />
      </div>

      <FormField label="Назва притулку" disabled value={info.name ?? '—'} />
      

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FormField label="Телефон" disabled value={info.phoneNumber || '—'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <FormField label="Instagram" disabled value={info.instagram || '—'} />
      <FormField label="Facebook"  disabled value={info.facebook  || '—'} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <FormField label="Telegram"  disabled value={info.telegram  || '—'} />
      </div>
      <FormField label="Адреса" disabled value={addressDisplay || '—'} />

      <div style={fieldRow}>
        <span style={lbl}>Умови усиновлення</span>
        <FTextarea value={info.adoptionConditions ?? '—'} disabled minHeight={80} resize="none" />
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button className="btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={startEdit}>⛏︎</button>
        {saved && <span style={{ color: '#27ae60', fontSize: 13 }}>✓ Збережено</span>}
      </div>
    </div>
  );
};

const ShelterRequestsTab = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch('http://localhost:8080/api/adoption-requests/shelter')
      .then(r => r.json())
      .then(data => {
        const mapped = data.map((item: any) => ({
          userId:      item.user.id,
          userLogin:   item.user.login,
          animalId:    item.animal.id,
          animalName:  item.animal.name,
          status:      item.status,
          createdDate: item.createdDate,
        }));
        setRequests(mapped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>Завантаження...</div>;

  if (requests.length === 0)
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
        <div style={{ fontSize: 15, fontWeight: 500 }}>Немає заявок</div>
      </div>
    );

  const pending  = requests.filter(r => r.status === 'PENDING');
  const resolved = requests.filter(r => r.status !== 'PENDING');

  const RequestCard = ({ r }: { r: Request }) => (
    <div style={{
      padding: '14px 18px', borderRadius: 12,
      border: '1px solid var(--border)', background: 'var(--surface)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div>
        <div style={{ fontWeight: 500, fontSize: 14 }}>🐾 {r.animalName}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
          👤 {r.userLogin} · {new Date(r.createdDate).toLocaleDateString('uk-UA')}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <StatusBadge status={r.status} />
        <button className="btn-ghost" style={{ fontSize: 12 }}
          onClick={() => navigate(`/requests/${r.animalId}/${r.userId}`, { state: { request: r } })}>
          Переглянути →
        </button>
      </div>
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
  const [animals, setAnimals]         = useState<Animal[]>([]);
  const [editingId, setEditingId]     = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editForm, setEditForm]       = useState<AnimalFormState>(EMPTY_ANIMAL_FORM);
  const [addForm,  setAddForm]        = useState<AnimalFormState>(EMPTY_ANIMAL_FORM);
  const [animalTypes, setAnimalTypes] = useState<AnimalTypeOption[]>([]);
  const [shelterHasPhone, setShelterHasPhone] = useState(true);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    Promise.all([
      authFetch('http://localhost:8080/api/shelters/me').then(r => r.json()),
      authFetch('http://localhost:8080/api/shelters/me/animals').then(r => r.json()),
      fetch('/api/animal-types').then(r => r.json()),
    ])
      .then(([shelter, animalList, typeList]) => {
        setShelterHasPhone(!!shelter.phoneNumber);
        setAnimals(Array.isArray(animalList) ? animalList : []);
        setAnimalTypes(Array.isArray(typeList) ? typeList : []);
      })
      .catch(() => { setShelterHasPhone(false); setAnimals([]); })
      .finally(() => setLoading(false));
  }, []);

  const toAnimalPayload = (form: AnimalFormState, animalTypeId: number) => ({
    name: form.name.trim(),
    age: Number(form.age),
    height: Number(form.height),
    sex: form.sex,
    description: form.description.trim(),
    imageUrl: form.imageUrl.trim() || null,
    animalTypeId,
  });

  const canSaveAnimal = (form: AnimalFormState) => {
    if (!form.name.trim() || !form.animalTypeId) {
      alert('Заповніть назву та тип тварини');
      return false;
    }

    if (form.animalTypeId === '__other__' && !form.animalTypeName.trim()) {
      alert('Вкажіть свій вид тварини');
      return false;
    }

    if(Number(form.age) < 0 || Number(form.height) < 0 ){
        alert('Не можна від\'ємні поля');
        return false;
    }

    return true;
  };

  const resolveAnimalTypeId = async (form: AnimalFormState) => {
    if (form.animalTypeId !== '__other__') {
      return Number(form.animalTypeId);
    }

    const type = form.animalTypeName.trim();
    const existing = animalTypes.find(t => t.type.toLowerCase() === type.toLowerCase());

    if (existing) {
      return existing.id;
    }

    const res = await authFetch('http://localhost:8080/api/animal-types', {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
    const created = await res.json();

    if (!res.ok) {
      throw new Error(created.message ?? 'Не вдалося додати вид тварини');
    }

    setAnimalTypes(prev => prev.some(t => t.id === created.id) ? prev : [...prev, created]);
    return Number(created.id);
  };

  const startEdit = (a: Animal) => {
    setEditingId(a.id);
    setEditForm({
      name: a.name,
      age: a.age,
      height: a.height,
      description: a.description ?? '',
      sex: a.sex,
      animalTypeId: a.animalTypeId ? String(a.animalTypeId) : '',
      animalTypeName: '',
      imageUrl: a.imageUrl ?? '',
    });
  };

  const saveEdit = async (id: number) => {
    if (!canSaveAnimal(editForm)) return;

    const animalTypeId = await resolveAnimalTypeId(editForm);
    const res = await authFetch(`http://localhost:8080/api/shelters/me/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toAnimalPayload(editForm, animalTypeId)),
    });
    const updated = await res.json();
    setAnimals(list => list.map(a => a.id === id ? { ...a, ...updated } : a));
    setEditingId(null);
  };

  const remove = async (id: number) => {
    if (!confirm('Видалити тварину?')) return;
    await authFetch(`http://localhost:8080/api/shelters/me/${id}`, { method: 'DELETE' });
    setAnimals(list => list.filter(a => a.id !== id));
  };

  const addAnimal = async () => {
    if (!canSaveAnimal(addForm)) return;

    const animalTypeId = await resolveAnimalTypeId(addForm);
    const res  = await authFetch('http://localhost:8080/api/shelters/me/animals', {
      method: 'POST',
      body: JSON.stringify(toAnimalPayload(addForm, animalTypeId)),
    });
    const data = await res.json();
    if (data.animal) {
      setAnimals(list => [...list, data.animal]);
      setShowAddForm(false);
      setAddForm({ ...EMPTY_ANIMAL_FORM });
    }
  };

  if (loading)
    return <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>Завантаження...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {!shelterHasPhone && (
        <PhoneRequiredNotice message="Вкажіть номер телефону у вкладці «Про притулок» перед тим, як додавати тварин." />
      )}
      {shelterHasPhone && !showAddForm && (
        <button className="btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => setShowAddForm(true)}>
          ➕ Додати тварину
        </button>
      )}
      {showAddForm && (
        <AnimalForm
          form={addForm}
          setForm={setAddForm}
          animalTypes={animalTypes}
          onSave={addAnimal}
          onCancel={() => setShowAddForm(false)}
        />
      )}
      {animals.length === 0 && !showAddForm && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🐾</div>
          <div style={{ fontSize: 15, fontWeight: 500 }}>Немає тварин у притулку</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Натисніть «Додати тварину», щоб розпочати</div>
        </div>
      )}
      <Grid2>
        {animals.map(a =>
          editingId === a.id ? (
            <AnimalForm key={a.id} id={a.id} form={editForm} setForm={setEditForm}
              animalTypes={animalTypes}
              onSave={() => saveEdit(a.id)} onCancel={() => setEditingId(null)} />
          ) : (
            <AnimalCard
              key={a.id}
              animal={a as any}
              shelterMode
              onEdit={() => startEdit(a)}
              onDelete={() => remove(a.id)}
            />
          )
        )}
      </Grid2>
    </div>
  );
};

const UserFavoritesTab = ({ favAnimals, favorites, onToggleFavorite, loading, onLoginRequest }: {
  favAnimals: FavAnimal[];
  favorites: Set<number>;
  onToggleFavorite: (id: number) => void;
  loading: boolean;
  onLoginRequest: () => void;
}) => {
  const [selected, setSelected] = useState<FavAnimal | null>(null);

  if (loading)
    return <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>Завантаження...</div>;

  if (favAnimals.length === 0)
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>♡</div>
        <div style={{ fontSize: 15, fontWeight: 500 }}>Немає уподобаних тварин</div>
        <div style={{ fontSize: 13, marginTop: 6 }}>Натисніть ♡ на картці тварини, щоб зберегти</div>
      </div>
    );

  if (selected) {
    return (
      <AnimalDetail
        animal={selected as any}
        onBack={() => setSelected(null)}
        onLoginRequest={onLoginRequest}
        isFavorited={favorites.has(selected.id)}
        onToggleFavorite={onToggleFavorite}
      />
    );
  }

  return (
    <Grid2>
      {favAnimals.map(a => (
        <AnimalCard
          key={a.id}
          animal={a as any}
          onClick={() => setSelected(a)}
          isFavorited={favorites.has(a.id)}
          onToggleFavorite={onToggleFavorite}
          onLoginRequest={onLoginRequest}
        />
      ))}
    </Grid2>
  );
};
const ShelterEventsTab = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [showAdd, setShowAdd] = useState(false);

   const [form, setForm] = useState({
    name: '',
    description: '',
    dateOfEvent: '',
    city: '',
    region: '',
    street: '',
});

    useEffect(() => {
        authFetch('http://localhost:8080/api/volunteering/me')
            .then(r => r.json())
            .then(data => setEvents(Array.isArray(data) ? data : []))
            .catch(() => {});
    }, []);

    const addEvent = async () => {
        const payload = {
            name: form.name,
            description: form.description,
            dateOfEvent: form.dateOfEvent,
            address: {
                city: form.city,
                region: form.region,
                street: form.street,
            },
        };

        const res = await authFetch(
            'http://localhost:8080/api/volunteering',
            {
                method: 'POST',
                body: JSON.stringify(payload),
            }
        );

        const data = await res.json();

        if (data.event) {
            setEvents(prev => [...prev, data.event]);

            setForm({
                name: '',
                description: '',
                dateOfEvent: '',
                city: '',
                region: '',
                street: '',
            });

            setShowAdd(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {!showAdd && (
                <button
                    className="btn-primary"
                    style={{ alignSelf: 'flex-start' }}
                    onClick={() => setShowAdd(true)}
                >
                    ➕ Додати подію
                </button>
            )}

            {showAdd && (
                <div style={section}>
                    <div style={fieldRow}>
                        <span style={lbl}>Назва</span>
                        <FInput
                            value={form.name}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div style={fieldRow}>
                        <span style={lbl}>Дата</span>
                        <FInput
                            type = 'date'
                            value={form.dateOfEvent}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    dateOfEvent: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div style={fieldRow}>
                        <span style={lbl}>Місто</span>
                        <FInput
                            value={form.city}
                            onChange={e =>
                                setForm({ ...form, city: e.target.value })
                            }
                        />
                    </div>

                    <div style={fieldRow}>
                        <span style={lbl}>Область</span>
                        <FInput
                            value={form.region}
                            onChange={e =>
                                setForm({ ...form, region: e.target.value })
                            }
                        />
                    </div>

                    <div style={fieldRow}>
                        <span style={lbl}>Вулиця</span>
                        <FInput
                            value={form.street}
                            onChange={e =>
                                setForm({ ...form, street: e.target.value })
                            }
                        />
                    </div>

                    <div style={fieldRow}>
                        <span style={lbl}>Опис</span>
                        <FTextarea
                            value={form.description}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            className="btn-primary"
                            onClick={addEvent}
                        >
                            Зберегти
                        </button>

                        <button
                            className="btn-ghost"
                            onClick={() => setShowAdd(false)}
                        >
                            Скасувати
                        </button>
                    </div>
                </div>
            )}

            {events.length === 0 && !showAdd && (
                <div
                    style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: 'var(--text-muted)',
                    }}
                >
                    Немає створених подій
                </div>
            )}

            <Grid2>
                {events.map(ev => (
                    <div
                        key={ev.id}
                        style={{
                            border: '1px solid var(--border)',
                            borderRadius: 12,
                            padding: 16,
                            background: 'var(--surface)',
                        }}
                    >
                        <div
                            style={{
                                fontWeight: 600,
                                marginBottom: 8,
                            }}
                        >
                            📅 {ev.name}
                        </div>

                        <div
                            style={{
                                fontSize: 13,
                                color: 'var(--text-muted)',
                                marginBottom: 8,
                            }}
                        >
                            {new Date(ev.dateOfEvent).toLocaleDateString('uk-UA')}
                        </div>

                        <div>{ev.description}</div>
                    </div>
                ))}
            </Grid2>
        </div>
    );
};
const ROLE_META: Record<string, { text: string; color: string }> = {
  ROLE_ADMIN: { text: '👑 Адміністратор', color: '#9b59b6' },
  MODERATOR:  { text: '🛡️ Модератор',     color: '#3498db' },
  SHELTER:    { text: '🏠 Притулок',       color: '#27ae60' },
  USER:       { text: '👤 Користувач',     color: '#7f8c8d' },
};

export const ProfilePage = () => {
  const location = useLocation();

  const navState = location.state as { tab?: number } | null;
  const [tab, setTab] = useState(navState?.tab ?? 0);

  useEffect(() => {
    if (navState?.tab !== undefined) setTab(navState.tab);
  }, [navState?.tab]);

  const [favorites, setFavorites]   = useState<Set<number>>(new Set());
  const [favAnimals, setFavAnimals] = useState<FavAnimal[]>([]);
  const [favLoading, setFavLoading] = useState(true);
  const { loggedIn, role, isUser } = useAuth();
  useEffect(() => {
  if (!isUser) return;
   authFetch('http://localhost:8080/api/favorites')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFavAnimals(data);
          setFavorites(new Set(data.map((a: FavAnimal) => a.id)));
        }
      })
      .catch(() => {})
      .finally(() => setFavLoading(false));
  }, [isUser]);

  const toggleFavorite = async (id: number) => {
    const isFav = favorites.has(id);
    setFavorites(prev => {
      const next = new Set(prev);
      isFav ? next.delete(id) : next.add(id);
      return next;
    });
    if (isFav) setFavAnimals(prev => prev.filter(a => a.id !== id));

    try {
      await authFetch(`http://localhost:8080/api/favorites/${id}`, {
        method: isFav ? 'DELETE' : 'POST',
      });
      if (!isFav) {
        const fresh = await authFetch('http://localhost:8080/api/favorites').then(r => r.json());
        if (Array.isArray(fresh)) {
          setFavAnimals(fresh);
          setFavorites(new Set(fresh.map((a: FavAnimal) => a.id)));
        }
      }
    } catch {
      setFavorites(prev => {
        const next = new Set(prev);
        isFav ? next.add(id) : next.delete(id);
        return next;
      });
      if (isFav) {
        authFetch('http://localhost:8080/api/favorites')
          .then(r => r.json())
          .then(data => Array.isArray(data) && setFavAnimals(data))
          .catch(() => {});
      }
    }
  };

  if (!loggedIn) return <Navigate to="/" replace />;

  const handleLogout = () => { logout(); notifyAuthChange(); };

  const isShelter = role === 'ROLE_SHELTER';
  const tabs = isShelter
    ? [{ label: 'Про притулок', icon: '' }, { label: 'Заявки', icon: '' }, { label: 'Тварини', icon: '' }, { label: 'Мої події', icon: '' }]
    : [{ label: 'Про мене', icon: '' }, { label: 'Уподобані', icon: '' }, { label: 'Мої заявки', icon: '' },  { label: 'Мої події', icon: '' }] ;

  const rl = role ? ROLE_META[role] : null;

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg)', overflow: 'hidden',
      padding: '32px 24px', boxSizing: 'border-box',
    }}>
      <div style={{
        maxWidth: 900, width: '100%', margin: '0 auto',
        display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden',
      }}>
        <div className="header" style={{
          justifyContent: 'space-between', marginBottom: 28,
          borderRadius: 12, flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/*<span className="logo" style={{ fontSize: 18 }}>{isShelter ? '🏠' : '👤'}</span>*/}
            <span style={{ fontWeight: 700, fontSize: 16, padding: '10px 10px 16px 10px'}}>Особистий кабінет</span>
            {rl && (
              <span style={{
                fontSize: 11, padding: '2px 10px', borderRadius: 12, fontWeight: 600,
                background: rl.color + '22', color: rl.color,
              }}>{rl.text}</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {tabs.map((t, i) => (
              <button key={t.label} onClick={() => setTab(i)}
                className={'tab-btn' + (tab === i ? ' active' : '')}>
                <span style={{ marginRight: 5 }}>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>

          {/*<button className="tab-btn" style={{ color: '#e74c3c' }} onClick={handleLogout}>*/}
          {/*  Вийти*/}
          {/*</button>*/}
        </div>

      {/* Скролиться тільки ця область */}
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: 16,
          padding: 28,
          border: '1px solid var(--border)',
          flex: 1,
          overflowY: 'auto',
          minHeight: 0,
        }}
      >
        {!isShelter && tab === 0 && <UserInfoTab />}

        {!isShelter && tab === 1 && (
          <UserFavoritesTab
            favAnimals={favAnimals}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            loading={favLoading}
          />
        )}

        {!isShelter && tab === 2 && <UserRequestsTab />}
          {isShelter && tab === 3 && <ShelterEventsTab />}
          {!isShelter && tab === 3 && <ShelterEventsTab />}
        {isShelter && tab === 0 && <ShelterInfoTab />}
        {isShelter && tab === 1 && <ShelterRequestsTab />}
        {isShelter && tab === 2 && <ShelterAnimalsTab />}
      </div>
    </div>
  </div>
);
};
