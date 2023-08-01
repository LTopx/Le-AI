import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

type OpenStore = {
  settingOpen: boolean;
  premiumOpen: boolean;
  chargeTokenOpen: boolean;
  mobileMenuOpen: boolean;
  ttsSettingOpen: boolean;
  chatSettingOpen: boolean;
  characterOpen: boolean;

  updateSettingOpen: (settingOpen: boolean) => void;
  updatePremiumOpen: (premiumOpen: boolean) => void;
  updateChargeTokenOpen: (chargeTokenOpen: boolean) => void;
  updateMobileMenuOpen: (mobileMenuOpen: boolean) => void;
  updateTtsSettingOpen: (ttsSettingOpen: boolean) => void;
  updateChatSettingOpen: (chatSettingOpen: boolean) => void;
  updateCharacterOpen: (characterOpen: boolean) => void;
};

export const useOpenStore = createWithEqualityFn<OpenStore>(
  (set) => ({
    settingOpen: false,
    premiumOpen: false,
    chargeTokenOpen: false,
    mobileMenuOpen: false,
    ttsSettingOpen: false,
    chatSettingOpen: false,
    characterOpen: false,

    updateSettingOpen: (settingOpen) => set({ settingOpen }),
    updatePremiumOpen: (premiumOpen) => set({ premiumOpen }),
    updateChargeTokenOpen: (chargeTokenOpen) => set({ chargeTokenOpen }),
    updateMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
    updateTtsSettingOpen: (ttsSettingOpen) => set({ ttsSettingOpen }),
    updateChatSettingOpen: (chatSettingOpen) => set({ chatSettingOpen }),
    updateCharacterOpen: (characterOpen) => set({ characterOpen }),
  }),
  shallow
);
