import { useActiveUser } from 'nostr-hooks';

import { useActiveTopic, useGlobalNdk, useGlobalProfile, useLoginModalState } from '@/shared/hooks';
import { useStore } from '@/shared/store';

export const useActiveUserInfo = () => {
  const { globalNdk } = useGlobalNdk();

  const { activeUser } = useActiveUser({ customNdk: globalNdk });

  const { activeTopicId } = useActiveTopic();
  const { profile } = useGlobalProfile({ pubkey: activeUser?.pubkey });
  const { openLoginModal } = useLoginModalState();

  const isCollapsed = useStore((state) => state.isCollapsed);

  return {
    activeUser,
    activeTopicId,
    profile,
    openLoginModal,
    isCollapsed,
  };
};
