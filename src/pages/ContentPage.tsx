import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { api } from '../api/client';
import PodcastPlayer from '../components/content/PodcastPlayer';
import VideoPlayer from '../components/content/VideoPlayer';
import CommentSection from '../components/comments/CommentSection';
import { ContentType, CONTENT_TYPE_LABELS, CONTENT_TYPE_COLORS } from '../types';
import type { Content, Comment } from '../types';

export default function ContentPage() {
    const { id } = useParams<{ id: string }>();
    const [content, setContent] = useState<Content | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        if (!id) return;
        try {
            const data = await api.content.get(id);
            setContent(data);
            setComments(data.comments || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    const refreshComments = async () => {
        if (!id) return;
        const data = await api.content.get(id);
        setComments(data.comments || []);
    };

    if (loading) {
        return (
            <div className="content-page">
                <div className="loading" style={{ minHeight: '60vh' }}>
                    <div className="spinner" />
                </div>
            </div>
        );
    }

    if (!content) {
        return (
            <div className="content-page">
                <div className="content-page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                    <h2>Contenido no encontrado</h2>
                    <Link to="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                        <ArrowLeft size={16} /> Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    const color = CONTENT_TYPE_COLORS[content.type];

    return (
        <div className="content-page">
            <div className="content-page-container">
                <Link to="/" className="content-page-back">
                    <ArrowLeft size={16} /> Volver al inicio
                </Link>

                <span className="content-page-type" style={{ background: `${color}20`, color }}>
                    {CONTENT_TYPE_LABELS[content.type]}
                </span>

                <h1 className="content-page-title">{content.title}</h1>

                <div className="content-page-date">
                    <Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />
                    {new Date(content.createdAt).toLocaleDateString('es-NI', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </div>

                {/* Media Player */}
                {content.type === ContentType.PODCAST && content.mediaUrl && (
                    <PodcastPlayer url={content.mediaUrl} title={content.title} />
                )}
                {content.type === ContentType.VIDEO && content.mediaUrl && (
                    <VideoPlayer url={content.mediaUrl} />
                )}

                {/* Description */}
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '2rem', fontSize: '1.05rem' }}>
                    {content.description}
                </p>

                {/* Body */}
                {content.body && (
                    <div className="content-page-body">
                        {content.body.split('\n').map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>
                )}

                {/* Comments */}
                <CommentSection contentId={content.id} comments={comments} onRefresh={refreshComments} />
            </div>
        </div>
    );
}
