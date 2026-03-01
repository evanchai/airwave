import { useState, useCallback } from 'react'
import Feed from './components/Feed'
import CreatePage from './components/CreatePage'
import BottomNav from './components/BottomNav'
import type { View } from './components/BottomNav'
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
  const [view, setView] = useState<View>('feed')
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

    // Add to the top of the feed
    setPodcasts((prev) => [newPodcast, ...prev])
    setView('feed')
  }, [])

  return (
    <div className="h-dvh bg-black text-white flex flex-col overflow-hidden">
      <div className="flex-1 overflow-hidden">
        {view === 'feed' && <Feed podcasts={podcasts} />}
        {view === 'create' && (
          <CreatePage
            onComplete={handleCreateComplete}
            onBack={() => setView('feed')}
          />
        )}
        {view === 'profile' && (
          <div className="h-full flex items-center justify-center text-white/40 text-sm">
            Profile — coming soon
          </div>
        )}
      </div>

      {view !== 'create' && (
        <BottomNav current={view} onNavigate={setView} />
      )}
    </div>
  )
}

export default App
