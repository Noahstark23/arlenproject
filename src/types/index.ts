export const ContentType = {
    PODCAST: 'PODCAST',
    VIDEO: 'VIDEO',
    BLOG: 'BLOG',
    NARRATIVE: 'NARRATIVE',
    STORY: 'STORY',
} as const;

export type ContentType = (typeof ContentType)[keyof typeof ContentType];

export interface Content {
    id: string;
    title: string;
    description: string;
    body: string | null;
    type: ContentType;
    mediaUrl: string | null;
    thumbnailUrl: string | null;
    published: boolean;
    createdAt: string;
    updatedAt: string;
    _count?: { comments: number };
    comments?: Comment[];
}

export interface Comment {
    id: string;
    body: string;
    authorName: string;
    likes: number;
    createdAt: string;
    contentId: string;
    parentId: string | null;
    replies?: Comment[];
}

export interface Admin {
    id: string;
    username: string;
}

export interface AuthResponse {
    token: string;
    admin: Admin;
}

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
    [ContentType.PODCAST]: 'Podcast',
    [ContentType.VIDEO]: 'Video',
    [ContentType.BLOG]: 'Blog',
    [ContentType.NARRATIVE]: 'Narrativa',
    [ContentType.STORY]: 'Historia',
};

export const CONTENT_TYPE_COLORS: Record<ContentType, string> = {
    [ContentType.PODCAST]: '#e74c3c',
    [ContentType.VIDEO]: '#8e44ad',
    [ContentType.BLOG]: '#f39c12',
    [ContentType.NARRATIVE]: '#27ae60',
    [ContentType.STORY]: '#2980b9',
};
