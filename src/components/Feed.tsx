import { useState, useRef, useCallback, useEffect } from 'react'
import FeedCard from './FeedCard'
import type { Podcast } from '../data/mockPodcasts'

interface Props {
  podcasts: Podcast[]
}

export default function Feed({ podcasts }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const scrollTop = container.scrollTop
    const cardHeight = container.clientHeight
    const newIndex = Math.round(scrollTop / cardHeight)

    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < podcasts.length) {
      setActiveIndex(newIndex)
    }
  }, [activeIndex, podcasts.length])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <div
      ref={containerRef}
      className="h-full snap-y snap-mandatory overflow-y-scroll no-scrollbar overscroll-none"
    >
      {podcasts.map((podcast, index) => (
        <div
          key={podcast.id}
          className="h-full w-full snap-start snap-always"
        >
          <FeedCard
            podcast={podcast}
            isActive={index === activeIndex}
          />
        </div>
      ))}
    </div>
  )
}
