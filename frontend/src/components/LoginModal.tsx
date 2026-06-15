import { useState } from 'react';
import { saveAuth } from '../utils/auth';
import { notifyAuthChange } from '../api/useAuth';

type Tab = 'login' | 'register';
type Role = 'USER' | 'SHELTER';
type Sex  = 'MALE' | 'FEMALE' | 'UNKNOWN';

type Props = { onClose: () => void };

export const LoginModal = ({ onClose }: Props) => {
  const [tab, setTab] = useState<Tab>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [firstName,  setFirstName]  = useState('');
  const [lastName,   setLastName]   = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [sex,        setSex]        = useState<Sex>('UNKNOWN');
  const [userPhone,  setUserPhone]  = useState('');

  const [shelterName,       setShelterName]       = useState('');
  const [shelterPhone,      setShelterPhone]      = useState('');
  const [shelterCity,    setShelterCity]    = useState('');
  const [shelterRegion,  setShelterRegion]  = useState('');
  const [shelterStreet,  setShelterStreet]  = useState('');
  const [adoptionConditions,setAdoptionConditions]= useState('');
  const [shelterInstagram, setShelterInstagram] = useState('');
 const [shelterFacebook,  setShelterFacebook]  = useState('');
 const [shelterTelegram,  setShelterTelegram]  = useState('');

  const reset = () => {
    setUsername(''); setPassword(''); setConfirmPassword(''); setError('');
    setFirstName(''); setLastName(''); setPatronymic(''); setSex('UNKNOWN'); setUserPhone('');
    setShelterName(''); setShelterPhone(''); setShelterCity(''); setShelterRegion(''); setShelterStreet('');
    setAdoptionConditions(''); setShelterInstagram(''); setShelterFacebook(''); setShelterTelegram('');
  };

  const switchTab = (t: Tab) => { setTab(t); reset(); };

  const handleLogin = async () => {
    if (!username || !password) { setError('Введіть логін та пароль'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: username, password }),
      });
      if (!res.ok) throw new Error('Невірний логін або пароль');
      const data = await res.json();
      saveAuth(data.token, data.role);
      notifyAuthChange();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Помилка');
    } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!username || !password) { setError('Заповніть всі поля'); return; }
    if (password !== confirmPassword) { setError('Паролі не співпадають'); return; }

   if (selectedRole === 'SHELTER') {
    if (!shelterName) { setError("Вкажіть назву притулку"); return; }
    if (!shelterPhone) { setError("Вкажіть телефон притулку"); return; }
    if (!shelterCity) { setError("Вкажіть місто притулку"); return; } 
    }

    setLoading(true); setError('');
    try {
      const endpoint =
        selectedRole === 'USER'
          ? 'http://localhost:8080/api/auth/register/user'
          : 'http://localhost:8080/api/auth/register/shelter';

      const body =
        selectedRole === 'USER'
          ? { login: username, password, firstName, lastName, patronymic, sex, phoneNumber: userPhone || undefined }
          : {login: username,password, name: shelterName, phoneNumber: shelterPhone, address: {        
        city:   shelterCity,
        region: shelterRegion || undefined,
        street: shelterStreet || undefined,
      },
            adoptionConditions: adoptionConditions || undefined,
            socialLinks: [shelterInstagram, shelterFacebook, shelterTelegram].filter(Boolean).join('|') || undefined,
            };


      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Помилка реєстрації');

      const loginRes = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: username, password }),
      });
      if (!loginRes.ok) throw new Error('Не вдалося виконати автоматичний вхід');

      const loginData = await loginRes.json();
      saveAuth(loginData.token, loginData.role);
      notifyAuthChange();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Помилка реєстрації');
    } finally { setLoading(false); }
  };

  return (
    <div
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', display:'flex',
        alignItems:'center', justifyContent:'center', zIndex:1000 }}
      onClick={onClose}
    >
      <div
        style={{ background:'#fff', borderRadius:16, padding:'28px 28px 24px',
          width:420, maxHeight:'90vh', overflowY:'auto',
          boxShadow:'0 8px 40px rgba(0,0,0,0.15)', display:'flex',
          flexDirection:'column', gap:12 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Tabs */}
        <div style={{ display:'flex', gap:4, background:'#f5f5f5', borderRadius:10, padding:4 }}>
          {(['login','register'] as Tab[]).map(t => (
            <button key={t} onClick={() => switchTab(t)}
              style={{ flex:1, padding:'8px 0', borderRadius:8, border:'none', cursor:'pointer',
                fontWeight:500, fontSize:14,
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? '#111' : '#888',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition:'all .15s' }}
            >
              {t === 'login' ? 'Вхід' : 'Реєстрація'}
            </button>
          ))}
        </div>

        {/* Base fields */}
        <input style={inp} placeholder="Логін" value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleRegister())} />
        <input style={inp} type="password" placeholder="Пароль" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleRegister())} />

        {tab === 'register' && (
          <>
            <input style={inp} type="password" placeholder="Повторіть пароль"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRegister()} />

            {/* Role selector */}
            <div>
              <div style={{ fontSize:13, color:'#888', marginBottom:8 }}>Реєструюсь як:</div>
              <div style={{ display:'flex', gap:8 }}>
                {([['USER','Користувач','Шукаю домашнього улюбленця'],
                   ['SHELTER','Притулок','Розміщую тварин для усиновлення']] as [Role,string,string][])
                  .map(([r, label, desc]) => (
                  <button key={r} onClick={() => setSelectedRole(r)}
                    style={{ flex:1, padding:'10px 8px', borderRadius:10, cursor:'pointer',
                      border: selectedRole === r ? '2px solid #111' : '1px solid #e5e5e5',
                      background: selectedRole === r ? '#f8f8f8' : '#fff',
                      textAlign:'left', transition:'all .15s' }}
                  >
                    <div style={{ fontSize:14, fontWeight:500 }}>{label}</div>
                    <div style={{ fontSize:11, color:'#888', marginTop:2 }}>{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop:'1px solid #eee', marginTop:4 }} />

            {/* ── USER extra fields ── */}
            {selectedRole === 'USER' && (
              <>
                <SectionLabel>Особисті дані</SectionLabel>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  <input style={inp} placeholder="Ім'я" value={firstName}
                    onChange={e => setFirstName(e.target.value)} />
                  <input style={inp} placeholder="Прізвище" value={lastName}
                    onChange={e => setLastName(e.target.value)} />
                </div>
                <input style={inp} placeholder="По батькові" value={patronymic}
                  onChange={e => setPatronymic(e.target.value)} />
                <select style={inp} value={sex} onChange={e => setSex(e.target.value as Sex)}>
                  <option value="UNKNOWN">Стать — не вказано</option>
                  <option value="MALE">♂ Чоловіча</option>
                  <option value="FEMALE">♀ Жіноча</option>
                </select>
                <input style={inp} placeholder="Номер телефону" value={userPhone}
                  onChange={e => setUserPhone(e.target.value)} />
              </>
            )}

            {/* ── SHELTER extra fields ── */}
            {selectedRole === 'SHELTER' && (
          <>
          <SectionLabel>Дані притулку</SectionLabel>
          <input style={inp} placeholder="Назва притулку *" value={shelterName}
            onChange={e => setShelterName(e.target.value)} />
          <input style={inp} placeholder="Телефон *" value={shelterPhone}
            onChange={e => setShelterPhone(e.target.value)} />
        <input style={inp} placeholder="Місто *" value={shelterCity}
            onChange={e => setShelterCity(e.target.value)} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        <input style={inp} placeholder="Область" value={shelterRegion}
          onChange={e => setShelterRegion(e.target.value)} />
        <input style={inp} placeholder="Вулиця" value={shelterStreet}
          onChange={e => setShelterStreet(e.target.value)} />
        </div>

        <textarea style={{ ...inp, minHeight:72, resize:'vertical' }}
         placeholder="Умови усиновлення" value={adoptionConditions}
         onChange={e => setAdoptionConditions(e.target.value)} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
  <input style={inp} placeholder="Instagram" value={shelterInstagram}
    onChange={e => setShelterInstagram(e.target.value)} />
  <input style={inp} placeholder="Facebook" value={shelterFacebook}
    onChange={e => setShelterFacebook(e.target.value)} />
</div>
<input style={inp} placeholder="Telegram (https://t.me/...)" value={shelterTelegram}
  onChange={e => setShelterTelegram(e.target.value)} />
        </>
      )}
          </>
        )}

        {error && <div style={{ color:'#c0392b', fontSize:13 }}>{error}</div>}

        <button
          style={{ padding:'10px 0', borderRadius:10, border:'none', background:'#111',
            color:'#fff', fontSize:15, fontWeight:500,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
          onClick={tab === 'login' ? handleLogin : handleRegister}
          disabled={loading}
        >
          {loading ? '...' : tab === 'login' ? 'Увійти' : 'Зареєструватись'}
        </button>

        <button
          style={{ padding:'8px 0', borderRadius:10, border:'1px solid #e5e5e5',
            background:'transparent', fontSize:14, cursor:'pointer', color:'#666' }}
          onClick={onClose}
        >
          Скасувати
        </button>
      </div>
    </div>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize:12, fontWeight:700, color:'#888', textTransform:'uppercase',
    letterSpacing:'.5px', marginBottom:-4 }}>
    {children}
  </div>
);

const inp: React.CSSProperties = {
  padding:'10px 14px', borderRadius:10, border:'1px solid #ddd',
  fontSize:14, outline:'none', width:'100%', boxSizing:'border-box',
};