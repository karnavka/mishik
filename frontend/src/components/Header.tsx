import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, notifyAuthChange } from '../api/useAuth';
import { logout } from '../utils/auth';

type Props = {
    onLoginClick: () => void;
    dark: boolean;
    onThemeToggle: () => void;
};

const USER_TABS = [
    { icon: '👤', label: 'Про мене',     tab: 0 },
    { icon: '♡',  label: 'Уподобані',    tab: 1 },
    { icon: '📋', label: 'Мої заявки',   tab: 2 },
];

const SHELTER_TABS = [
    { icon: '🏠', label: 'Про притулок', tab: 0 },
    { icon: '📬', label: 'Заявки',       tab: 1 },
    { icon: '🐾', label: 'Тварини',      tab: 2 },
];

export const Header = ({ onLoginClick, dark, onThemeToggle }: Props) => {
    const { loggedIn, role } = useAuth();
    const location  = useLocation();
    const navigate  = useNavigate();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Закрити при кліку поза дропдауном
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => {
        logout();
        notifyAuthChange();
        setOpen(false);
    };

    const goToTab = (tab: number) => {
        setOpen(false);
        navigate('/profile', { state: { tab } });
    };

    const isShelter = role === 'ROLE_SHELTER';
    const tabs = isShelter ? SHELTER_TABS : USER_TABS;

    const navLinks = [
        { to: '/',         label: 'тварини', icon: "/images/animals.png"  },
        { to: '/shelters', label: 'притулки',icon: "/images/shelters.png"  },
        { to: '/clinics',  label: 'клініки', icon: "/images/clinics.png"   },
        { to: '/events',   label: 'події' ,icon: "/images/events.png"},
    ];

    return (
        <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <div className="header-top">
                    <img
                        src={dark ? '/images/logodark.png' : '/images/logo.png'}
                        className="header-logo"
                    />
                </div>
                {navLinks.map(({ to, label, icon }) => (
                    <Link key={to} to={to}
                          style ={{ textDecoration: 'none', display:'flex', gap: '5px', flexDirection:'row', alignItems: 'center'}}
                        className={'header-btn' + (location.pathname === to ? ' active' : '')}
                    >
                        {<img src={icon} style={{width:'30px', height:'30px', padding: '0'}}/>}
                        {label}
                    </Link>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '16px' }}>
                <Link
                    to="/donate"
                    state={{ from: location.pathname + location.search }}
                    className={'header-btn donate-link accent-button' + (location.pathname.startsWith('/donate') ? ' active' : '')}
                    style={{ textDecoration: 'none', color: 'var(--bg)' }}
                >
                    Задонатити тваринкам
                </Link>

                <button className="header-btn" onClick={onThemeToggle}
                    title={dark ? 'Світла тема' : 'Темна тема'}
                    style={{ fontSize: 30, padding: '6px 10px', justifyContent:'center' }}>
                    {dark ? '☀' : '☁︎'}
                </button>

                {loggedIn ? (
                    <div ref={ref} style={{ position: 'relative' }}>
                        {/* Аватар — відкриває дропдаун */}
                        <button
                            onClick={() => setOpen(v => !v)}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                padding: '0 10px 0 0', display: 'flex', alignItems: 'center',
                            }}
                        >
                            <img src="/images/profile1.png" className="profile-avatar" />
                        </button>

                        {/* Дропдаун */}
                        {open && (
                            <div style={{
                                position: 'absolute', right: 8, top: 'calc(100% + 8px)',
                                background: 'var(--surface)', border: '1px solid var(--border)',
                                borderRadius: 12, boxShadow: '0 8px 24px #0002',
                                minWidth: 180, zIndex: 1000, overflow: 'hidden',
                                display: 'flex', flexDirection: 'column',
                                padding: '6px 0',
                            }}>
                                {tabs.map(({ icon, label, tab }) => (
                                    <button
                                        key={tab}
                                        onClick={() => goToTab(tab)}
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            padding: '10px 18px', textAlign: 'left',
                                            fontSize: 14, color: 'var(--text)',
                                            display: 'flex', alignItems: 'center', gap: 10,
                                            transition: 'background .15s',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                                    >
                                        <span style={{ fontSize: 16 }}>{icon}</span>
                                        {label}
                                    </button>
                                ))}

                                {/* Розділювач */}
                                <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />

                                <button
                                    onClick={handleLogout}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        padding: '10px 18px', textAlign: 'left',
                                        fontSize: 14, color: '#e74c3c',
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        transition: 'background .15s',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                                >
                                    <span style={{ fontSize: 16 }}>🚪</span>
                                    Вийти
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button className="tab-btn" onClick={onLoginClick}
                        style={{ border: '1px solid #ccc', fontWeight: 500 }}
                    >
                        Увійти
                    </button>
                )}
            </div>
        </header>
    );
};