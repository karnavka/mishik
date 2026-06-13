import {Link, useLocation} from 'react-router-dom';
import {useAuth, notifyAuthChange} from '../api/useAuth';
import {logout} from '../utils/auth';


type Props = {
    onLoginClick: () => void;
    dark: boolean;
    onThemeToggle: () => void;
};

export const Header = ({onLoginClick, dark, onThemeToggle}: Props) => {
    const {loggedIn, role} = useAuth();
    const location = useLocation();

    // const handleLogout = () => {
    //     logout();
    //     notifyAuthChange();
    // };

    const navLinks = [
        {to: '/', label: '🐾 Тварини'},
        {to: '/shelters', label: '🏠 Притулки'},
        {to: '/clinics', label: '🏥 Клініки'},
        {to: '/events', label: '❤️ Події'},
    ];

    return (
        <header className="header">

                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <div className="header-top">
                        <img
                            src={dark
                                ? '/src/images/logodark.png'
                                : '/src/images/logo.png'
                            }
                            className="header-logo"
                        />
                    </div>
                    {/*<span className="logo">🐾 Mishik</span>*/}
                    {navLinks.map(({to, label}) => (
                        <Link key={to} to={to}
                              className={'header-btn' + (location.pathname === to ? ' active' : '')}
                              style={{textDecoration: 'none'}}
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                <div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: '16px'}}>
                    <Link
                        to="/donate"
                        state={{from: location.pathname + location.search}}
                        className={'header-btn donate-link accent-button' + (location.pathname.startsWith('/donate') ? ' active' : '')}
                        style={{textDecoration: 'none', color: 'var(--bg)'}}
                    >
                        Задонатити тваринкам
                    </Link>
                    <button className="header-btn" onClick={onThemeToggle}
                            title={dark ? 'Світла тема' : 'Темна тема'}
                            style={{fontSize: 16, padding: '6px 10px'}}>
                        {dark ? '☀' : '☁︎'}
                    </button>
                    {loggedIn ? (
                        <>
                            <Link to="/profile"
                                  className={'' + (location.pathname === '/profile' ? ' active' : '')}
                                  style={{textDecoration: 'none', padding: '0  10px 0 0'}}
                            >
                                {/*src/images/profile1.png*/}
                                {/*☺︎ {role && <span style={{fontSize: 11, color: '#aaa'}}></span>}*/}
                                <img src="src/images/profile1.png" className="profile-avatar"/>
                                {role && <span style={{ fontSize: 11, color: '#aaa' }} />}
                            </Link>
                            {/*<button className="tab-btn" onClick={handleLogout}>Вийти</button>*/}
                        </>
                    ) : (
                        <button className="tab-btn" onClick={onLoginClick}
                                style={{border: '1px solid #ccc', fontWeight: 500}}
                        >
                            Увійти
                        </button>
                    )}
                </div>

        </header>
    );
};
