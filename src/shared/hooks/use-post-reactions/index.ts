import { NDKKind } from '@nostr-dev-kit/ndk';
import { useSubscribe } from 'nostr-hooks';
import { useMemo } from 'react';

import { useNip29Ndk } from '@/shared/hooks';
import { LimitFilter, TopicPost } from '@/shared/types';

export const usePostReactions = (
  topicId: string | undefined,
  post: TopicPost | undefined,
  limitFilter?: LimitFilter | undefined,
) => {
  const { nip29Ndk } = useNip29Ndk();

  const { events: reactionsEvents } = useSubscribe(
    useMemo(
      () => ({
        filters:
          !post || !topicId
            ? []
            : [
                {
                  kinds: [7 as NDKKind],
                  '#h': [topicId],
                  '#e': [post.id],
                  ...limitFilter,
                },
              ],
        enabled: !!post?.id,
        customNdk: nip29Ndk,
      }),
      [post, topicId, limitFilter, nip29Ndk],
    ),
  );

  const reactions = useMemo(
    () => ({
      postId: post?.id,
      like: reactionsEvents.filter((e) => e.content === '+').length,
      disLike: reactionsEvents.filter((e) => e.content === '-').length,
    }),
    [post?.id, reactionsEvents],
  );

  return { reactions };
};
