import { useState, useEffect, useRef, useCallback } from "react";

interface PodcastData {
  id: number;
  title: string;
  topic: string;
  host: string;
  durationSec: number;
  plays: string;
  likes: number;
  color: string;
  accent: string;
  gradient: string;
  waveColor: string;
  iconUrl: string;
  description: string;
  chapters: string[];
  aiSource: string;
  audioUrl: string;
}

const PODCASTS: PodcastData[] = [
  {
    id: 1,
    title: "Meta Integrates Manus AI into Ads Manager",
    topic: "AI Agents",
    host: "Kore & Puck",
    durationSec: 73,
    plays: "1.3K",
    likes: 1283,
    color: "#1a0a2e",
    accent: "#7c3aed",
    gradient: "linear-gradient(135deg, #1a0a2e 0%, #2d1040 50%, #3b1260 100%)",
    waveColor: "#db2777",
    iconUrl: "/icons/meta.svg",
    description:
      "Meta embeds autonomous agent Manus AI into Ads Manager, enabling multistep tasks like market research and campaign analysis.",
    chapters: ["Breaking News", "Manus AI Deep Dive", "Impact on Advertisers", "What's Next"],
    aiSource: "AI news briefing",
    audioUrl: "/audio/podcast-1.wav",
  },
  {
    id: 2,
    title: "Anthropic Launches Enterprise Plugins for Claude",
    topic: "Enterprise AI",
    host: "Kore & Puck",
    durationSec: 73,
    plays: "856",
    likes: 856,
    color: "#0d1b2a",
    accent: "#06b6d4",
    gradient: "linear-gradient(135deg, #0d1b2a 0%, #0f2840 50%, #102a4a 100%)",
    waveColor: "#2563eb",
    iconUrl: "/icons/anthropic.svg",
    description:
      "Anthropic introduces customizable plugins letting Claude operate autonomously within Excel, PowerPoint, and Google Drive.",
    chapters: ["Plugin Architecture", "Office Integration", "Security Model", "Market Impact"],
    aiSource: "AI news briefing",
    audioUrl: "/audio/podcast-2.wav",
  },
  {
    id: 3,
    title: "Google Reclaims Frontier Lead with Gemini 3.1",
    topic: "Frontier Models",
    host: "Kore & Puck",
    durationSec: 89,
    plays: "2.1K",
    likes: 2104,
    color: "#0a1e0a",
    accent: "#059669",
    gradient: "linear-gradient(135deg, #0a1e0a 0%, #0f2e16 50%, #153520 100%)",
    waveColor: "#84cc16",
    iconUrl: "/icons/google.svg",
    description:
      "Google regains the frontier model lead with Gemini 3.1 Pro, hitting 77.1% on ARC-AGI-2 benchmark.",
    chapters: ["Benchmark Results", "Architecture Changes", "Competition Analysis", "Industry Impact"],
    aiSource: "AI news briefing",
    audioUrl: "/audio/podcast-3.wav",
  },
  {
    id: 4,
    title: "Perplexity Launches AI Digital Employee",
    topic: "AI Automation",
    host: "Kore & Puck",
    durationSec: 83,
    plays: "967",
    likes: 967,
    color: "#1b1208",
    accent: "#ea580c",
    gradient: "linear-gradient(135deg, #1b1208 0%, #2d1e0e 50%, #3d2810 100%)",
    waveColor: "#facc15",
    iconUrl: "/icons/perplexity.svg",
    description:
      "Perplexity Computer coordinates 19 AI models to execute complex workflows as a \"digital employee\" system.",
    chapters: ["System Overview", "Multi-Model Coordination", "Use Cases", "Future Outlook"],
    aiSource: "AI news briefing",
    audioUrl: "/audio/podcast-4.wav",
  },
  {
    id: 5,
    title: "Airbnb Quietly Deploys AI Customer Support",
    topic: "Customer AI",
    host: "Kore & Puck",
    durationSec: 71,
    plays: "1.5K",
    likes: 1547,
    color: "#0d1a2e",
    accent: "#06b6d4",
    gradient: "linear-gradient(135deg, #0d1a2e 0%, #1a2540 50%, #1e3050 100%)",
    waveColor: "#7c3aed",
    iconUrl: "/icons/airbnb.svg",
    description:
      "Airbnb rolls out an AI assistant resolving a third of all customer issues before a human gets involved.",
    chapters: ["Rollout Strategy", "Resolution Rates", "Customer Feedback", "Scaling Plans"],
    aiSource: "AI news briefing",
    audioUrl: "/audio/podcast-5.wav",
  },
  {
    id: 6,
    title: "Microsoft Previews Copilot Tasks Agent",
    topic: "Productivity AI",
    host: "Kore & Puck",
    durationSec: 76,
    plays: "3.2K",
    likes: 3201,
    color: "#1a0a20",
    accent: "#9333ea",
    gradient: "linear-gradient(135deg, #1a0a20 0%, #2a1040 50%, #351455 100%)",
    waveColor: "#db2777",
    iconUrl: "/icons/microsoft.svg",
    description:
      "Microsoft unveils Copilot Tasks, a cloud-hosted AI system completing recurring assignments autonomously.",
    chapters: ["Task Agent Overview", "Cloud Architecture", "Enterprise Features", "Roadmap"],
    aiSource: "AI news briefing",
    audioUrl: "/audio/podcast-6.wav",
  },
];

