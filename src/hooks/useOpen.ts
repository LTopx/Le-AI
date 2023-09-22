import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

type OpenStore = {
  settingOpen: boolean;
  premiumOpen: boolean;
  chargeTokenOpen: boolean;
  mobileMenuOpen: boolean;
  ttsSettingOpen: boolean;
  characterOpen: boolean;
  pluginSettingOpen: boolean;
  backupOpen: boolean;

  updateSettingOpen: (settingOpen: boolean) => void;
  updatePremiumOpen: (premiumOpen: boolean) => void;
  updateChargeTokenOpen: (chargeTokenOpen: boolean) => void;
  updateMobileMenuOpen: (mobileMenuOpen: boolean) => void;
  updateTtsSettingOpen: (ttsSettingOpen: boolean) => void;
  updateCharacterOpen: (characterOpen: boolean) => void;
  updatePluginSettingOpen: (pluginSettingOpen: boolean) => void;
  updateBackupOpen: (backupOpen: boolean) => void;
};

export const useOpenStore = createWithEqualityFn<OpenStore>(
  (set) => ({
    settingOpen: false,
    premiumOpen: false,
    chargeTokenOpen: false,
    mobileMenuOpen: false,
    ttsSettingOpen: false,
    characterOpen: false,
    pluginSettingOpen: false,
    backupOpen: false,

    updateSettingOpen: (settingOpen) => set({ settingOpen }),
    updatePremiumOpen: (premiumOpen) => set({ premiumOpen }),
    updateChargeTokenOpen: (chargeTokenOpen) => set({ chargeTokenOpen }),
    updateMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
    updateTtsSettingOpen: (ttsSettingOpen) => set({ ttsSettingOpen }),
    updateCharacterOpen: (characterOpen) => set({ characterOpen }),
    updatePluginSettingOpen: (pluginSettingOpen) => set({ pluginSettingOpen }),
    updateBackupOpen: (backupOpen) => set({ backupOpen }),
  }),
  shallow
);
