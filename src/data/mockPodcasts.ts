export interface Podcast {
  id: string
  title: string
  description: string
  author: string
  authorAvatar: string
  duration: number // seconds
  likes: number
  gradient: [string, string]
  audioUrl?: string
  iconUrl?: string
}

export const mockPodcasts: Podcast[] = [
  {
    id: '1',
    title: 'Meta Integrates Manus AI into Ads Manager',
    description: 'Meta embeds autonomous agent Manus AI into Ads Manager, enabling multistep tasks like market research and campaign analysis.',
    author: 'Airwave',
    authorAvatar: 'AW',
    duration: 73,
    likes: 1283,
    gradient: ['#7c3aed', '#db2777'],
    audioUrl: '/audio/podcast-1.wav',
    iconUrl: '/icons/meta.svg',
  },
  {
    id: '2',
    title: 'Anthropic Launches Enterprise Plugins for Claude',
    description: 'Anthropic introduces customizable plugins letting Claude operate autonomously within Excel, PowerPoint, and Google Drive.',
    author: 'Airwave',
    authorAvatar: 'AW',
    duration: 73,
    likes: 856,
    gradient: ['#2563eb', '#06b6d4'],
    audioUrl: '/audio/podcast-2.wav',
    iconUrl: '/icons/anthropic.svg',
  },
  {
    id: '3',
    title: 'Google Reclaims Frontier Lead with Gemini 3.1',
    description: 'Google regains the frontier model lead with Gemini 3.1 Pro, hitting 77.1% on ARC-AGI-2 benchmark.',
    author: 'Airwave',
    authorAvatar: 'AW',
    duration: 89,
    likes: 2104,
    gradient: ['#059669', '#84cc16'],
    audioUrl: '/audio/podcast-3.wav',
    iconUrl: '/icons/google.svg',
  },
  {
    id: '4',
    title: 'Perplexity Launches AI Digital Employee',
    description: 'Perplexity Computer coordinates 19 AI models to execute complex workflows as a "digital employee" system.',
    author: 'Airwave',
    authorAvatar: 'AW',
    duration: 83,
    likes: 967,
    gradient: ['#ea580c', '#facc15'],
    audioUrl: '/audio/podcast-4.wav',
    iconUrl: '/icons/perplexity.svg',
  },
  {
    id: '5',
    title: 'Airbnb Quietly Deploys AI Customer Support',
    description: 'Airbnb rolls out an AI assistant resolving a third of all customer issues before a human gets involved.',
    author: 'Airwave',
    authorAvatar: 'AW',
    duration: 71,
    likes: 1547,
    gradient: ['#7c3aed', '#06b6d4'],
    audioUrl: '/audio/podcast-5.wav',
    iconUrl: '/icons/airbnb.svg',
  },
  {
    id: '6',
    title: 'Microsoft Previews Copilot Tasks Agent',
    description: 'Microsoft unveils Copilot Tasks, a cloud-hosted AI system completing recurring assignments autonomously.',
    author: 'Airwave',
    authorAvatar: 'AW',
    duration: 76,
    likes: 3201,
    gradient: ['#db2777', '#9333ea'],
    audioUrl: '/audio/podcast-6.wav',
    iconUrl: '/icons/microsoft.svg',
  },
]
