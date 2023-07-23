import { create } from "zustand";

type OpenStore = {
  settingOpen: boolean;
  premiumOpen: boolean;
  chargeTokenOpen: boolean;
  mobileMenuOpen: boolean;
  ttsSettingOpen: boolean;
  chatSettingOpen: boolean;

  updateSettingOpen: (settingOpen: boolean) => void;
  updatePremiumOpen: (premiumOpen: boolean) => void;
  updateChargeTokenOpen: (chargeTokenOpen: boolean) => void;
  updateMobileMenuOpen: (mobileMenuOpen: boolean) => void;
  updateTtsSettingOpen: (ttsSettingOpen: boolean) => void;
  updateChatSettingOpen: (chatSettingOpen: boolean) => void;
};

export const useOpenStore = create<OpenStore>((set) => ({
  settingOpen: false,
  premiumOpen: false,
  chargeTokenOpen: false,
  mobileMenuOpen: false,
  ttsSettingOpen: false,
  chatSettingOpen: false,

  updateSettingOpen: (settingOpen) => set({ settingOpen }),
  updatePremiumOpen: (premiumOpen) => set({ premiumOpen }),
  updateChargeTokenOpen: (chargeTokenOpen) => set({ chargeTokenOpen }),
  updateMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
  updateTtsSettingOpen: (ttsSettingOpen) => set({ ttsSettingOpen }),
  updateChatSettingOpen: (chatSettingOpen) => set({ chatSettingOpen }),
}));
