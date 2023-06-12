import { create } from "zustand";

interface ITokensState {
  loading: boolean;
  costTokens: number;
  costUSD: number;
}

interface ITokensAction {
  update: () => void;
}

type useTokensReturn = [ITokensState, ITokensAction["update"]];

let timeout: NodeJS.Timeout | null = null;

const useStore = create<ITokensState & ITokensAction>((set) => ({
  loading: false,
  costTokens: 0,
  costUSD: 0,
  update: () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(async () => {
      try {
        set(() => ({ loading: true }));
        const res = await fetch("/api/user").then((res) => res.json());
        const { costTokens, costUSD } = res.data;
        set(() => ({ costTokens, costUSD }));
      } catch (error) {
        set(() => ({ costTokens: 0, costUSD: 0 }));
      } finally {
        set(() => ({ loading: false }));
      }
    }, 3000);
  },
}));

export const useTokens = (): useTokensReturn => {
  const { costTokens, costUSD, loading } = useStore();

  const update = useStore((state) => state.update);

  return [{ costTokens, costUSD, loading }, update];
};
