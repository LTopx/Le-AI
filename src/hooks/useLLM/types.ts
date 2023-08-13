import React from "react";

export type Model = {
  label: string;
  value: string;
  icon?: React.ReactNode;
  premium?: boolean;
};

export type ModelConfig = {
  label: React.ReactNode;
  value: string;
  ico: React.ReactNode;
  ico_big: React.ReactNode;
  models: Model[];
};

export type LLMStore = {
  openai: ModelConfig;
  azure: ModelConfig;
  openRouter: ModelConfig;

  updateAzure: (models: Model[]) => void;
};