const formatNumber = (n: number): string => {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
};

const formatTime = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

const formatDuration = (sec: number): string => {
  const m = Math.ceil(sec / 60);
  return `${m} min`;
};

/* ── Animated Waveform ── */
const Waveform = ({ color, playing, small }: { color: string; playing: boolean; small?: boolean }) => {
  const bars = small ? 20 : 40;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: small ? 1.5 : 2, height: small ? 20 : 48 }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          style={{
            width: small ? 2 : 3,
            borderRadius: 2,
            background: color || "#fff",
            opacity: playing ? 0.9 : 0.3,
            height: playing ? undefined : small ? 4 : 8,
            animation: playing ? `wave 1.2s ease-in-out ${i * 0.05}s infinite alternate` : "none",
            minHeight: small ? 3 : 4,
            maxHeight: small ? 20 : 48,
            transition: "all 0.4s ease",
          }}
        />
      ))}
    </div>
  );
};

/* ── Main App ── */
export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [showChapters, setShowChapters] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const touchStart = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const current = PODCASTS[currentIndex];

  // Sync audio playback state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = current.audioUrl;
    audio.currentTime = 0;
    setCurrentTime(0);
    if (playing) {
      audio.play().catch(() => setPlaying(false));
    }
  }, [currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const prog = current.durationSec > 0 ? currentTime / current.durationSec : 0;

  const goTo = useCallback(
    (dir: number) => {
      const next = currentIndex + dir;
      if (next < 0 || next >= PODCASTS.length || transitioning) return;
      setDirection(dir);
      setTransitioning(true);
      setPlaying(false);
      setShowChapters(false);
      setTimeout(() => {
        setCurrentIndex(next);
        setTransitioning(false);
      }, 350);
    },
    [currentIndex, transitioning]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const diff = touchStart.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 60) goTo(diff > 0 ? 1 : -1);
    touchStart.current = null;
  };
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) > 30) goTo(e.deltaY > 0 ? 1 : -1);
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * current.durationSec;
    setCurrentTime(audio.currentTime);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 430,
        height: "100dvh",
        maxHeight: 932,
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
        borderRadius: 24,
        fontFamily: "'DM Sans', 'SF Pro Display', -apple-system, sans-serif",
        userSelect: "none",
        background: "#000",
        boxShadow: "0 0 80px rgba(0,0,0,0.8)",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto" />

      {/* ── Background ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: current.gradient,
          transition: "background 0.5s ease",
          zIndex: 0,
        }}
      />
      {/* Noise overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          zIndex: 1,
        }}
      />
      {/* Accent glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: current.accent,
          opacity: playing ? 0.08 : 0.04,
          filter: "blur(100px)",
          transition: "all 1s ease",
          zIndex: 1,
        }}
      />

      {/* ── Status Bar ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px 8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: current.accent,
              animation: playing ? "breathe 2s ease infinite" : "none",
            }}
          />
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase" }}>
            Airwave
          </span>
        </div>
        <button
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 20,
            padding: "6px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "rgba(255,255,255,0.7)",
            fontSize: 12,
            fontFamily: "inherit",
            fontWeight: 500,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create
        </button>
      </div>

      {/* ── Main Card ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "0 20px",
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? `translateY(${direction > 0 ? -60 : 60}px)` : "translateY(0)",
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Topic Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span
            style={{
              padding: "5px 14px",
              borderRadius: 20,
              background: `${current.accent}18`,
              border: `1px solid ${current.accent}30`,
              color: current.accent,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            {current.topic}
          </span>
          <span
            style={{
              padding: "5px 10px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.5)",
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            AI Generated
          </span>
        </div>

        {/* Cover Art */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "4/3.2",
            borderRadius: 20,
            background: current.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
            overflow: "hidden",
            animation: playing ? "pulseGlow 4s ease infinite" : "none",
          }}
        >
          {/* Abstract art background */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.15 }}>
            <div
              style={{
                position: "absolute",
                width: "120%",
                height: "120%",
                top: "-10%",
                left: "-10%",
                background: `radial-gradient(circle at 30% 40%, ${current.accent}40 0%, transparent 50%), radial-gradient(circle at 70% 60%, ${current.accent}30 0%, transparent 40%), radial-gradient(circle at 50% 80%, ${current.accent}20 0%, transparent 60%)`,
                animation: playing ? "spin 30s linear infinite" : "none",
              }}
            />
          </div>
          {/* Geometric lines */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.06 }}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: `${15 + i * 15}%`,
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${current.accent}, transparent)`,
                }}
              />
            ))}
          </div>
          {/* Company icon */}
          <img
            src={current.iconUrl}
            alt=""
            style={{
              width: 72,
              height: 72,
              filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.3)) brightness(0) invert(1)",
              opacity: 0.9,
              animation: playing ? "breathe 3s ease infinite" : "none",
              position: "relative",
              zIndex: 2,
            }}
          />
          {/* Source badge */}
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              padding: "6px 12px",
              borderRadius: 12,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={current.accent} strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>{current.aiSource}</span>
          </div>
          {/* Duration badge */}
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              padding: "6px 12px",
              borderRadius: 12,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {formatDuration(current.durationSec)}
          </div>
          {/* Scroll dots */}
          <div
            style={{
              position: "absolute",
              right: 16,
              bottom: 16,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {PODCASTS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 4,
                  height: i === currentIndex ? 20 : 4,
                  borderRadius: 2,
                  background: i === currentIndex ? current.accent : "rgba(255,255,255,0.3)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* Title & Info */}
        <div style={{ marginBottom: 8 }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 26,
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 8px",
              lineHeight: 1.2,
              letterSpacing: -0.5,
            }}
          >
            {current.title}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${current.accent}80, ${current.accent})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 500 }}>{current.host}</span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{current.plays} plays</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, margin: 0, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {current.description}
          </p>
        </div>

        {/* Waveform + Progress */}
        <div style={{ margin: "16px 0 8px" }}>
          <Waveform color={current.waveColor} playing={playing} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontVariantNumeric: "tabular-nums" }}>
              {formatTime(currentTime)}
            </span>
            <div
              onClick={seekTo}
              style={{ flex: 1, height: 3, margin: "0 12px", borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden", cursor: "pointer" }}
            >
              <div style={{ height: "100%", width: `${prog * 100}%`, borderRadius: 2, background: current.accent, transition: "width 0.3s ease" }} />
            </div>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{formatTime(current.durationSec)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28, margin: "12px 0" }}>
          {/* Rewind */}
          <button onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
              <polygon points="11 19 2 12 11 5 11 19" />
              <polygon points="22 19 13 12 22 5 22 19" />
            </svg>
          </button>
          {/* Play/Pause */}
          <button
            onClick={() => setPlaying(!playing)}
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: current.accent,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 30px ${current.accent}50`,
              transition: "all 0.2s ease",
            }}
          >
            {playing ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: 2 }}>
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>
          {/* Forward */}
          <button onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.min(current.durationSec, audioRef.current.currentTime + 10); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
              <polygon points="13 19 22 12 13 5 13 19" />
              <polygon points="2 19 11 12 2 5 2 19" />
            </svg>
          </button>
        </div>

        {/* Action Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", marginTop: 4 }}>
          {/* Left actions */}
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {/* Like */}
            <button
              onClick={() => setLiked((p) => ({ ...p, [current.id]: !p[current.id] }))}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill={liked[current.id] ? current.accent : "none"}
                stroke={liked[current.id] ? current.accent : "rgba(255,255,255,0.5)"}
                strokeWidth="2"
                style={{ transition: "all 0.2s ease" }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span style={{ color: liked[current.id] ? current.accent : "rgba(255,255,255,0.4)", fontSize: 10 }}>
                {formatNumber(current.likes + (liked[current.id] ? 1 : 0))}
              </span>
            </button>
            {/* Comment */}
            <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>Chat</span>
            </button>
            {/* Save */}
            <button
              onClick={() => setSaved((p) => ({ ...p, [current.id]: !p[current.id] }))}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill={saved[current.id] ? "rgba(255,255,255,0.9)" : "none"}
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>Save</span>
            </button>
            {/* Share */}
            <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>Share</span>
            </button>
          </div>
          {/* Chapters button */}
          <button
            onClick={() => setShowChapters(!showChapters)}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: "8px 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "rgba(255,255,255,0.6)",
              fontSize: 12,
              fontFamily: "inherit",
              fontWeight: 500,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            Chapters
          </button>
        </div>

        {/* Speed control row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, margin: "8px 0 0", paddingBottom: 24 }}>
          {["0.5x", "1x", "1.5x", "2x"].map((s) => (
            <button
              key={s}
              style={{
                background: s === "1x" ? "rgba(255,255,255,0.1)" : "transparent",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "4px 14px",
                color: s === "1x" ? "#fff" : "rgba(255,255,255,0.35)",
                fontSize: 12,
                fontFamily: "inherit",
                fontWeight: s === "1x" ? 600 : 400,
                cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Chapters Panel ── */}
      {showChapters && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            background: "rgba(10,10,15,0.95)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            borderRadius: "24px 24px 0 0",
            padding: "20px 20px 24px",
            animation: "slideChapters 0.3s ease",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>Chapters</span>
            <button
              onClick={() => setShowChapters(false)}
              style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          {current.chapters.map((ch, i) => {
            const chProg = prog * current.chapters.length;
            const isDone = i < Math.floor(chProg);
            const isCurrent = i === Math.floor(chProg);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 0",
                  borderBottom: i < current.chapters.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: isDone ? current.accent : isCurrent ? `${current.accent}30` : "rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {isDone ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span style={{ color: isCurrent ? current.accent : "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 600 }}>{i + 1}</span>
                  )}
                </div>
                <span style={{ color: isCurrent ? "#fff" : "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: isCurrent ? 600 : 400 }}>{ch}</span>
                {isCurrent && <Waveform color={current.accent} playing={playing} small />}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Swipe hint ── */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          opacity: currentIndex === 0 && !playing ? 0.4 : 0,
          transition: "opacity 1s ease",
          pointerEvents: "none",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
        <span style={{ color: "#fff", fontSize: 10, letterSpacing: 1 }}>Swipe up</span>
      </div>
    </div>
  );
}
