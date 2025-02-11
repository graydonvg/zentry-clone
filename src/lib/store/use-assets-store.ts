import { create } from "zustand";

type AssetsState = {
  heroVideoAssetsLoaded: boolean;
  isAudioPlaying: boolean;
  toggleHeroVideoAssetsLoaded: () => void;
  toggleIsAudioPlaying: () => void;
};

const useAssetsStore = create<AssetsState>((set) => ({
  heroVideoAssetsLoaded: false,
  isAudioPlaying: false,
  toggleHeroVideoAssetsLoaded: () =>
    set((state) => ({ heroVideoAssetsLoaded: !state.heroVideoAssetsLoaded })),
  toggleIsAudioPlaying: () =>
    set((state) => ({ isAudioPlaying: !state.isAudioPlaying })),
}));

export default useAssetsStore;
