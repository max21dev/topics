import { NDKKind } from '@nostr-dev-kit/ndk';
import { useSubscribe } from 'nostr-hooks';
import { useMemo } from 'react';

import { useNip29Ndk } from '@/shared/hooks';
import { TopicAdminPermission } from '@/shared/types';

export const useTopicAdmins = (topicId: string | undefined) => {
  const { nip29Ndk } = useNip29Ndk();

  const { events } = useSubscribe(
    useMemo(
      () => ({
        filters: !topicId ? [] : [{ kinds: [39001 as NDKKind], '#d': [topicId], limit: 1 }],
        enabled: !!topicId,
        opts: { groupable: false },
        customNdk: nip29Ndk,
      }),
      [topicId, nip29Ndk],
    ),
  );

  const admins = useMemo(
    () =>
      events && events.length > 0
        ? events[events.length - 1].getMatchingTags('p').map((pTag) => ({
            publicKey: pTag[1],
            permissions: pTag.slice(3) as TopicAdminPermission[],
          }))
        : [],
    [events],
  );

  return { admins };
};
