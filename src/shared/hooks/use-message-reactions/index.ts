import { NDKKind } from '@nostr-dev-kit/ndk';
import { useSubscribe } from 'nostr-hooks';
import { useMemo } from 'react';

import { useNip29Ndk } from '@/shared/hooks';
import { LimitFilter, TopicMessage } from '@/shared/types';

export const useMessageReactions = (
  topicId: string | undefined,
  message: TopicMessage | undefined,
  limitFilter?: LimitFilter | undefined,
) => {
  const { nip29Ndk } = useNip29Ndk();

  const { events: reactionsEvents } = useSubscribe(
    useMemo(
      () => ({
        filters:
          !message || !topicId
            ? []
            : [
                {
                  kinds: [7 as NDKKind],
                  '#h': [topicId],
                  '#e': [message.id],
                  ...limitFilter,
                },
              ],
        enabled: !!message?.id,
        customNdk: nip29Ndk,
      }),
      [message, topicId, limitFilter, nip29Ndk],
    ),
  );

  const reactions = useMemo(
    () => ({
      messageId: message?.id,
      like: reactionsEvents.filter((e) => e.content === '+').length,
      disLike: reactionsEvents.filter((e) => e.content === '-').length,
    }),
    [message?.id, reactionsEvents],
  );

  return { reactions };
};
