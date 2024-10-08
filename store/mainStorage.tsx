import CartPage from "@/app/cart/page";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
    // Define the structure of your cart item here
    // For example:
    id: string;
    name: string;
    price: number;
    // Add other properties as needed
}

interface Store {
    cartItems: CartItem[];
    setCartItems: (item: CartItem) => void;
}

const store1 = (set: any) => ({
    checkOutAlready: false,
    setCheckOutAlready: (value: boolean) => set((state: Store) => ({ checkOutAlready: value })),
    cartItems: [] as CartItem[],
    setCartItems: (item: CartItem) => set((state: Store) => ({
      cartItems: [...state.cartItems, item]
    })),
});

export const useMainStorage = create(persist<Store>(store1, { name: "mainStorage" }));