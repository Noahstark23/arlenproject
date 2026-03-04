const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem('admin_token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Error de red' }));
        throw new Error(error.error || `HTTP ${res.status}`);
    }

    return res.json();
}

// Auth
export const api = {
    auth: {
        login: (username: string, password: string) =>
            request<{ token: string; admin: { id: string; username: string } }>('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            }),
        verify: () =>
            request<{ valid: boolean; admin: { id: string; username: string } }>('/auth/verify', {
                method: 'POST',
            }),
    },

    content: {
        list: (type?: string) =>
            request<any[]>(`/content${type ? `?type=${type}` : ''}`),
        listAll: () => request<any[]>('/content/all'),
        get: (id: string) => request<any>(`/content/${id}`),
        create: (data: any) =>
            request<any>('/content', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: any) =>
            request<any>(`/content/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) =>
            request<any>(`/content/${id}`, { method: 'DELETE' }),
    },

    comments: {
        list: (contentId: string, sort?: string) =>
            request<any[]>(`/comments/${contentId}${sort ? `?sort=${sort}` : ''}`),
        create: (data: { contentId: string; parentId?: string; authorName: string; body: string }) =>
            request<any>('/comments', { method: 'POST', body: JSON.stringify(data) }),
        like: (id: string) =>
            request<any>(`/comments/${id}/like`, { method: 'POST' }),
    },

    upload: async (file: File): Promise<{ url: string }> => {
        const token = localStorage.getItem('admin_token');
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: { ...(token && { Authorization: `Bearer ${token}` }) },
            body: formData,
        });
        if (!res.ok) throw new Error('Error al subir archivo');
        return res.json();
    },
};
