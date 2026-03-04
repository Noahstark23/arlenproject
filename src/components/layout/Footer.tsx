import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-links">
                    <Link to="/">Inicio</Link>
                    <Link to="/contenido">Contenido</Link>
                    <Link to="/#biografia">Biografía</Link>
                    <Link to="/#qr">Compartir</Link>
                </div>
                <p>
                    © {new Date().getFullYear()} Plataforma Arlen Siu — Preservando el legado de una heroína revolucionaria.
                </p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                    Arlen Siu Bermúdez (1955-1975) · «La Chinita» · Mártir de la Revolución Sandinista
                </p>
            </div>
        </footer>
    );
}
