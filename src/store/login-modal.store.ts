import { create } from "zustand";

type LoginModalState = {
  /** Increment to request opening the login modal (e.g. from product or membership flows). */
  openSignal: number;
  /** After OTP (or same-tab flows), navigate here instead of home. */
  postLoginRedirect: string | null;
  requestLogin: () => void;
  setPostLoginRedirect: (path: string | null) => void;
  clearPostLoginRedirect: () => void;
};

function currentLocationPath(): string {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}`;
}

export const useLoginModalStore = create<LoginModalState>((set) => ({
  openSignal: 0,
  postLoginRedirect: null,
  requestLogin: () =>
    set((s) => ({
      openSignal: s.openSignal + 1,
      postLoginRedirect: currentLocationPath(),
    })),
  setPostLoginRedirect: (path) => set({ postLoginRedirect: path }),
  clearPostLoginRedirect: () => set({ postLoginRedirect: null }),
}));
