import { NDKKind } from '@nostr-dev-kit/ndk';
import { useSubscribe } from 'nostr-hooks';
import { useMemo } from 'react';

import { useNip29Ndk } from '@/shared/hooks';
import { LimitFilter } from '@/shared/types';

export const useTopicPosts = (
  topicId: string | undefined,
  limitFilter?: LimitFilter | undefined,
) => {
  const { nip29Ndk } = useNip29Ndk();

  const { events: postsEvents } = useSubscribe(
    useMemo(
      () => ({
        filters: !topicId
          ? []
          : [
              {
                kinds: [9 as NDKKind],
                '#h': [topicId],
                ...limitFilter,
              },
            ],
        enabled: !!topicId,
        customNdk: nip29Ndk,
      }),
      [topicId, limitFilter, nip29Ndk],
    ),
  );

  const posts = useMemo(
    () =>
      postsEvents.map((e) => ({
        id: e.id,
        authorPublicKey: e.pubkey,
        topicId: String(e.getMatchingTags('h')[0]?.[1]),
        createdAt: e.created_at || 1,
        content: e.content,
        replyTo: e.getMatchingTags('e')[0] ? String(e.getMatchingTags('e')[0][1]) : null,
        event: e,
      })),
    [postsEvents],
  );

  return { posts };
};
