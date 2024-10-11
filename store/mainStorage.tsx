import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


interface CartItem {
    id: string;
    name: string;
    price: number;
}

interface Store {
    state: string;
    setState: (value: string) => void;
    user: any;
    token: string;
    setToken: (value: string) => void;
    isAdmin: boolean;
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    setIsAdmin: (value: boolean) => void;
    setUser: (value: any) => void;
    checkOutAlready: boolean;
    setCheckOutAlready: (value: boolean) => void;
    setLogout: () => void;
}


const store1 = (set: any) => ({
  user: null,
  token: "",
  setToken: (value: string) => {
    set((state: Store) => ({ token: value }));
    console.log("Token set:", value);
  },
  isAdmin: false,
  isLoggedIn: false,
  setIsLoggedIn: (value: boolean) => {
    set((state: Store) => ({ isLoggedIn: value }));
    console.log("IsLoggedIn set:", value);
  },
  setIsAdmin: (value: boolean) => {
    set((state: Store) => ({ isAdmin: value }));
    console.log("isAdmin set:", value);
  },
  setUser: (value: any) => {
    set((state: Store) => ({ user: value }));
    console.log("User set:", value);
  },
  checkOutAlready: false,
  setCheckOutAlready: (value: boolean) => {
    set((state: Store) => ({ checkOutAlready: value }));
    console.log("CheckOutAlready set:", value);
  },
  setLogout: () => {
    set({ user: null, token: "", isLoggedIn: false, isAdmin: false, checkOutAlready: false });
    console.log("Logout executed");
  }
});

const store2 = (set: any) => ({
  state: "",
  setState: (value: string) => {
    set((state: Store) => ({ state: value }));
    console.log("State set:", value);
  },
});

export const useMainStorage = create(persist<Store>((set) => ({ ...store1(set), state: "", setState: store2(set).setState }), { name: "mainStorage", storage: createJSONStorage(() => sessionStorage) }));
export const useStateStorage = create(persist<Store>((set) => ({ ...store2(set), ...store1(set) }), { name: "stateStorage", storage: createJSONStorage(() => sessionStorage) }));