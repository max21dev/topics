import { useSubscribe } from 'nostr-hooks';
import { useEffect, useMemo, useState } from 'react';

import { useNip29Ndk } from '@/shared/hooks';
import { Topic } from '@/shared/types';

type Status = 'idle' | 'loading' | 'success';

export const useTopic = (topicId: string | undefined) => {
  const { nip29Ndk } = useNip29Ndk();

  const [status, setStatus] = useState<Status>('idle');

  const { events: topicsEvents } = useSubscribe(
    useMemo(
      () => ({
        filters: !topicId ? [] : [{ kinds: [39000], '#d': [topicId] }],
        enabled: !!topicId,
        customNdk: nip29Ndk,
      }),
      [topicId, nip29Ndk],
    ),
  );

  const topic = useMemo(() => {
    if (topicsEvents.length === 0) {
      return undefined;
    }

    const topicEvent = topicsEvents[0];

    const nameTag = topicEvent.getMatchingTags('name')[0];
    const pictureTag = topicEvent.getMatchingTags('picture')[0];
    const aboutTag = topicEvent.getMatchingTags('about')[0];

    return {
      id: topicEvent.dTag,
      name: nameTag ? nameTag[1] : 'Unknown',
      privacy: topicEvent.getMatchingTags('public') ? 'public' : 'private',
      type: topicEvent.getMatchingTags('open') ? 'open' : 'closed',
      about: aboutTag ? aboutTag[1] : '',
      picture: pictureTag ? pictureTag[1] : '',
      event: topicEvent,
    } as Topic;
  }, [topicsEvents]);

  useEffect(() => {
    if (topicId && !topic) {
      setStatus('loading');
    } else if (topicId && topic) {
      setStatus('success');
    } else {
      setStatus('idle');
    }
  }, [topicId, topic]);

  return { topic, status };
};
