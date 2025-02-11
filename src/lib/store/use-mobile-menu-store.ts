import { create } from "zustand";

type MobileMenuState = {
  isMobileMenuOpen: boolean;
  toggleIsMobileMenuOpen: () => void;
};

const useMobileMenuStore = create<MobileMenuState>((set) => ({
  isMobileMenuOpen: false,
  toggleIsMobileMenuOpen: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
}));

export default useMobileMenuStore;
