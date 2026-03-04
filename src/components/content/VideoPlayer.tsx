interface Props {
    url: string;
}

function getEmbedUrl(url: string): string | null {
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

    return null;
}

export default function VideoPlayer({ url }: Props) {
    const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';
    const fullUrl = url.startsWith('/') ? `${apiUrl}${url}` : url;
    const embedUrl = getEmbedUrl(fullUrl);

    return (
        <div className="video-container">
            {embedUrl ? (
                <iframe
                    src={embedUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video Player"
                />
            ) : (
                <video controls src={fullUrl}>
                    Tu navegador no soporta video HTML5.
                </video>
            )}
        </div>
    );
}
