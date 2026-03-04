import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    ★ <span>Arlen Siu</span>
                </Link>

                <button className="navbar-hamburger" onClick={() => setOpen(!open)}>
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>

                <ul className={`navbar-links ${open ? 'open' : ''}`}>
                    <li><Link to="/" className={isActive('/')} onClick={() => setOpen(false)}>Inicio</Link></li>
                    <li><Link to="/contenido" className={isActive('/contenido')} onClick={() => setOpen(false)}>Contenido</Link></li>
                    <li><Link to="/contenido?type=PODCAST" onClick={() => setOpen(false)}>Podcasts</Link></li>
                    <li><Link to="/contenido?type=VIDEO" onClick={() => setOpen(false)}>Videos</Link></li>
                    <li><Link to="/admin" className={`${isActive('/admin')} btn btn-small btn-secondary`} onClick={() => setOpen(false)}>Admin</Link></li>
                </ul>
            </div>
        </nav>
    );
}
