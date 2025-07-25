import { create } from 'zustand';

const useToastStore = create((set, get) => ({
  toasts: [],
  
  addToast: (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, timestamp: Date.now() };
    
    set((state) => ({
      toasts: [...state.toasts, toast]
    }));
    
    // Auto-remove after duration (unless duration is 0 for persistent)
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
    
    return id;
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    }));
  },
  
  clearAllToasts: () => {
    set({ toasts: [] });
  }
}));

export default useToastStore;