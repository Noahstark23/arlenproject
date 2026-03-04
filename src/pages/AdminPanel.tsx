import { useState, useEffect } from 'react';
import {
    LogIn,
    LogOut,
    Plus,
    Trash2,
    Edit3,
    Eye,
    EyeOff,
    Save,
    X,
    Upload,
    Mic,
    Video,
    BookOpen,
    Feather,
    BookMarked,
} from 'lucide-react';
import { api } from '../api/client';
import { ContentType, CONTENT_TYPE_LABELS } from '../types';
import type { Content } from '../types';

export default function AdminPanel() {
    const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);

    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Content | null>(null);

    // Form state
    const [form, setForm] = useState({
        title: '',
        description: '',
        body: '',
        type: 'PODCAST' as string,
        mediaUrl: '',
        thumbnailUrl: '',
        published: true,
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (token) loadContents();
    }, [token]);

    const loadContents = async () => {
        setLoading(true);
        try {
            const data = await api.content.listAll();
            setContents(data);
        } catch (err: any) {
            if (err.message?.includes('401')) {
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setLoggingIn(true);
        try {
            const res = await api.auth.login(username, password);
            localStorage.setItem('admin_token', res.token);
            setToken(res.token);
        } catch (err: any) {
            setLoginError(err.message || 'Credenciales inválidas');
        } finally {
            setLoggingIn(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('admin_token');
        setToken(null);
        setContents([]);
    };

    const resetForm = () => {
        setForm({ title: '', description: '', body: '', type: 'PODCAST', mediaUrl: '', thumbnailUrl: '', published: true });
        setEditing(null);
        setShowForm(false);
    };

    const startEdit = (c: Content) => {
        setForm({
            title: c.title,
            description: c.description,
            body: c.body || '',
            type: c.type,
            mediaUrl: c.mediaUrl || '',
            thumbnailUrl: c.thumbnailUrl || '',
            published: c.published,
        });
        setEditing(c);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editing) {
                await api.content.update(editing.id, form);
            } else {
                await api.content.create(form);
            }
            resetForm();
            loadContents();
        } catch (err: any) {
            alert(err.message || 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Seguro que deseas eliminar este contenido?')) return;
        try {
            await api.content.delete(id);
            loadContents();
        } catch (err: any) {
            alert(err.message || 'Error al eliminar');
        }
    };

    const togglePublish = async (c: Content) => {
        try {
            await api.content.update(c.id, { published: !c.published });
            loadContents();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'mediaUrl' | 'thumbnailUrl') => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const res = await api.upload(file);
            setForm((prev) => ({ ...prev, [field]: res.url }));
        } catch (err: any) {
            alert(err.message || 'Error al subir archivo');
        }
    };

    const typeIcons: Record<string, React.ReactNode> = {
        PODCAST: <Mic size={16} />,
        VIDEO: <Video size={16} />,
        BLOG: <BookOpen size={16} />,
        NARRATIVE: <Feather size={16} />,
        STORY: <BookMarked size={16} />,
    };

    // Stats
    const stats = Object.values(ContentType).map((t) => ({
        type: t,
        count: contents.filter((c) => c.type === t).length,
    }));

    // LOGIN VIEW
    if (!token) {
        return (
            <div className="admin-page">
                <div className="admin-login">
                    <h2>Panel Administrativo</h2>
                    <p>Ingresa tus credenciales para administrar el contenido</p>
                    {loginError && <div className="form-error">{loginError}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Usuario</label>
                            <input value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
                        </div>
                        <div className="form-group">
                            <label>Contraseña</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loggingIn}>
                            <LogIn size={18} /> {loggingIn ? 'Ingresando...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // DASHBOARD VIEW
    return (
        <div className="admin-page">
            <div className="admin-container">
                <div className="admin-header">
                    <h1>Panel Administrativo</h1>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
                            <Plus size={18} /> Nuevo Contenido
                        </button>
                        <button className="btn btn-secondary" onClick={logout}>
                            <LogOut size={16} /> Salir
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="admin-stats">
                    <div className="admin-stat-card">
                        <div className="number">{contents.length}</div>
                        <div className="label">Total</div>
                    </div>
                    {stats.map((s) => (
                        <div key={s.type} className="admin-stat-card">
                            <div className="number">{s.count}</div>
                            <div className="label">{CONTENT_TYPE_LABELS[s.type]}</div>
                        </div>
                    ))}
                </div>

                {/* Create/Edit Form */}
                {showForm && (
                    <div className="admin-content-form">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>{editing ? 'Editar Contenido' : 'Nuevo Contenido'}</h3>
                            <button onClick={resetForm} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Título *</label>
                                    <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Tipo *</label>
                                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                                        {Object.values(ContentType).map((t) => (
                                            <option key={t} value={t}>{CONTENT_TYPE_LABELS[t]}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Descripción *</label>
                                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                            </div>

                            <div className="form-group">
                                <label>Contenido / Cuerpo</label>
                                <textarea
                                    value={form.body}
                                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                                    rows={6}
                                    placeholder="Texto completo del blog, narrativa o historia..."
                                />
                            </div>

                            {(form.type === 'PODCAST' || form.type === 'VIDEO') && (
                                <div className="form-group">
                                    <label>URL del Media (o sube un archivo)</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            value={form.mediaUrl}
                                            onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
                                            placeholder="https://... o /uploads/..."
                                            style={{ flex: 1 }}
                                        />
                                        <label className="btn btn-small btn-secondary" style={{ cursor: 'pointer', marginBottom: 0 }}>
                                            <Upload size={14} /> Subir
                                            <input type="file" hidden accept="audio/*,video/*" onChange={(e) => handleFileUpload(e, 'mediaUrl')} />
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Thumbnail (imagen URL o subir)</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        value={form.thumbnailUrl}
                                        onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                                        placeholder="https://... o /uploads/..."
                                        style={{ flex: 1 }}
                                    />
                                    <label className="btn btn-small btn-secondary" style={{ cursor: 'pointer', marginBottom: 0 }}>
                                        <Upload size={14} /> Subir
                                        <input type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, 'thumbnailUrl')} />
                                    </label>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <label className="toggle-switch">
                                    <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                                    <span className="toggle-slider" />
                                </label>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {form.published ? 'Publicado' : 'Borrador'}
                                </span>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                <Save size={16} /> {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear Contenido'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Content List */}
                <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Contenido ({contents.length})</h3>

                {loading ? (
                    <div className="loading"><div className="spinner" /></div>
                ) : (
                    <div className="admin-content-list">
                        {contents.map((c) => (
                            <div key={c.id} className="admin-content-item">
                                <div style={{ color: 'var(--text-secondary)' }}>{typeIcons[c.type]}</div>
                                <div className="admin-content-item-info">
                                    <div className="admin-content-item-title">{c.title}</div>
                                    <div className="admin-content-item-meta">
                                        <span className={`status-badge ${c.published ? 'published' : 'draft'}`}>
                                            {c.published ? 'Publicado' : 'Borrador'}
                                        </span>
                                        <span>{CONTENT_TYPE_LABELS[c.type]}</span>
                                        <span>{new Date(c.createdAt).toLocaleDateString('es-NI')}</span>
                                        <span>{c._count?.comments || 0} comentarios</span>
                                    </div>
                                </div>
                                <div className="admin-content-item-actions">
                                    <button className="btn btn-small btn-secondary" onClick={() => togglePublish(c)} title={c.published ? 'Despublicar' : 'Publicar'}>
                                        {c.published ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                    <button className="btn btn-small btn-secondary" onClick={() => startEdit(c)}>
                                        <Edit3 size={14} />
                                    </button>
                                    <button className="btn btn-small btn-danger" onClick={() => handleDelete(c.id)}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {contents.length === 0 && (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0' }}>
                                No hay contenido aún. Crea tu primer publicación.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
