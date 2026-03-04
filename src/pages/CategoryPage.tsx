import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ContentCard from '../components/content/ContentCard';
import { api } from '../api/client';
import { ContentType, CONTENT_TYPE_LABELS } from '../types';
import type { Content } from '../types';

export default function CategoryPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const activeType = searchParams.get('type') || 'ALL';

    useEffect(() => {
        setLoading(true);
        api.content
            .list(activeType !== 'ALL' ? activeType : undefined)
            .then(setContents)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [activeType]);

    return (
        <div className="content-page">
            <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 2rem 4rem' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
                    Contenido
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Explora podcasts, videos, blogs, narrativas e historias sobre Arlen Siu
                </p>

                <div className="category-tabs" style={{ justifyContent: 'flex-start' }}>
                    <button
                        className={`category-tab ${activeType === 'ALL' ? 'active' : ''}`}
                        onClick={() => setSearchParams({})}
                    >
                        Todos
                    </button>
                    {Object.values(ContentType).map((type) => (
                        <button
                            key={type}
                            className={`category-tab ${activeType === type ? 'active' : ''}`}
                            onClick={() => setSearchParams({ type })}
                        >
                            {CONTENT_TYPE_LABELS[type]}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="loading">
                        <div className="spinner" />
                    </div>
                ) : contents.length > 0 ? (
                    <div className="content-grid">
                        {contents.map((c) => (
                            <ContentCard key={c.id} content={c} />
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem 0' }}>
                        No hay contenido disponible en esta categoría.
                    </p>
                )}
            </div>
        </div>
    );
}
