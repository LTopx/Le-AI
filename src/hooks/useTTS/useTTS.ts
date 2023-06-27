import * as React from "react";
import { create } from "zustand";
import {
  SpeechConfig,
  SpeechSynthesizer,
  SpeakerAudioDestination,
  AudioConfig,
} from "microsoft-cognitiveservices-speech-sdk";

export type TTSRate = "x-slow" | "slow" | "medium" | "fast" | "x-fast";

interface ITTS {
  voice: string;
  voices: any[];
  rate: TTSRate;

  updateVoice: (voice: string) => void;
  updateVoices: (voices: string[]) => void;
  updateRate: (rate: TTSRate) => void;
}

const key = process.env.NEXT_PUBLIC_AZURE_TTS_KEY || "";
const region = process.env.NEXT_PUBLIC_AZURE_TTS_REGION || "";

const useStore = create<ITTS>((set) => ({
  voice: "zh-CN-XiaoxiaoNeural",
  voices: [],
  rate: "medium",

  updateVoice: (voice: string) => {
    localStorage.setItem("voice", voice);
    set({ voice });
  },
  updateVoices: (voices: string[]) => {
    localStorage.setItem("voices", JSON.stringify(voices));
    set({ voices });
  },
  updateRate: (rate: TTSRate) => {
    localStorage.setItem("voiceRate", rate);
    set({ rate });
  },
}));

export const useTTS = () => {
  const configRef = React.useRef<SpeechConfig | null>(null);
  const playerRef = React.useRef<SpeakerAudioDestination | null>(null);
  const synthRef = React.useRef<SpeechSynthesizer | null>(null);

  const { voice, voices, rate } = useStore();

  const updateVoice = useStore((state) => state.updateVoice);
  const updateVoices = useStore((state) => state.updateVoices);
  const updateRate = useStore((state) => state.updateRate);

  const speak = (content: string, cb?: () => void) => {
    return new Promise((resolve, reject) => {
      try {
        pause();
        playerRef.current = new SpeakerAudioDestination();

        const audioConfig = AudioConfig.fromSpeakerOutput(playerRef.current);
        if (!configRef.current) {
          configRef.current = SpeechConfig.fromSubscription(key, region);
        }

        synthRef.current = new SpeechSynthesizer(
          configRef.current,
          audioConfig
        );

        const ssml = `
          <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
            <voice name="${voice}">
              <prosody rate="${rate}">
                ${content}
              </prosody>
            </voice>
          </speak>
        `;

        synthRef.current.speakSsmlAsync(ssml, (res: any) => {
          resolve(res);
          synthRef.current?.close();
        });

        playerRef.current.onAudioEnd = () => {
          cb?.();
        };
      } catch (error) {
        reject(error);
      }
    });
  };

  const pause = () => playerRef.current?.pause();

  React.useEffect(() => {
    const localVoice = localStorage.getItem("voice") || "zh-CN-XiaoxiaoNeural";
    const localVoices = localStorage.getItem("voices");
    const localRate = localStorage.getItem("voiceRate") || "medium";

    try {
      updateVoices(localVoices ? JSON.parse(localVoices) : []);
    } catch {
      updateVoices([]);
    }
    updateVoice(localVoice);
    updateRate(localRate as TTSRate);
  }, []);

  return {
    speak,
    pause,
    voice,
    voices,
    rate,
    updateVoice,
    updateVoices,
    updateRate,
  };
};
