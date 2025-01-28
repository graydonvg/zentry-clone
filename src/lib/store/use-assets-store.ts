import { create } from "zustand";

type AssetsState = {
  heroVideoAssetsLoaded: boolean;
  toggleHeroVideoAssetsLoaded: () => void;
};

const useAssetsStore = create<AssetsState>((set) => ({
  heroVideoAssetsLoaded: false,
  toggleHeroVideoAssetsLoaded: () =>
    set((state) => ({ heroVideoAssetsLoaded: !state.heroVideoAssetsLoaded })),
}));

export default useAssetsStore;
