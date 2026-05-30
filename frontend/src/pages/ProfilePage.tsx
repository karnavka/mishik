import { Navigate } from 'react-router-dom';
import { useAuth } from '../api/useAuth';
import { logout } from '../utils/auth';
import { notifyAuthChange } from '../api/useAuth';
import { RoleGuard } from '../components/RoleGuard';

export const ProfilePage = () => {
  const { loggedIn, role } = useAuth();

  if (!loggedIn) return <Navigate to="/" replace />;

  const handleLogout = () => {
    logout();
    notifyAuthChange();
  };

  const roleLabel: Record<string, string> = {
    ADMIN: 'Адміністратор',
    MODERATOR: 'Модератор',
    SHELTER: 'Притулок',
    USER: 'Користувач',
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #e5e5e5' }}>
        <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Особистий кабінет</div>
        <div className="badge" style={{ marginBottom: 20, fontSize: 14, padding: '4px 12px' }}>
          {role ? roleLabel[role] ?? role : ''}
        </div>

        {/* Збережені тварини — всі юзери */}
        <section style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>♡ Збережені тварини</div>
          <div style={{ color: '#aaa', fontSize: 14 }}>Поки що нічого немає</div>
        </section>

        {/* Мої заявки — USER */}
        <RoleGuard roles={['USER']}>
          <section style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>📋 Мої заявки на усиновлення</div>
            <div style={{ color: '#aaa', fontSize: 14 }}>Немає активних заявок</div>
          </section>
        </RoleGuard>

        {/* Мої тварини — SHELTER */}
        <RoleGuard roles={['SHELTER', 'ADMIN']}>
          <section style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>🐾 Мої оголошення</div>
            <div style={{ color: '#aaa', fontSize: 14 }}>Немає активних оголошень</div>
            <button className="btn-ghost" style={{ marginTop: 8 }} onClick={() => alert('TODO: add')}>
              + Додати тварину
            </button>
          </section>
        </RoleGuard>

        {/* Панель модерації — MODERATOR/ADMIN */}
        <RoleGuard roles={['MODERATOR', 'ADMIN']}>
          <section style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>🛡️ Модерація</div>
            <button className="btn-ghost" onClick={() => alert('TODO: moderation')}>
              Переглянути скарги
            </button>
          </section>
        </RoleGuard>

        {/* Керування — тільки ADMIN */}
        <RoleGuard roles={['ADMIN']}>
          <section style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>⚙️ Адміністрування</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-ghost" onClick={() => alert('TODO: users')}>Користувачі</button>
              <button className="btn-ghost" onClick={() => alert('TODO: stats')}>Статистика</button>
            </div>
          </section>
        </RoleGuard>

        <button
          className="btn-primary"
          style={{ background: '#e74c3c' }}
          onClick={handleLogout}
        >
          Вийти з акаунту
        </button>
      </div>
    </div>
  );
};