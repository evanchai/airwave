import { useState, useCallback } from 'react'
import Feed from './components/Feed'
import CreatePage from './components/CreatePage'
import { mockPodcasts } from './data/mockPodcasts'
import type { Podcast } from './data/mockPodcasts'

const GRADIENTS: [string, string][] = [
  ['#7c3aed', '#db2777'],
  ['#2563eb', '#06b6d4'],
  ['#059669', '#84cc16'],
  ['#ea580c', '#facc15'],
  ['#7c3aed', '#06b6d4'],
  ['#db2777', '#9333ea'],
]

function App() {
  const [showCreate, setShowCreate] = useState(false)
  const [podcasts, setPodcasts] = useState<Podcast[]>(mockPodcasts)

  const handleCreateComplete = useCallback((result: { title: string; audioUrl: string; duration: number }) => {
    const newPodcast: Podcast = {
      id: `user-${Date.now()}`,
      title: result.title,
      description: 'AI-generated podcast from your text',
      author: 'You',
      authorAvatar: 'Y',
      duration: result.duration,
      likes: 0,
      gradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
      audioUrl: result.audioUrl,
    }

    setPodcasts((prev) => [newPodcast, ...prev])
    setShowCreate(false)
  }, [])

  if (showCreate) {
    return (
      <div className="h-dvh bg-black text-white overflow-hidden">
        <CreatePage
          onComplete={handleCreateComplete}
          onBack={() => setShowCreate(false)}
        />
      </div>
    )
  }

  return (
    <div className="h-dvh bg-black text-white overflow-hidden relative">
      <Feed podcasts={podcasts} />

      {/* Floating create button */}
      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-8 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30 active:scale-90 transition-transform"
      >
        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>
  )
}

export default App
