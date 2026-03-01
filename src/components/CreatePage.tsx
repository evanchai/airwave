import { useState, useCallback, useEffect, useRef } from 'react'
import { GoogleGenAI } from '@google/genai'

type Step = 'input' | 'generating-script' | 'generating-audio' | 'done' | 'error'

const SCRIPT_PROMPT = `You are a podcast script writer. Convert the following text into a short, engaging two-person podcast dialogue.

The hosts are:
- "Host": The main presenter who introduces topics
- "Guest": An insightful commentator

Rules:
- Conversational and natural
- Keep each line SHORT (1-2 sentences max)
- Total: 8-12 exchanges ONLY (keep it brief!)
- Start with a quick intro, end with a brief wrap-up
- Output ONLY a valid JSON array: [{"speaker":"Host","text":"..."},{"speaker":"Guest","text":"..."}]
- Speaker must be exactly "Host" or "Guest"

Text to convert:
`

function pcmToWav(pcmData: Uint8Array): Blob {
  const sampleRate = 24000
  const numChannels = 1
  const bitsPerSample = 16
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8)
  const blockAlign = numChannels * (bitsPerSample / 8)
  const dataSize = pcmData.byteLength

  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i))
    }
  }

  writeStr(0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeStr(8, 'WAVE')
  writeStr(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitsPerSample, true)
  writeStr(36, 'data')
  view.setUint32(40, dataSize, true)

  new Uint8Array(buffer, 44).set(pcmData)

  return new Blob([buffer], { type: 'audio/wav' })
}

interface GeneratedPodcast {
  title: string
  audioUrl: string
  duration: number
}

interface Props {
  onComplete: (podcast: GeneratedPodcast) => void
  onBack: () => void
}

export default function CreatePage({ onComplete, onBack }: Props) {
  const [text, setText] = useState('')
  const [step, setStep] = useState<Step>('input')
  const [errorMsg, setErrorMsg] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval>>(null)

  const isGenerating = step === 'generating-script' || step === 'generating-audio'

  // Elapsed time counter
  useEffect(() => {
    if (isGenerating) {
      setElapsed(0)
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isGenerating])

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) return

    setStep('generating-script')
    setErrorMsg('')

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey) throw new Error('VITE_GEMINI_API_KEY not set')

      const ai = new GoogleGenAI({ apiKey })

      // Step 1: Generate dialogue script
      const scriptResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: SCRIPT_PROMPT + text.slice(0, 30000) }] }],
        config: {
          responseMimeType: 'application/json',
          maxOutputTokens: 4096,
        },
      })

      const scriptText = scriptResponse.text || '[]'
      const dialogue: { speaker: string; text: string }[] = JSON.parse(scriptText)
      if (!Array.isArray(dialogue) || dialogue.length === 0) {
        throw new Error('Failed to generate dialogue script')
      }

      console.log(`Generated ${dialogue.length} dialogue lines`)

      // Step 2: Generate TTS audio
      setStep('generating-audio')
      const ttsScript = dialogue
        .map((line) => `${line.speaker}: ${line.text}`)
        .join('\n')

      const ttsResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text: `TTS the following conversation between Host and Guest:\n${ttsScript}` }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            multiSpeakerVoiceConfig: {
              speakerVoiceConfigs: [
                {
                  speaker: 'Host',
                  voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                },
                {
                  speaker: 'Guest',
                  voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
                },
              ],
            },
          },
        },
      })

      // Extract audio
      const candidate = ttsResponse.candidates?.[0]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parts = candidate?.content?.parts as any[] | undefined
      const audioPart = parts?.find((p) => p.inlineData?.mimeType?.startsWith('audio/'))

      if (!audioPart?.inlineData?.data) {
        throw new Error('TTS generation failed - no audio data returned')
      }

      // Decode base64 PCM to WAV
      const binaryStr = atob(audioPart.inlineData.data)
      const bytes = new Uint8Array(binaryStr.length)
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i)
      }

      const wavBlob = pcmToWav(bytes)
      const audioUrl = URL.createObjectURL(wavBlob)

      // Get duration
      const duration = await new Promise<number>((resolve) => {
        const audio = new Audio(audioUrl)
        audio.addEventListener('loadedmetadata', () => resolve(audio.duration))
        audio.addEventListener('error', () => resolve(0))
      })

      // Auto-title from first 50 chars
      const title = text.trim().slice(0, 50).replace(/\n/g, ' ') + (text.length > 50 ? '...' : '')

      setStep('done')
      onComplete({ title, audioUrl, duration })
    } catch (e) {
      console.error('Generation failed:', e)
      setErrorMsg(e instanceof Error ? e.message : 'Unknown error')
      setStep('error')
    }
  }, [text, onComplete])

  return (
    <div className="h-full bg-black flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-14 pb-4">
        <button onClick={onBack} className="text-white/60 text-sm active:opacity-50">
          Cancel
        </button>
        <h1 className="text-lg font-semibold">Create Podcast</h1>
        <div className="w-12" />
      </header>

      {/* Generating overlay */}
      {isGenerating && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
          {/* Waveform animation */}
          <div className="flex items-end gap-1 h-20">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-gradient-to-t from-violet-600 to-fuchsia-500"
                style={{
                  animation: 'waveform 0.8s ease-in-out infinite alternate',
                  animationDelay: `${i * 0.04}s`,
                  height: '16px',
                }}
              />
            ))}
          </div>

          <div className="text-center">
            <p className="text-lg font-medium mb-2">
              {step === 'generating-script' ? 'Writing the script...' : 'Creating AI voices...'}
            </p>
            <p className="text-sm text-white/40">
              {step === 'generating-script'
                ? 'AI is crafting a dialogue between two hosts'
                : 'Generating natural-sounding speech (~30s)'}
            </p>
            <p className="text-xs text-white/20 mt-3 tabular-nums">{elapsed}s</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${step === 'generating-script' ? 'bg-violet-500 animate-pulse' : 'bg-violet-500'}`} />
            <div className="w-8 h-px bg-white/20" />
            <div className={`w-2 h-2 rounded-full ${step === 'generating-audio' ? 'bg-fuchsia-500 animate-pulse' : 'bg-white/20'}`} />
          </div>
        </div>
      )}

      {/* Input form */}
      {!isGenerating && (
        <div className="flex-1 flex flex-col px-5 pb-20 gap-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste an article, notes, or any text here...&#10;&#10;AI will turn it into a two-person podcast conversation."
            disabled={isGenerating}
            autoFocus
            className="flex-1 min-h-[200px] bg-neutral-900/50 border border-white/10 rounded-2xl p-4 text-[15px] leading-relaxed text-white placeholder:text-white/25 resize-none focus:outline-none focus:border-violet-500/40 transition-colors"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-white/30">
              {text.length.toLocaleString()} chars
            </span>
            {text.length > 30000 && (
              <span className="text-xs text-amber-400">Max 30,000 chars</span>
            )}
          </div>

          {/* Error */}
          {step === 'error' && (
            <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-4 text-sm text-red-300">
              {errorMsg}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!text.trim() || text.length > 30000}
            className="w-full py-4 rounded-2xl font-semibold text-[15px] transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 active:scale-[0.98]"
          >
            Generate Podcast
          </button>
        </div>
      )}
    </div>
  )
}
