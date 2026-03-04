import { useNavigate } from 'react-router-dom';
import { MessageSquare, Mic, Video, BookOpen, Feather, BookMarked } from 'lucide-react';
import { Content, ContentType, CONTENT_TYPE_LABELS, CONTENT_TYPE_COLORS } from '../../types';

const TYPE_ICONS: Record<ContentType, React.ReactNode> = {
    [ContentType.PODCAST]: <Mic size={40} />,
    [ContentType.VIDEO]: <Video size={40} />,
    [ContentType.BLOG]: <BookOpen size={40} />,
    [ContentType.NARRATIVE]: <Feather size={40} />,
    [ContentType.STORY]: <BookMarked size={40} />,
};

interface Props {
    content: Content;
}

export default function ContentCard({ content }: Props) {
    const navigate = useNavigate();
    const color = CONTENT_TYPE_COLORS[content.type];
    const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

    return (
        <div className="content-card" onClick={() => navigate(`/contenido/${content.id}`)}>
            {content.thumbnailUrl ? (
                <img
                    className="content-card-image"
                    src={content.thumbnailUrl.startsWith('/') ? `${apiUrl}${content.thumbnailUrl}` : content.thumbnailUrl}
                    alt={content.title}
                />
            ) : (
                <div className="content-card-placeholder">
                    {TYPE_ICONS[content.type]}
                </div>
            )}

            <div className="content-card-body">
                <span
                    className="content-card-type"
                    style={{ background: `${color}20`, color }}
                >
                    {CONTENT_TYPE_LABELS[content.type]}
                </span>
                <h3 className="content-card-title">{content.title}</h3>
                <p className="content-card-desc">{content.description}</p>
                <div className="content-card-meta">
                    <span>{new Date(content.createdAt).toLocaleDateString('es-NI')}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MessageSquare size={14} />
                        {content._count?.comments || 0}
                    </span>
                </div>
            </div>
        </div>
    );
}
