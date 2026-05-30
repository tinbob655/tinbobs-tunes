import React, {useState} from 'react';
import {Link, useLocation} from 'react-router';
import './header.scss';

const navLinks: {label: string, path: string}[] = [
    {label: 'Home',      path: '/'},
    {label: 'Albums',    path: '/albums'},
    {label: 'Singles',   path: '/singles'},
    {label: 'Playlists', path: '/playlists'},
];

export default function Header(): React.ReactElement {

    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const location = useLocation();

    return (
        <header>
            <button
                className={`icon burger ${menuOpen ? 'open' : ''}`}
                onClick={() => setMenuOpen(prev => !prev)}
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
            >
                <span/><span/><span/>
            </button>

            <nav className={menuOpen ? 'open' : ''}>
                <div className={'nav-inner'}>
                    {navLinks.map(({label, path}) => (
                        <Link
                            key={path}
                            to={path}
                            className={location.pathname === path ? 'active' : ''}
                            onClick={() => setMenuOpen(false)}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </nav>
        </header>
    );
}