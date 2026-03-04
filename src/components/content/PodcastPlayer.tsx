import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface Props {
    url: string;
    title: string;
}

export default function PodcastPlayer({ url, title }: Props) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [muted, setMuted] = useState(false);

    const apiBaseUrl = (() => {
        try {
            return new URL(import.meta.env.VITE_API_URL || 'http://localhost:3001').origin;
        } catch {
            return 'http://localhost:3001';
        }
    })();
    const fullUrl = url.startsWith('/') ? `${apiBaseUrl}${url}` : url;

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime / audio.duration) * 100 || 0);
        };

        const onLoadedMetadata = () => setDuration(audio.duration);
        const onEnded = () => setPlaying(false);

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', onEnded);
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setPlaying(!playing);
    };

    const seek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audioRef.current.currentTime = percent * duration;
    };

    const handleVolume = (val: number) => {
        setVolume(val);
        if (audioRef.current) audioRef.current.volume = val;
        setMuted(val === 0);
    };

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="audio-player">
            <audio ref={audioRef} src={fullUrl} preload="metadata" />
            <div className="audio-player-controls">
                <button className="audio-player-btn" onClick={togglePlay}>
                    {playing ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <div className="audio-player-progress">
                    <div className="audio-player-bar" onClick={seek}>
                        <div className="audio-player-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="audio-player-times">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="audio-player-volume">
                    <button onClick={() => { setMuted(!muted); if (audioRef.current) audioRef.current.muted = !muted; }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={muted ? 0 : volume}
                        onChange={(e) => handleVolume(parseFloat(e.target.value))}
                    />
                </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>{title}</p>
        </div>
    );
}
