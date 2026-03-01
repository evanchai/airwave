export type View = 'feed' | 'create' | 'profile'

interface Props {
  current: View
  onNavigate: (view: View) => void
}

export default function BottomNav({ current, onNavigate }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10">
      <div className="flex items-center justify-around max-w-lg mx-auto h-14 pb-safe-bottom">
        {/* Feed */}
        <button
          onClick={() => onNavigate('feed')}
          className="flex flex-col items-center gap-0.5 px-6 py-1.5"
        >
          <svg
            className={`w-6 h-6 transition-colors ${current === 'feed' ? 'text-white' : 'text-white/40'}`}
            fill={current === 'feed' ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={current === 'feed' ? 0 : 1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <span className={`text-[10px] ${current === 'feed' ? 'text-white' : 'text-white/40'}`}>
            Feed
          </span>
        </button>

        {/* Create (center + button) */}
        <button
          onClick={() => onNavigate('create')}
          className="relative -mt-4"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30 active:scale-90 transition-transform">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
        </button>

        {/* Profile */}
        <button
          onClick={() => onNavigate('profile')}
          className="flex flex-col items-center gap-0.5 px-6 py-1.5"
        >
          <svg
            className={`w-6 h-6 transition-colors ${current === 'profile' ? 'text-white' : 'text-white/40'}`}
            fill={current === 'profile' ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={current === 'profile' ? 0 : 1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <span className={`text-[10px] ${current === 'profile' ? 'text-white' : 'text-white/40'}`}>
            Me
          </span>
        </button>
      </div>
    </nav>
  )
}
