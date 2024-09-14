import NDK, { NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';
import NDKCacheAdapterDexie from '@nostr-dev-kit/ndk-cache-dexie';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { TopicPost, TopicsFilter } from '../types';

type AppState = {
  sidebarWidth: number;

  isCollapsed: boolean;

  hasCustomSidebarWidth: boolean;

  isLoginModalOpen: boolean;

  isZapModalOpen: boolean;

  zapTarget: NDKEvent | NDKUser | undefined;
};

type AppActions = {
  setSidebarWidth: (sidebarWidth: number) => void;

  setIsCollapsed: (isCollapsed: boolean) => void;

  setHasCustomSidebarWidth: (hasCustomSidebarWidth: boolean) => void;

  setIsLoginModalOpen: (isOpen: boolean) => void;

  setIsZapModalOpen: (isOpen: boolean) => void;

  setZapTarget: (target: NDKEvent | NDKUser | undefined) => void;
};

type NdkState = {
  globalNdk: NDK;
  nip29Ndk: NDK;
};

type NdkActions = {
  setGlobalNdk: (globalNdk: NDK) => void;
  setNip29Ndk: (nip29Ndk: NDK) => void;
};

type ChatState = {
  activeTopicId: string | undefined;
  replyTo: TopicPost | undefined;
  isTopicDetailsOpen: boolean;
};

type ChatActions = {
  setActiveTopicId: (activeTopicId: string | undefined) => void;
  setReplyTo: (replyTo: TopicPost | undefined) => void;
  toggleTopicDetails: () => void;
};

type TopicsState = {
  topicsFilter: TopicsFilter | undefined;
};

type TopicsActions = {
  setTopicsFilter: (topicsFilter: TopicsFilter | undefined) => void;
};

type RelaysState = {
  relays: string[];
  activeRelayIndex: number;
};

type RelaysActions = {
  addRelay: (relay: string) => void;
  safeRemoveRelay: (relay: string) => void;
  setActiveRelayIndex: (activeRelayIndex: number) => void;
};

export const useStore = create<
  AppState &
    AppActions &
    NdkState &
    NdkActions &
    ChatState &
    ChatActions &
    RelaysState &
    RelaysActions &
    TopicsState &
    TopicsActions
>()(
  persist(
    (set, get) => ({
      // App State

      sidebarWidth: 80,

      isCollapsed: true,

      hasCustomSidebarWidth: false,

      isLoginModalOpen: false,

      isZapModalOpen: false,

      zapTarget: undefined,

      setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),

      setIsCollapsed: (isCollapsed) => set({ isCollapsed }),

      setHasCustomSidebarWidth: (hasCustomSidebarWidth) => set({ hasCustomSidebarWidth }),

      setIsLoginModalOpen: (isOpen) => set({ isLoginModalOpen: isOpen }),

      setIsZapModalOpen: (isOpen) => set({ isZapModalOpen: isOpen }),

      setZapTarget: (target) => set({ zapTarget: target }),

      // NDK State

      globalNdk: new NDK({
        explicitRelayUrls: ['wss://nos.lol'],
        autoConnectUserRelays: true,
        autoFetchUserMutelist: false,
        cacheAdapter: new NDKCacheAdapterDexie({ dbName: `db-global` }),
      }),

      setGlobalNdk: (globalNdk) => set({ globalNdk }),

      nip29Ndk: new NDK({
        explicitRelayUrls: [],
        autoConnectUserRelays: false,
        autoFetchUserMutelist: false,
        cacheAdapter: undefined,
      }),

      setNip29Ndk: (nip29Ndk) => set({ nip29Ndk }),

      // Chat State

      activeTopicId: undefined,

      replyTo: undefined,

      isTopicDetailsOpen: false,

      setActiveTopicId: (activeTopicId) => set({ activeTopicId }),

      setReplyTo: (replyTo) => set({ replyTo }),

      toggleTopicDetails: () => set((state) => ({ isTopicDetailsOpen: !state.isTopicDetailsOpen })),

      // Relay State

      relays: ['wss://relay.topics.nip29.com'],

      activeRelayIndex: 0,

      addRelay: (relay) => {
        const { relays } = get();

        if (!relays.includes(relay)) {
          set({ relays: [...relays, relay] });
        }
      },

      safeRemoveRelay: (relay) => {
        const { relays } = get();

        if (relays.length === 1) {
          return;
        }

        set({
          activeRelayIndex: 0,
          relays: relays.filter((r) => r !== relay),
        });
      },

      setActiveRelayIndex: (activeRelayIndex) => set({ activeRelayIndex }),

      topicsFilter: { belongTo: true, manage: true, own: true, notJoined: true },
      setTopicsFilter: (topicsFilter) => set({ topicsFilter }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        activeRelayIndex: state.activeRelayIndex,
        relays: [...new Set(['wss://relay.topics.nip29.com', ...state.relays])],
        sidebarWidth: state.sidebarWidth,
        isCollapsed: state.isCollapsed,
        hasCustomSidebarWidth: state.hasCustomSidebarWidth,
      }),
    },
  ),
);
