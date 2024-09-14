import { NDKKind } from '@nostr-dev-kit/ndk';
import { useEffect, useMemo, useState } from 'react';

import { useNip29Ndk } from '@/shared/hooks';
import { TopicAdmin, TopicAdminPermission } from '@/shared/types';

export const useTopicAdmin = (topicId: string | undefined, adminPublickey: string | undefined) => {
  const { nip29Ndk } = useNip29Ndk();

  const [admin, setAdmin] = useState<TopicAdmin | undefined>(undefined);

  useEffect(() => {
    if (!topicId || !nip29Ndk || !adminPublickey) return;

    nip29Ndk
      .fetchEvent({ kinds: [39001 as NDKKind], '#d': [topicId], '#p': [adminPublickey] })
      .then((event) => {
        if (!event) return;

        const pTags = event.getMatchingTags('p');

        if (!pTags.length) return;

        const pTag = pTags[0];

        setAdmin({
          publicKey: pTag[1],
          permissions: pTag.slice(3) as TopicAdminPermission[],
        });
      });
  }, [topicId, adminPublickey, nip29Ndk]);

  return {
    admin,
    canAddUser: useMemo(() => admin?.permissions.includes('add-user') || false, [admin]),
    canRemoveUser: useMemo(() => admin?.permissions.includes('remove-user') || false, [admin]),
    canAddPermission: useMemo(
      () => admin?.permissions.includes('add-permission') || false,
      [admin],
    ),
    canRemovePermission: useMemo(
      () => admin?.permissions.includes('remove-permission') || false,
      [admin],
    ),
    canEditTopicStatus: useMemo(
      () => admin?.permissions.includes('edit-topic-status') || false,
      [admin],
    ),
    canEditMetadata: useMemo(() => admin?.permissions.includes('edit-metadata') || false, [admin]),
    canDeleteEvent: useMemo(() => admin?.permissions.includes('delete-event') || false, [admin]),
  };
};
