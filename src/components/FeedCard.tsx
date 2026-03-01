import { useState, useRef, useEffect, useCallback } from 'react'
import type { Podcast } from '../data/mockPodcasts'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

interface Props {
  podcast: Podcast
  isActive: boolean
}

export default function FeedCard({ podcast, isActive }: Props) {
  const [isLiked, setIsLiked] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(podcast.duration)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const rafRef = useRef<number>(0)
  const hasAudio = !!podcast.audioUrl

  // Create audio element for real audio
  useEffect(() => {
    if (!hasAudio) return

    const audio = new Audio(podcast.audioUrl)
    audioRef.current = audio

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
    })
    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      setCurrentTime(0)
    })

    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [podcast.audioUrl, hasAudio])

  // Sync play/pause with audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying])

  // Update currentTime from audio
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    const tick = () => {
      if (audioRef.current && hasAudio) {
        setCurrentTime(audioRef.current.currentTime)
      } else {
        // Mock: simulate progress
        setCurrentTime((prev) => Math.min(prev + 0.05, duration))
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isPlaying, duration, hasAudio])

  // Auto-play/pause on card visibility
  useEffect(() => {
    if (isActive && hasAudio) {
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
      if (!isActive) {
        setCurrentTime(0)
        if (audioRef.current) audioRef.current.currentTime = 0
      }
    }
  }, [isActive, hasAudio])

  const togglePlay = useCallback(() => {
    if (!hasAudio) return
    setIsPlaying((p) => !p)
  }, [hasAudio])

  const progress = duration > 0 ? currentTime / duration : 0

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${podcast.gradient[0]}33 0%, ${podcast.gradient[1]}33 50%, #000 100%)`,
        }}
      />

      {/* Animated orbs */}
      <div
        className="absolute w-64 h-64 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{
          background: podcast.gradient[0],
          top: '15%',
          right: '-10%',
          animationDuration: '4s',
        }}
      />
      <div
        className="absolute w-48 h-48 rounded-full blur-3xl opacity-15 animate-pulse"
        style={{
          background: podcast.gradient[1],
          bottom: '25%',
          left: '-5%',
          animationDuration: '5s',
          animationDelay: '1s',
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col p-6 pb-8">
        {/* Center area — brand avatar */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="relative group"
          >
            {/* Outer glow */}
            <div
              className={`absolute -inset-6 rounded-full blur-2xl transition-opacity duration-700 ${isPlaying ? 'opacity-50' : 'opacity-20'}`}
              style={{ background: `linear-gradient(135deg, ${podcast.gradient[0]}, ${podcast.gradient[1]})` }}
            />

            {/* Spinning border ring when playing */}
            <div
              className={`absolute -inset-3 rounded-full transition-opacity duration-500 ${isPlaying ? 'opacity-100 animate-spin' : 'opacity-0'}`}
              style={{
                background: `conic-gradient(from 0deg, ${podcast.gradient[0]}, ${podcast.gradient[1]}, transparent)`,
                animationDuration: '3s',
              }}
            />
            <div className={`absolute -inset-3 rounded-full bg-black/80 ${isPlaying ? 'scale-[0.96]' : ''}`} />

            {/* Brand icon */}
            <div className="relative w-36 h-36 rounded-full overflow-hidden shadow-2xl transition-transform duration-300 group-active:scale-95">
              {podcast.iconUrl ? (
                <img
                  src={podcast.iconUrl}
                  alt={podcast.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-3xl font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${podcast.gradient[0]}, ${podcast.gradient[1]})` }}
                >
                  {podcast.authorAvatar}
                </div>
              )}

              {/* Play/pause overlay */}
              <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-200 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {isPlaying ? (
                  <svg className="w-12 h-12 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg className="w-12 h-12 text-white ml-1 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Bottom info */}
        <div>
          {/* Author */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{
                background: `linear-gradient(135deg, ${podcast.gradient[0]}, ${podcast.gradient[1]})`,
              }}
            >
              {podcast.authorAvatar}
            </div>
            <span className="text-sm font-medium text-white/90">{podcast.author}</span>
            {!hasAudio && (
              <span className="text-[10px] text-white/30 bg-white/10 px-2 py-0.5 rounded-full">DEMO</span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
            {podcast.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-white/60 mb-5 line-clamp-2">
            {podcast.description}
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-white/50 w-10 text-right tabular-nums">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-100"
              style={{
                width: `${progress * 100}%`,
                background: `linear-gradient(to right, ${podcast.gradient[0]}, ${podcast.gradient[1]})`,
              }}
            />
          </div>
          <span className="text-xs text-white/50 w-10 tabular-nums">
            {formatTime(duration)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            <svg
              className={`w-6 h-6 transition-colors ${isLiked ? 'text-red-500' : 'text-white/70'}`}
              fill={isLiked ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={isLiked ? 0 : 1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span className={`text-sm ${isLiked ? 'text-red-500' : 'text-white/50'}`}>
              {(podcast.likes + (isLiked ? 1 : 0)).toLocaleString()}
            </span>
          </button>

          <div className="flex items-center gap-1.5 text-white/50">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
            <span className="text-sm">Host & Guest</span>
          </div>

          <span className="text-sm text-white/30 ml-auto">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  )
}
