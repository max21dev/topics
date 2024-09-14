import { useActiveUser, useNewEvent } from 'nostr-hooks';
import { useMemo } from 'react';

import {
  useActiveTopic,
  useGlobalNdk,
  useGlobalProfile,
  useLoginModalState,
  useMessageReactions,
  useNip29Ndk,
  useTopicAdmin,
  useZapModalState,
} from '@/shared/hooks';
import { useStore } from '@/shared/store';

import { ChatListItemProps } from '../types';
import { categorizeMessageContent, fetchFirstContentImage } from '../utils';

export const useChatListItem = ({
  message,
  itemIndex,
  messages,
}: Pick<ChatListItemProps, 'message' | 'itemIndex' | 'messages'>) => {
  const setReplyTo = useStore((state) => state.setReplyTo);

  const { openLoginModal } = useLoginModalState();
  const { setZapTarget, openZapModal } = useZapModalState();

  const { globalNdk } = useGlobalNdk();
  const { nip29Ndk } = useNip29Ndk();

  const { createNewEvent } = useNewEvent({ customNdk: nip29Ndk });
  const { activeUser } = useActiveUser({ customNdk: globalNdk });
  const { activeTopicId } = useActiveTopic();
  const { canDeleteEvent } = useTopicAdmin(activeTopicId, activeUser?.pubkey);
  const { reactions } = useMessageReactions(activeTopicId, message);

  const { profile } = useGlobalProfile({ pubkey: message?.authorPublicKey });

  const sameAsCurrentUser = message?.authorPublicKey === activeUser?.pubkey;

  const isLastMessage = messages.length === itemIndex + 1;
  const sameAuthorAsNextMessage =
    !isLastMessage &&
    messages[itemIndex].authorPublicKey === messages[itemIndex + 1].authorPublicKey;
  const firstMessageAuthor =
    itemIndex === 0 || messages[itemIndex - 1].authorPublicKey !== message?.authorPublicKey;
  const categorizedMessageContent = useMemo(
    () => categorizeMessageContent(message?.content || ''),
    [message?.content],
  );

  const reply = messages.find((e) => e.id === message?.replyTo);
  const { profile: replyAuthorProfile } = useGlobalProfile({ pubkey: reply?.authorPublicKey });
  const firstReplyImageUrl = useMemo(
    () => fetchFirstContentImage(reply?.content || ''),
    [reply?.content],
  );

  function deleteMessage(eventId: string, topicId: string) {
    if (!activeUser) {
      openLoginModal();
      return;
    }

    const event = createNewEvent();
    event.kind = 9005;
    event.tags = [
      ['h', topicId],
      ['e', eventId],
    ];
    event.publish();
  }

  function likeMessage(eventId: string, topicId: string, like: boolean) {
    if (!activeUser) {
      openLoginModal();
      return;
    }

    const event = createNewEvent();
    event.kind = 7;
    event.content = like ? '+' : '-';
    event.tags = [
      ['h', topicId],
      ['e', eventId],
      ['p', activeUser.pubkey],
    ];
    event.publish();
  }

  return {
    isLastMessage,
    sameAuthorAsNextMessage,
    firstMessageAuthor,
    profile,
    deleteMessage,
    sameAsCurrentUser,
    canDeleteEvent,
    setReplyTo,
    categorizedMessageContent,
    firstReplyImageUrl,
    replyAuthorProfile,
    reply,
    setZapTarget,
    openZapModal,
    activeUser,
    likeMessage,
    reactions,
  };
};
