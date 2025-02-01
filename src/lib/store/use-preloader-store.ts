import { create } from "zustand";

type PreloaderState = {
  isPreloaderComplete: boolean;
  toggleIsPreloaderComplete: () => void;
};

const usePreloaderStore = create<PreloaderState>((set) => ({
  isPreloaderComplete: false,
  toggleIsPreloaderComplete: () =>
    set((state) => ({ isPreloaderComplete: !state.isPreloaderComplete })),
}));

export default usePreloaderStore;
