import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import type { UserInfoStore } from "./types";

let timeout: NodeJS.Timeout | null = null;

export const useUserInfoStore = createWithEqualityFn<UserInfoStore>(
  (set) => ({
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
  }),
  shallow
);
