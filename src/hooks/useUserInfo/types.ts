export type LicenseType = "" | "none" | "free" | "premium" | "team";

export type UserInfoStore = {
  loading: boolean;
  costTokens: number;
  costUSD: number;
  license_type: LicenseType;
  freeTrialed: number;
  availableTokens: number;
  update: (timer: number) => void;
};
