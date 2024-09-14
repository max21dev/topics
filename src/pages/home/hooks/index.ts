import { useActiveUser } from 'nostr-hooks';

import { useActiveTopic, useGlobalNdk } from '@/shared/hooks';
import { useStore } from '@/shared/store';

export const useHomePage = () => {
  const isCollapsed = useStore((state) => state.isCollapsed);

  const { globalNdk } = useGlobalNdk();

  const { activeTopicId } = useActiveTopic();
  const { activeUser } = useActiveUser({ customNdk: globalNdk });

  return {
    isCollapsed,
    activeTopicId,
    activeUser,
  };
};
