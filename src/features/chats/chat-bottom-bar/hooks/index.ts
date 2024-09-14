import { useActiveUser, useNewEvent } from 'nostr-hooks';
import React, { useEffect, useRef, useState } from 'react';

import {
  useActiveTopic,
  useGlobalNdk,
  useTopicAdmins,
  useTopicMembers,
  useTopicMessages,
  useLoginModalState,
  useNip29Ndk,
} from '@/shared/hooks';
import { useStore } from '@/shared/store';
import { TopicMessage, LimitFilter } from '@/shared/types';

const limitFilter: LimitFilter = { limit: 200 };

export const useChatBottomBar = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const replyTo = useStore((state) => state.replyTo);
  const setReplyTo = useStore((state) => state.setReplyTo);

  const { globalNdk } = useGlobalNdk();
  const { nip29Ndk } = useNip29Ndk();
  const { activeTopicId } = useActiveTopic();
  const { members } = useTopicMembers(activeTopicId);
  const { admins } = useTopicAdmins(activeTopicId);
  const { messages } = useTopicMessages(activeTopicId, limitFilter);
  const { openLoginModal } = useLoginModalState();

  const { activeUser } = useActiveUser({ customNdk: globalNdk });
  const { createNewEvent } = useNewEvent({ customNdk: nip29Ndk });

  const handleThumbsUp = () => {
    sendMessage('👍', replyTo);
    setMessage('');
  };

  const handleSend = () => {
    const messageToSend = message.trim();
    if (messageToSend) {
      sendMessage(messageToSend, replyTo);
      setMessage('');
      setReplyTo(undefined);

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + '\n');
    }
  };

  const sendMessage = (message: string, replyTo?: TopicMessage) => {
    if (!activeTopicId || !message) return;

    if (!activeUser) {
      openLoginModal();
      return;
    }

    const event = createNewEvent();
    event.kind = 9;
    event.content = message;
    event.tags = [['h', activeTopicId], ...(replyTo?.id ? [['e', replyTo.id, '', 'reply']] : [])];
    event.publish();
  };

  const sendJoinRequest = () => {
    if (!activeUser) {
      openLoginModal();
      return;
    }

    if (!activeTopicId) return;

    const event = createNewEvent();
    event.kind = 9021;
    event.tags = [['h', activeTopicId]];
    event.publish();
    //TODO: check if join request was successful
  };

  useEffect(() => {
    if (!activeUser) return;

    setIsAdmin(admins.some((admin) => admin.publicKey === activeUser.pubkey));
    setIsMember(members.some((member) => member.publicKey === activeUser.pubkey));
  }, [members, admins, activeUser]);

  return {
    message,
    setMessage,
    handleKeyPress,
    handleSend,
    handleThumbsUp,
    sendJoinRequest,
    isAdmin,
    isMember,
    replyTo,
    setReplyTo,
    inputRef,
    messages,
    activeUser,
    openLoginModal,
  };
};
