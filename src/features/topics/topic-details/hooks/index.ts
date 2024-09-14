import { useActiveUser } from 'nostr-hooks';

import {
  useGlobalNdk,
  useTopic,
  useTopicAdmin,
  useTopicAdmins,
  useTopicMembers,
} from '@/shared/hooks';

export const useTopicDetails = ({ topicId }: { topicId: string | undefined }) => {
  const { globalNdk } = useGlobalNdk();

  const { topic } = useTopic(topicId);
  const { members } = useTopicMembers(topicId);
  const { admins } = useTopicAdmins(topicId);
  const { activeUser } = useActiveUser({ customNdk: globalNdk });
  const { canEditMetadata } = useTopicAdmin(topicId, activeUser?.pubkey);

  return { topic, members, admins, canEditMetadata };
};
