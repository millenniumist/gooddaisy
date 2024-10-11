import CartPage from "@/app/cart/page";
import axios from "axios";
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
    user: any
}

const store1 = (set: any) => ({
  user: null,
  token: "",
  setToken: (value: string) => {
    // console.log("token" ,value)
    set((state: Store) => ({ token: value }))
  },
  userAdmin: null,
  setUserAdmin: (value: any) => set((state: Store) => ({ userAdmin: value })),
  setUser: (value: any) => set((state: Store) => ({ user: value })),
  checkOutAlready:false,
  setCheckOutAlready: (value: boolean) => set((state: Store) => ({ checkOutAlready: value })),
  })


const store2 = (set: any) => ({
  state: "",
  setState: (value: string) => set((state: Store) => ({ state: value })),
})



export const useMainStorage = create(persist<Store>(store1, { name: "mainStorage", storage: createJSONStorage(() => sessionStorage) }));
export const useStateStorage = create(persist<Store>(store2, { name: "stateStorage", storage: createJSONStorage(() => sessionStorage) }));
