"use client";

import React from "react";
import { useTranslations } from "next-intl";
import * as Switch from "@radix-ui/react-switch";
import { cn } from "@/lib";
import Icon from "@/components/icon";
import {
  Modal,
  Select,
  Button,
  NewSlider as Slider,
  Tooltip,
} from "@/components/ui";
import { useTTSOpen, useTTS, type TTSRate } from "@/hooks";

const renderLabel = (item: any) => {
  return (
    <div className="flex gap-2 items-center">
      <span>{item.LocalName}</span>
      <span>({item.Locale.split("-").slice(0, 2).join("-")})</span>
    </div>
  );
};

const mapRate = (rate: TTSRate) => {
  if (rate === "x-slow") return 0;
  if (rate === "slow") return 0.25;
  if (rate === "medium") return 0.5;
  if (rate === "fast") return 0.75;
  if (rate === "x-fast") return 1;
};

const TTS: React.FC = () => {
  const [open, setOpen] = useTTSOpen();
  const {
    voice,
    voices,
    rate,
    autoPlay,
    updateVoice,
    updateVoices,
    updateRate,
    updateAutoPlay,
  } = useTTS();
  const [loading, setLoading] = React.useState(false);

  const t = useTranslations("tts");
  const tCommon = useTranslations("common");

  const transRate = (rate: TTSRate) => {
    if (rate === "x-slow") return t("x-slow");
    if (rate === "slow") return t("slow");
    if (rate === "medium") return t("medium");
    if (rate === "fast") return t("fast");
    if (rate === "x-fast") return t("x-fast");
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

  const onClose = () => setOpen(false);

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
      title={t("setting")}
      maskClosable={false}
      open={open}
      onClose={onClose}
      footer={
        <div className="flex justify-end">
          <Button type="primary" onClick={onClose}>
            {tCommon("ok")}
          </Button>
        </div>
      }
    >
      <div
        className={cn(
          "flex items-center justify-between py-2 px-1 border-b",
          "border-slate-100 dark:border-neutral-500/60"
        )}
      >
        <div className="flex text-sm gap-2 items-center">
          {t("voice")}
          <Tooltip title={t("voice-tip")}>
            <Icon icon="question_line" size={18} />
          </Tooltip>
        </div>
        <Select
          className="w-56"
          contentClassName="max-h-80"
          loading={loading}
          options={voices}
          renderLabel={renderLabel}
          value={voice}
          onChange={updateVoice}
        />
      </div>
      <div className="flex h-8 mt-2 text-sm px-1 items-center">
        {t("rate")}: {transRate(rate)}
      </div>
      <div>
        <Slider
          className="flex-1 px-1"
          max={1}
          step={0.25}
          defaultValue={mapRate(rate)}
          onChange={onChangeRate}
        />
      </div>
      <div
        className={cn(
          "flex items-center justify-between py-2 px-1 border-b",
          "border-slate-100 dark:border-neutral-500/60"
        )}
      >
        <div className="flex text-sm gap-2 items-center">
          {t("auto-play")}
          <Tooltip title={t("auto-play-tip")}>
            <Icon icon="question_line" size={18} />
          </Tooltip>
        </div>
        <Switch.Root
          defaultChecked={autoPlay === "0" ? false : true}
          onCheckedChange={(checked) => updateAutoPlay(checked ? "1" : "0")}
          className={cn(
            "w-12 h-6 rounded-full relative outline-none cursor-pointer transition-colors",
            "data-[state=unchecked]:bg-neutral-200/80 data-[state=checked]:bg-sky-400"
          )}
        >
          <Switch.Thumb
            className={cn(
              "block w-4 h-4 bg-white rounded-full transition-all",
              "translate-x-1 data-[state=checked]:translate-x-7"
            )}
          />
        </Switch.Root>
      </div>
    </Modal>
  );
};

export default TTS;
