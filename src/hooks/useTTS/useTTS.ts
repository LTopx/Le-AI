import React from "react";
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
  player: SpeakerAudioDestination | null;
  // 0:false, 1:true
  autoPlay: string;

  updateVoice: (voice: string) => void;
  updateVoices: (voices: string[]) => void;
  updateRate: (rate: TTSRate) => void;
  updateAutoPlay: (autoPlay: string) => void;
  updatePlayer: (player: SpeakerAudioDestination | null) => void;
}

const key = process.env.NEXT_PUBLIC_AZURE_TTS_KEY || "";
const region = process.env.NEXT_PUBLIC_AZURE_TTS_REGION || "";

const useStore = create<ITTS>((set) => ({
  voice: "zh-CN-XiaoxiaoNeural",
  voices: [],
  rate: "medium",
  autoPlay: "0",
  player: null,

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
  updateAutoPlay: (autoPlay: string) => {
    localStorage.setItem("autoPlay", autoPlay);
    set({ autoPlay });
  },
  updatePlayer: (player: SpeakerAudioDestination | null) => {
    set({ player });
  },
}));

export const useTTS = () => {
  const configRef = React.useRef<SpeechConfig | null>(null);
  const synthRef = React.useRef<SpeechSynthesizer | null>(null);

  const { voice, voices, rate, autoPlay, player } = useStore();

  const updateVoice = useStore((state) => state.updateVoice);
  const updateVoices = useStore((state) => state.updateVoices);
  const updateRate = useStore((state) => state.updateRate);
  const updateAutoPlay = useStore((state) => state.updateAutoPlay);
  const updatePlayer = useStore((state) => state.updatePlayer);

  const speak = (content: string, cb?: () => void) => {
    return new Promise((resolve, reject) => {
      try {
        pause();
        const player = new SpeakerAudioDestination();
        updatePlayer(player);

        const audioConfig = AudioConfig.fromSpeakerOutput(player);
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

        player.onAudioEnd = () => {
          cb?.();
        };
      } catch (error) {
        reject(error);
      }
    });
  };

  const pause = React.useCallback(() => {
    player?.pause();
  }, [player]);

  React.useEffect(() => {
    const localVoice = localStorage.getItem("voice") || "zh-CN-XiaoxiaoNeural";
    const localVoices = localStorage.getItem("voices");
    const localRate = localStorage.getItem("voiceRate") || "medium";
    const localAutoPlay = localStorage.getItem("autoPlay") || "0";

    try {
      updateVoices(localVoices ? JSON.parse(localVoices) : []);
    } catch {
      updateVoices([]);
    }
    updateVoice(localVoice);
    updateRate(localRate as TTSRate);
    updateAutoPlay(localAutoPlay);
  }, []);

  return {
    speak,
    pause,
    voice,
    voices,
    rate,
    autoPlay,
    updateVoice,
    updateVoices,
    updateRate,
    updateAutoPlay,
  };
};
