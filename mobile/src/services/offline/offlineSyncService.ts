import { create } from 'zustand';

interface SyncState {
  isOnline: boolean;
  pendingSyncQueue: Array<{ id: string; action: string; payload: any }>;
  setOnlineStatus: (status: boolean) => void;
  addToQueue: (action: string, payload: any) => void;
  clearQueue: () => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  isOnline: true,
  pendingSyncQueue: [],
  setOnlineStatus: (isOnline) => set({ isOnline }),
  addToQueue: (action, payload) =>
    set((state) => ({
      pendingSyncQueue: [...state.pendingSyncQueue, { id: Date.now().toString(), action, payload }],
    })),
  clearQueue: () => set({ pendingSyncQueue: [] }),
}));

export const offlineSyncService = {
  async processPendingQueue(): Promise<void> {
    const queue = useSyncStore.getState().pendingSyncQueue;
    if (queue.length === 0) return;

    console.log('Processing offline pending queue count:', queue.length);
    useSyncStore.getState().clearQueue();
  },
};
