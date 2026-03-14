import { GoogleGenAI } from "@google/genai";

export const config = { runtime: 'edge', maxDuration: 120 };

const SCRIPT_PROMPT = `You are a podcast script writer. Convert the following text into an engaging two-person podcast dialogue.

The hosts are:
- "Host": The main presenter who introduces topics and guides the conversation
- "Guest": An insightful commentator who adds perspectives and asks good questions

Rules:
- Make it conversational and natural, not robotic
- Include natural reactions like "Oh interesting!", "Right, that makes sense", "Hmm, let me think about that"
- Add natural transitions between topics
- Start with a brief intro welcoming listeners
- End with a brief wrap-up
- Each line should be 1-3 sentences max
- Total: 15-25 exchanges
- Output ONLY a valid JSON array of objects with "speaker" and "text" fields
- Speaker must be exactly "Host" or "Guest"

Example output format:
[
  {"speaker": "Host", "text": "Welcome to the show! Today we're diving into something really fascinating."},
  {"speaker": "Guest", "text": "Thanks for having me! I've been looking forward to discussing this."}
]

Text to convert into a podcast dialogue:
`;

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const origin = req.headers.get('origin') || req.headers.get('referer') || '';
  if (!origin.includes('airwave.ning.codes') && !origin.includes('localhost')) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let text: string;
  try {
    const body = await req.json();
    text = body.text;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!text || !text.trim()) {
    return new Response(JSON.stringify({ error: 'text is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    // Step 1: Generate dialogue script
    const scriptResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: SCRIPT_PROMPT + text.slice(0, 30000) }] }],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });

    const scriptText = scriptResponse.text || '[]';
    const dialogue: { speaker: string; text: string }[] = JSON.parse(scriptText);

    if (!Array.isArray(dialogue) || dialogue.length === 0) {
      throw new Error('Failed to generate dialogue script');
    }

    // Format as "Speaker: text" for TTS
    const ttsScript = dialogue
      .map((line) => `${line.speaker}: ${line.text}`)
      .join('\n');

    // Step 2: Generate TTS audio with multi-speaker
    const ttsResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
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
    });

    // Extract audio data
    const candidate = ttsResponse.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find(
      (p: Record<string, unknown>) => {
        const inlineData = p.inlineData as { mimeType?: string } | undefined;
        return inlineData?.mimeType?.toString().startsWith('audio/');
      }
    );

    const inlineData = audioPart?.inlineData as { data?: string; mimeType?: string } | undefined;

    if (!inlineData?.data) {
      throw new Error('TTS generation failed - no audio data returned');
    }

    // Decode base64 to binary
    const binaryStr = atob(inlineData.data);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    // Return raw PCM audio as binary
    return new Response(bytes.buffer, {
      headers: {
        'Content-Type': 'audio/L16;rate=24000;channels=1',
        'X-Dialogue-Length': String(dialogue.length),
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Generation failed';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
