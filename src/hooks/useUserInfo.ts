import { create } from "zustand";

// "none" is initial state, waiting for response from server
export type LicenseType = "" | "none" | "free" | "premium" | "team";

interface ITokensState {
  loading: boolean;
  costTokens: number;
  costUSD: number;
  license_type: LicenseType;
  freeTrialed: number;
  availableTokens: number;
}

interface ITokensAction {
  update: (timer: number) => void;
}

type useTokensReturn = [ITokensState, ITokensAction["update"]];

let timeout: NodeJS.Timeout | null = null;

const useStore = create<ITokensState & ITokensAction>((set) => ({
  loading: false,
  costTokens: 0,
  costUSD: 0,
  license_type: "none",
  freeTrialed: 0,
  availableTokens: 0,
  update: (timer: number) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(async () => {
      try {
        set(() => ({ loading: true }));
        const res = await fetch("/api/user").then((res) => res.json());
        const {
          costTokens,
          costUSD,
          license_type,
          freeTrialed,
          availableTokens,
        } = res.data;
        set(() => ({
          costTokens,
          costUSD,
          license_type: license_type || "",
          freeTrialed,
          availableTokens,
        }));
      } catch (error) {
        set(() => ({
          costTokens: 0,
          costUSD: 0,
          license_type: "",
          freeTrialed: 0,
          availableTokens: 0,
        }));
      } finally {
        set(() => ({ loading: false }));
      }
    }, timer);
  },
}));

export const useUserInfo = (): useTokensReturn => {
  const {
    costTokens,
    costUSD,
    license_type,
    freeTrialed,
    availableTokens,
    loading,
  } = useStore();

  const update = useStore((state) => state.update);

  return [
    {
      costTokens,
      costUSD,
      license_type,
      freeTrialed,
      availableTokens,
      loading,
    },
    update,
  ];
};
