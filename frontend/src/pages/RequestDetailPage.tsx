// src/pages/RequestDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { authFetch } from '../utils/api';
import { STATUS } from '../utils/Profilestyles';
import type { StatusKey } from '../utils/Profilestyles';
import { useAuth } from '../api/useAuth';

type FullRequest = {
  status: string;
  createdDate: string;
  animal: {
    id: number; name: string; animalType: string;
    age?: number; height?: number; sex?: string;
    description?: string; imageUrl?: string;
    shelterName?: string; shelterId?: number;
    shelterPhone?: string;
  };
  user: {
    id: number; login: string;
    firstName?: string; lastName?: string; patronymic?: string;
    phoneNumber?: string;
  };
};

const EMOJI: Record<string, string> = {
  кіт: '🐱', cat: '🐱', пес: '🐶', dog: '🐶', rabbit: '🐰', parrot: '🦜',
};
const animalEmoji = (s?: string) => EMOJI[s?.toLowerCase() ?? ''] ?? '🐾';
const cleanPhone  = (p: string)  => p.replace(/\D/g, '');

const StatusBadge = ({ status }: { status: string }) => {
  const s = STATUS[status as StatusKey];
  if (!s) return <span>{status}</span>;
  return (
    <span style={{ fontSize: 13, padding: '4px 14px', borderRadius: 20, fontWeight: 600, background: s.color + '22', color: s.color }}>
      {s.label}
    </span>
  );
};

const InfoRow = ({ label, value }: { label: string; value?: string | number }) =>
  value ? (
    <div style={{ display: 'flex', gap: 8, fontSize: 14, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ color: 'var(--text-muted)', minWidth: 120 }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  ) : null;

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', padding: '20px 24px' }}>
    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>{title}</div>
    {children}
  </div>
);

const ContactButtons = ({ phone }: { phone: string }) => {
  const digits = cleanPhone(phone);
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
const viberUrl = isMobile
  ? `viber://chat?number=%2B${digits}`
  : `https://invite.viber.com/?number=${digits}`;
  return (
    <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <a href={`https://t.me/+${digits}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <button className="btn-primary" style={{ background: '#229ed9', borderColor: '#229ed9', display: 'flex', alignItems: 'center', gap: 6 }}>
          Telegram
        </button>
      </a>
      <a href={viberUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <button className="btn-primary" style={{ background: '#7360f2', borderColor: '#7360f2', display: 'flex', alignItems: 'center', gap: 6 }}>
          Viber
        </button>
      </a>
      <a href={`sms:+${digits}`} style={{ textDecoration: 'none' }}>
        <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          SMS
        </button>
      </a>
    </div>
  );
};

export const RequestDetailPage = () => {
  const { animalId, userId } = useParams<{ animalId: string; userId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAuth();

  const isUserView = userId === 'my';
  const isShelter  = role === 'ROLE_SHELTER';

  const passedRequest = (location.state as { request?: { status: string; createdDate: string } })?.request;

  const [data,    setData]    = useState<FullRequest | null>(null);
  const [status,  setStatus]  = useState<string>(passedRequest?.status ?? '');
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    const url = isUserView
      ? `http://localhost:8080/api/adoption-requests/my/${animalId}`
      : `http://localhost:8080/api/adoption-requests/${animalId}/${userId}`;

    authFetch(url)
      .then(async r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: FullRequest) => { setData(d); setStatus(d.status); })
      .catch(() => setError('Не вдалося завантажити дані заявки'))
      .finally(() => setLoading(false));
  }, [animalId, userId]);

  const updateStatus = async (newStatus: string) => {
    await authFetch(
      `http://localhost:8080/api/adoption-requests/${animalId}/${userId}/status`,
      { method: 'PATCH', body: JSON.stringify({ status: newStatus }) }
    ).then(r => r.text());
    setStatus(newStatus);
  };

  if (loading)
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ color: 'var(--text-muted)' }}>Завантаження...</div>
      </div>
    );

  if (error || !data)
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ color: '#e74c3c' }}>{error ?? 'Заявку не знайдено'}</div>
      </div>
    );

  const { animal, user } = data;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 24px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="detail-back" onClick={() => navigate(-1)}>←</button>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Деталі заявки</h2>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Подано: {new Date(data.createdDate).toLocaleDateString('uk-UA')}
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}><StatusBadge status={status} /></div>
        </div>

        {/* Тварина — для всіх */}
        <Card title="🐾 Тварина">
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{
              width: 80, height: 80, borderRadius: 12, overflow: 'hidden', flexShrink: 0,
              background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, border: '1px solid var(--border)',
            }}>
              {animal.imageUrl
                ? <img src={animal.imageUrl} alt={animal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : animalEmoji(animal.animalType)
              }
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 17 }}>{animal.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 10 }}>{animal.shelterName}</div>
              <InfoRow label="Вид"    value={animal.animalType} />
              <InfoRow label="Стать"  value={animal.sex === 'MALE' ? '♂ Хлопчик' : animal.sex === 'FEMALE' ? '♀ Дівчинка' : undefined} />
              <InfoRow label="Вік"    value={animal.age    ? `${animal.age} р.`    : undefined} />
              <InfoRow label="Висота" value={animal.height ? `${animal.height} см` : undefined} />
              <InfoRow label="Опис"   value={animal.description} />
            </div>
          </div>
        </Card>

        {isUserView && (
          <Card title="🏠 Притулок">
            <InfoRow label="Назва" value={animal.shelterName} />
            {animal.shelterPhone && <InfoRow label="Телефон" value={animal.shelterPhone} />}
            {animal.shelterPhone && <ContactButtons phone={animal.shelterPhone} />}
          </Card>
        )}

        {!isUserView && (
          <Card title="👤 Заявник">
            <InfoRow label="Логін"      value={user.login} />
            <InfoRow label="Повне ім'я" value={[user.firstName, user.lastName, user.patronymic].filter(Boolean).join(' ') || undefined} />
            <InfoRow label="Телефон"    value={user.phoneNumber} />
            {user.phoneNumber && <ContactButtons phone={user.phoneNumber} />}
          </Card>
        )}

        {!isUserView && isShelter && status === 'PENDING' && (
          <Card title="⚖️ Рішення по заявці">
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-primary"
                style={{ background: '#27ae60', borderColor: '#27ae60', flex: 1, justifyContent: 'center' }}
                onClick={() => updateStatus('ACCEPTED')}>
                ✓ Схвалити
              </button>
              <button className="btn-ghost"
                style={{ color: '#e74c3c', borderColor: '#e74c3c', flex: 1, justifyContent: 'center' }}
                onClick={() => updateStatus('REJECTED')}>
                ✕ Відхилити
              </button>
            </div>
          </Card>
        )}

        {status !== 'PENDING' && (
          <div style={{
            padding: '14px 18px', borderRadius: 12, textAlign: 'center', fontSize: 14,
            color: 'var(--text-muted)',
            background: status === 'ACCEPTED' ? '#27ae6015' : '#e74c3c15',
            border: `1px solid ${status === 'ACCEPTED' ? '#27ae6040' : '#e74c3c40'}`,
          }}>
            {status === 'ACCEPTED' ? '✓ Заявку схвалено' : '✕ Заявку відхилено'}
          </div>
        )}

      </div>
    </div>
  );
};