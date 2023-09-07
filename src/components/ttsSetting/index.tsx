import React from "react";
import { useTranslations } from "next-intl";
import { Modal, Button, Tooltip, Select, Switch } from "@ltopx/lx-ui";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib";
import { useOpenStore } from "@/hooks/useOpen";
import { useTTSStore, type TTSRate } from "@/hooks/useTTS";
import Icon from "@/components/icon";

const mapRate = (rate: TTSRate) => {
  if (rate === "x-slow") return 0;
  if (rate === "slow") return 0.25;
  if (rate === "medium") return 0.5;
  if (rate === "fast") return 0.75;
  if (rate === "x-fast") return 1;
  return 0;
};

export default function TTSSetting() {
  const tGlobal = useTranslations("global");
  const tTTS = useTranslations("tts");

  const [open, setOpen] = useOpenStore((state) => [
    state.ttsSettingOpen,
    state.updateTtsSettingOpen,
  ]);
  const [voice, voices, rate, autoPlay] = useTTSStore((state) => [
    state.voice,
    state.voices,
    state.rate,
    state.autoPlay,
  ]);
  const [loading, setLoading] = React.useState(false);
  const updateVoice = useTTSStore((state) => state.updateVoice);
  const updateVoices = useTTSStore((state) => state.updateVoices);
  const updateRate = useTTSStore((state) => state.updateRate);
  const updateAutoPlay = useTTSStore((state) => state.updateAutoPlay);

  const onClose = () => setOpen(false);

  const transRate = (rate: TTSRate) => {
    if (rate === "x-slow") return tTTS("x-slow");
    if (rate === "slow") return tTTS("slow");
    if (rate === "medium") return tTTS("medium");
    if (rate === "fast") return tTTS("fast");
    if (rate === "x-fast") return tTTS("x-fast");
  };

  const getVoices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/azure/tts/voices").then((res) =>
        res.json()
      );
      const arr = res.data
        .filter(
          (item: any) =>
            item.Locale.includes("en-") || item.Locale.includes("zh-")
        )
        .map((item: any) => ({
          ...item,
          value: item.ShortName,
        }));
      updateVoices(arr);
    } finally {
      setLoading(false);
    }
  };

  const onChangeRate = (val: number) => {
    if (val === 0) return updateRate("x-slow");
    if (val === 0.25) return updateRate("slow");
    if (val === 0.5) return updateRate("medium");
    if (val === 0.75) return updateRate("fast");
    if (val === 1) return updateRate("x-fast");
  };

  React.useEffect(() => {
    if (open && !voices.length) getVoices();
  }, [open]);

  return (
    <Modal
      title={tTTS("setting")}
      maskClosable={false}
      open={open}
      onClose={onClose}
      footer={
        <Button type="primary" onClick={onClose}>
          {tGlobal("ok-spacing")}
        </Button>
      }
    >
      <div>
        <div className="flex text-sm mb-2 gap-2 items-center">
          {tTTS("voice")}
          <Tooltip title={tTTS("voice-tip")}>
            <Icon icon="question_line" size={18} />
          </Tooltip>
        </div>
        <Select
          className="w-full"
          loading={loading}
          options={voices.map((item) => ({
            ...item,
            label: (
              <div className="flex gap-2 items-center">
                <span>{item.LocalName}</span>
                <span>({item.Locale.split("-").slice(0, 2).join("-")})</span>
              </div>
            ),
          }))}
          value={voice}
          onChange={updateVoice}
        />
      </div>
      <div className="flex h-8 mt-2 text-sm px-1 items-center">
        {tTTS("rate")}: {transRate(rate)}
      </div>
      <Slider
        className="flex-1 px-1"
        max={1}
        step={0.25}
        defaultValue={[mapRate(rate)]}
        onValueChange={(value) => onChangeRate(value[0])}
      />
      <div
        className={cn(
          "flex items-center justify-between py-2 px-1 border-b",
          "border-slate-100 dark:border-neutral-500/60"
        )}
      >
        <div className="flex text-sm gap-2 items-center">
          {tTTS("auto-play")}
          <Tooltip title={tTTS("auto-play-tip")}>
            <Icon icon="question_line" size={18} />
          </Tooltip>
        </div>
        <Switch
          defaultChecked={autoPlay === "0" ? false : true}
          onChange={(checked) => updateAutoPlay(checked ? "1" : "0")}
        />
      </div>
    </Modal>
  );
}
