import { useSubscribe } from 'nostr-hooks';
import { useMemo } from 'react';

import { useNip29Ndk } from '@/shared/hooks';
import { Topic } from '@/shared/types';

const filters = [{ kinds: [39000], limit: 100 }];

export const useTopics = () => {
  const { nip29Ndk } = useNip29Ndk();

  const { events: topicsEvents } = useSubscribe(
    useMemo(() => ({ filters, customNdk: nip29Ndk }), [nip29Ndk]),
  );

  const topics = useMemo(
    () =>
      topicsEvents
        .filter((e, i, self) => {
          const isUnique = self.findIndex((t) => t.dTag === e.dTag) === i;

          const nameTag = e.getMatchingTags('name')?.[0];
          const hasValidNameTag = nameTag && nameTag[1] !== '';

          return isUnique && hasValidNameTag;
        })
        .map(
          (e) =>
            ({
              id: e.dTag,
              name: e.getMatchingTags('name')?.[0]?.[1],
              about: e.getMatchingTags('about')?.[0]?.[1],
              privacy: e.getMatchingTags('public') ? 'public' : 'private',
              type: e.getMatchingTags('open') ? 'open' : 'closed',
              picture: e.getMatchingTags('picture')?.[0]?.[1] || '',
              event: e,
            }) as Topic,
        ),
    [topicsEvents],
  );

  return { topics };
};
