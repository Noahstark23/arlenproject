import { useState } from 'react';
import { ThumbsUp, Reply, Send } from 'lucide-react';
import { api } from '../../api/client';
import type { Comment as CommentType } from '../../types';

interface Props {
    contentId: string;
    comments: CommentType[];
    onRefresh: () => void;
}

function CommentItem({
    comment,
    contentId,
    depth,
    onRefresh,
}: {
    comment: CommentType;
    contentId: string;
    depth: number;
    onRefresh: () => void;
}) {
    const [replying, setReplying] = useState(false);
    const [replyName, setReplyName] = useState('');
    const [replyBody, setReplyBody] = useState('');
    const [liking, setLiking] = useState(false);

    const handleLike = async () => {
        if (liking) return;
        setLiking(true);
        try {
            await api.comments.like(comment.id);
            onRefresh();
        } finally {
            setLiking(false);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyName.trim() || !replyBody.trim()) return;
        await api.comments.create({
            contentId,
            parentId: comment.id,
            authorName: replyName.trim(),
            body: replyBody.trim(),
        });
        setReplyName('');
        setReplyBody('');
        setReplying(false);
        onRefresh();
    };

    const timeAgo = (d: string) => {
        const diff = Date.now() - new Date(d).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'ahora';
        if (mins < 60) return `hace ${mins}m`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `hace ${hrs}h`;
        const days = Math.floor(hrs / 24);
        return `hace ${days}d`;
    };

    return (
        <div className="comment">
            <div className="comment-avatar">
                {comment.authorName.charAt(0).toUpperCase()}
            </div>
            <div className="comment-content">
                <div>
                    <span className="comment-author">{comment.authorName}</span>
                    <span className="comment-date">{timeAgo(comment.createdAt)}</span>
                </div>
                <p className="comment-body">{comment.body}</p>
                <div className="comment-actions">
                    <button className="comment-action-btn" onClick={handleLike}>
                        <ThumbsUp size={14} /> {comment.likes || ''}
                    </button>
                    {depth < 2 && (
                        <button className="comment-action-btn" onClick={() => setReplying(!replying)}>
                            <Reply size={14} /> Responder
                        </button>
                    )}
                </div>

                {replying && (
                    <form onSubmit={handleReply} className="comment-form" style={{ marginTop: '0.75rem' }}>
                        <input
                            placeholder="Tu nombre"
                            value={replyName}
                            onChange={(e) => setReplyName(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Tu respuesta..."
                            value={replyBody}
                            onChange={(e) => setReplyBody(e.target.value)}
                            required
                            rows={2}
                        />
                        <div className="comment-form-actions">
                            <button type="button" className="btn btn-small btn-secondary" onClick={() => setReplying(false)}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-small btn-primary" style={{ marginLeft: '0.5rem' }}>
                                <Send size={14} /> Enviar
                            </button>
                        </div>
                    </form>
                )}

                {comment.replies && comment.replies.length > 0 && (
                    <div className="comment-replies">
                        {comment.replies.map((r) => (
                            <CommentItem
                                key={r.id}
                                comment={r}
                                contentId={contentId}
                                depth={depth + 1}
                                onRefresh={onRefresh}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CommentSection({ contentId, comments, onRefresh }: Props) {
    const [name, setName] = useState('');
    const [body, setBody] = useState('');
    const [sort, setSort] = useState<'newest' | 'oldest' | 'likes'>('newest');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !body.trim() || submitting) return;
        setSubmitting(true);
        try {
            await api.comments.create({
                contentId,
                authorName: name.trim(),
                body: body.trim(),
            });
            setBody('');
            onRefresh();
        } finally {
            setSubmitting(false);
        }
    };

    const sorted = [...comments].sort((a, b) => {
        if (sort === 'likes') return b.likes - a.likes;
        if (sort === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <div className="comments-section">
            <div className="comments-header">
                <h3>Debate ({comments.length})</h3>
                <div className="comments-sort">
                    <button className={sort === 'newest' ? 'active' : ''} onClick={() => setSort('newest')}>Recientes</button>
                    <button className={sort === 'oldest' ? 'active' : ''} onClick={() => setSort('oldest')}>Antiguos</button>
                    <button className={sort === 'likes' ? 'active' : ''} onClick={() => setSort('likes')}>Popular</button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="comment-form">
                <input
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Comparte tu opinión, participa en el debate..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                />
                <div className="comment-form-actions">
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                        <Send size={16} /> {submitting ? 'Enviando...' : 'Comentar'}
                    </button>
                </div>
            </form>

            {sorted.map((c) => (
                <CommentItem key={c.id} comment={c} contentId={contentId} depth={0} onRefresh={onRefresh} />
            ))}

            {comments.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
                    Sé el primero en participar en el debate.
                </p>
            )}
        </div>
    );
}
