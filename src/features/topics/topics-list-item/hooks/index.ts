import { useActiveUser } from 'nostr-hooks';
import { useEffect, useState } from 'react';

import {
  useActiveTopic,
  useGlobalNdk,
  useTopic,
  useTopicAdmins,
  useTopicMembers,
  useTopicPosts,
} from '@/shared/hooks';
import { useStore } from '@/shared/store';
import { LimitFilter } from '@/shared/types';

const limitFilter: LimitFilter = { limit: 100 };

export const useTopicsListItem = ({ topicId }: { topicId: string | undefined }) => {
  const [showTopic, setShowTopic] = useState<boolean>(true);

  const topicsFilter = useStore((state) => state.topicsFilter);

  const { setActiveTopicId, activeTopicId } = useActiveTopic();
  const { globalNdk } = useGlobalNdk();
  const { topic } = useTopic(topicId);
  const { admins } = useTopicAdmins(topicId);
  const { members } = useTopicMembers(topicId);

  const { activeUser } = useActiveUser({ customNdk: globalNdk });

  useEffect(() => {
    const hasFilter = topicsFilter && Object.values(topicsFilter).some((value) => !value);
    if (hasFilter && activeUser?.pubkey) {
      setShowTopic(false);
      const isMember =
        members.length > 0 && members.some((member) => member.publicKey === activeUser?.pubkey);
      const isAdmin =
        admins.length > 0 && admins.some((admin) => admin.publicKey === activeUser?.pubkey);
      if (topicsFilter.belongTo && isMember) {
        setShowTopic(true);
      }

      if (topicsFilter.manage && isAdmin) {
        setShowTopic(true);
      }

      if (topicsFilter?.notJoined && !isMember && !isAdmin) {
        setShowTopic(true);
      }
    } else {
      setShowTopic(true);
    }
  }, [members, admins, activeUser, topicsFilter]);

  const { posts } = useTopicPosts(topicId, limitFilter);

  const isCollapsed = useStore((state) => state.isCollapsed);

  return {
    setActiveTopicId,
    topic,
    posts,
    isCollapsed,
    activeTopicId,
    showTopic,
  };
};
