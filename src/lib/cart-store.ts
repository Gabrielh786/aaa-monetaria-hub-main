import { create } from 'zustand';

export interface CartItem {
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, delta: number) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  addItem: (item) => {
    const items = get().items;
    const existing = items.find(i => i.productId === item.productId && i.size === item.size);
    if (existing) {
      set({ items: items.map(i => i.productId === item.productId && i.size === item.size ? { ...i, quantity: i.quantity + 1 } : i), isOpen: true });
    } else {
      set({ items: [...items, { ...item, quantity: 1 }], isOpen: true });
    }
  },
  removeItem: (productId, size) => set({ items: get().items.filter(i => !(i.productId === productId && i.size === size)) }),
  updateQuantity: (productId, size, delta) => {
    const items = get().items.map(i => {
      if (i.productId === productId && i.size === size) {
        const newQty = i.quantity + delta;
        return newQty > 0 ? { ...i, quantity: newQty } : i;
      }
      return i;
    });
    set({ items });
  },
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
