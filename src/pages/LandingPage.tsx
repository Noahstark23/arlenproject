import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Play, ChevronDown, Share2, Users } from 'lucide-react';
import ContentCard from '../components/content/ContentCard';
import { biography, timeline, poems } from '../data/biography';
import { api } from '../api/client';
import { ContentType, CONTENT_TYPE_LABELS } from '../types';
import type { Content } from '../types';

import arlenPhoto from '/arlensifinal.png';
import grupoPhoto from '/imageneditadagrupofinal.jpg';

export default function LandingPage() {
    const [contents, setContents] = useState<Content[]>([]);
    const [activeTab, setActiveTab] = useState<string>('ALL');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.content
            .list()
            .then(setContents)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = activeTab === 'ALL' ? contents : contents.filter((c) => c.type === activeTab);
    const siteUrl = window.location.origin;

    return (
        <>
            {/* HERO */}
            <section className="hero" id="inicio">
                <div className="hero-bg">
                    <img src={arlenPhoto} alt="Arlen Siu Bermúdez" />
                </div>
                <div className="hero-overlay" />
                <div className="hero-content">
                    <div className="hero-badge">1955 — 1975</div>
                    <h1>{biography.name}</h1>
                    <div className="hero-quote">{biography.quote}</div>
                    <p className="hero-summary">{biography.summary}</p>
                    <div className="hero-actions">
                        <a href="#contenido" className="btn btn-primary">
                            <Play size={18} /> Explorar Contenido
                        </a>
                        <a href="#biografia" className="btn btn-secondary">
                            <ChevronDown size={18} /> Biografía
                        </a>
                    </div>
                </div>
            </section>

            {/* BIOGRAPHY TIMELINE */}
            <section className="section" id="biografia">
                <h2 className="section-title">Biografía</h2>
                <p className="section-subtitle">La vida de «La Chinita» — poeta, artista y revolucionaria</p>
                <div className="section-divider" />

                <div style={{ maxWidth: '800px', margin: '0 auto 3rem', color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                    {biography.fullBio}
                </div>

                <h3 style={{ textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '2rem' }}>
                    Línea del Tiempo
                </h3>

                <div className="timeline">
                    {timeline.map((event) => (
                        <div key={event.year} className="timeline-item">
                            <div className="timeline-dot" />
                            <div className="timeline-year">{event.year}</div>
                            <div className="timeline-item-title">{event.title}</div>
                            <div className="timeline-item-desc">{event.description}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* POEMAS */}
            <section className="section" id="poemas" style={{ background: 'var(--bg-secondary)' }}>
                <h2 className="section-title">Poesía Revolucionaria</h2>
                <p className="section-subtitle">Obras destacadas de Arlen Siu</p>
                <div className="section-divider" />

                <div className="poems-grid">
                    {poems.map((poem, index) => (
                        <div key={index} className="poem-card">
                            <h3 className="poem-title">"{poem.title}"</h3>
                            <div className="poem-content">{poem.content}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CONTENT */}
            <section className="section" id="contenido">
                <h2 className="section-title">Contenido</h2>
                <p className="section-subtitle">Podcasts, videos, blogs, narrativas e historias sobre Arlen Siu</p>
                <div className="section-divider" />

                <div className="category-tabs">
                    <button className={`category-tab ${activeTab === 'ALL' ? 'active' : ''}`} onClick={() => setActiveTab('ALL')}>
                        Todos
                    </button>
                    {Object.values(ContentType).map((type) => (
                        <button
                            key={type}
                            className={`category-tab ${activeTab === type ? 'active' : ''}`}
                            onClick={() => setActiveTab(type)}
                        >
                            {CONTENT_TYPE_LABELS[type]}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="loading">
                        <div className="spinner" />
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="content-grid">
                        {filtered.map((c) => (
                            <ContentCard key={c.id} content={c} />
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0' }}>
                        No hay contenido disponible en esta categoría aún.
                    </p>
                )}

                {!loading && contents.length > 0 && (
                    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                        <Link to="/contenido" className="btn btn-secondary">
                            Ver todo el contenido
                        </Link>
                    </div>
                )}
            </section>

            {/* QR CODE */}
            <section className="section" id="qr">
                <div className="qr-section">
                    <Share2 size={32} style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }} />
                    <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Comparte esta Plataforma</h2>
                    <p className="section-subtitle" style={{ marginBottom: '0' }}>
                        Escanea el código QR para acceder desde tu dispositivo móvil
                    </p>
                    <div className="qr-code-container">
                        <QRCodeSVG
                            value={siteUrl}
                            size={180}
                            bgColor="#ffffff"
                            fgColor="#0a0a0f"
                            level="M"
                            includeMargin={false}
                        />
                    </div>
                    <div className="qr-url">{siteUrl}</div>
                </div>
            </section>

            {/* ABOUT THE PROJECT */}
            <section className="section" id="sobre">
                <h2 className="section-title">Sobre el Proyecto</h2>
                <p className="section-subtitle">El equipo detrás de esta plataforma de preservación histórica</p>
                <div className="section-divider" />

                <div className="about-section">
                    <img src={grupoPhoto} alt="Equipo del proyecto" className="about-image" />
                    <div className="about-text">
                        <h3>
                            <Users size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                            Nuestro Equipo
                        </h3>
                        <p>
                            Somos un grupo de estudiantes comprometidos con la preservación de la memoria histórica de Nicaragua.
                            Esta plataforma nace como un espacio de debate, reflexión y difusión del legado de Arlen Siu Bermúdez,
                            una mujer que con su arte y valentía inspiró a generaciones.
                        </p>
                        <p style={{ marginTop: '1rem' }}>
                            A través de podcasts, videos, publicaciones y narrativas, buscamos mantener viva la memoria de
                            «La Chinita» y fomentar el diálogo sobre su impacto en la historia de nuestro país.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
