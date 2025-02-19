import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Cookies from "js-cookie";

const store1 = (set) => ({
  user: null,
  token: "",
  setToken: (value) => {
    set((state) => ({ token: value }));
  },
  isAdmin: false,
  isLoggedIn: false,
  setIsLoggedIn: (value) => {
    set((state) => ({ isLoggedIn: value }));
  },
  setIsAdmin: (value) => {
    set((state) => ({ isAdmin: value }));
  },
  setUser: (value) => {
    set((state) => ({ user: value }));
  },
  checkOutAlready: false,
  setCheckOutAlready: (value) => {
    set((state) => ({ checkOutAlready: value }));
  },
  setLogout: () => {
    set({ user: null, token: "", isLoggedIn: false, isAdmin: false, checkOutAlready: false });
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });
    sessionStorage.clear();
    localStorage.clear();
  },
});

const store2 = (set) => ({
  state: "",
  setState: (value) => {
    set((state) => ({ state: value }));
  },
});

export const useMainStorage = create(
  persist((set) => ({ ...store1(set), state: "", setState: store2(set).setState, skipHydrate: true }), {
    name: "mainStorage",
    storage: createJSONStorage(() => sessionStorage),
  })
);

export const useStateStorage = create(
  persist((set) => ({ ...store2(set), ...store1(set) }), {
    name: "stateStorage",
    storage: createJSONStorage(() => sessionStorage),
  })
);
