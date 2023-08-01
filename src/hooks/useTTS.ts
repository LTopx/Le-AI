import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import {
  SpeechConfig,
  SpeechSynthesizer,
  AudioConfig,
  SpeakerAudioDestination,
} from "microsoft-cognitiveservices-speech-sdk";

export type TTSRate = "x-slow" | "slow" | "medium" | "fast" | "x-fast";

type AutoPlay = "0" | "1";

interface TTSStore {
  voice: string;
  voices: any[];
  rate: TTSRate;
  autoPlay: AutoPlay;
  player: SpeakerAudioDestination | null;
  config: SpeechConfig | null;
  synth: SpeechSynthesizer | null;

  updateVoice: (voice: string) => void;
  updateVoices: (voices: string[]) => void;
  updateRate: (rate: TTSRate) => void;
  updateAutoPlay: (autoPlay: AutoPlay) => void;
  speak: (content: string, cb?: () => void) => void;
  pause: () => void;
}

const TTS_KEY = process.env.NEXT_PUBLIC_AZURE_TTS_KEY || "";
const TTS_REGION = process.env.NEXT_PUBLIC_AZURE_TTS_REGION || "";

export const useTTSStore = createWithEqualityFn<TTSStore>(
  (set) => ({
    voice: "zh-CN-XiaoxiaoNeural",
    voices: [],
    rate: "medium",
    autoPlay: "0",
    player: null,
    config: null,
    synth: null,

    updateVoice: (voice) => {
      localStorage.setItem("voice", voice);
      set({ voice });
    },
    updateVoices: (voices) => {
      localStorage.setItem("voices", JSON.stringify(voices));
      set({ voices });
    },
    updateRate: (rate) => {
      localStorage.setItem("voiceRate", rate);
      set({ rate });
    },
    updateAutoPlay: (autoPlay) => {
      localStorage.setItem("autoPlay", autoPlay);
      set({ autoPlay });
    },
    pause: () => {
      set((state) => {
        state.player?.pause();
        return {};
      });
    },
    speak: (content, cb) => {
      return new Promise((resolve, reject) => {
        set((state) => {
          try {
            state.player?.pause();
            const player = new SpeakerAudioDestination();
            set({ player });

            const audioConfig = AudioConfig.fromSpeakerOutput(player);
            let config: SpeechConfig | null = state.config;
            if (!config) {
              config = SpeechConfig.fromSubscription(TTS_KEY, TTS_REGION);
              set({ config });
            }

            const synthesizer = new SpeechSynthesizer(config, audioConfig);
            const ssml = `
            <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
              <voice name="${state.voice}">
                <prosody rate="${state.rate}">
                  ${content}
                </prosody>
              </voice>
            </speak>
          `;

            synthesizer.speakSsmlAsync(ssml, (res: any) => {
              resolve(res);
              synthesizer?.close();
            });

            player.onAudioEnd = () => {
              cb?.();
            };
          } catch (error) {
            reject(error);
          }
          return {};
        });
      });
    },
  }),
  shallow
);

export const useTTSInit = () => {
  const updateVoice = useTTSStore((state) => state.updateVoice);
  const updateVoices = useTTSStore((state) => state.updateVoices);
  const updateRate = useTTSStore((state) => state.updateRate);
  const updateAutoPlay = useTTSStore((state) => state.updateAutoPlay);

  const init = () => {
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
    if (localAutoPlay !== "0" && localAutoPlay !== "1") {
      updateAutoPlay("0");
    } else {
      updateAutoPlay(localAutoPlay);
    }
  };

  return init;
};
