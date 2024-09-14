import React from 'react';

import { TopicMessage } from '@/shared/types';

export type ChatListItemProps = {
  itemIndex: number;
  message?: TopicMessage;
  messages: TopicMessage[];
  scrollToMessage: (messageId: string) => void;
  setDeletedMessages: React.Dispatch<React.SetStateAction<string[]>>;
};

export type MessageContentCategory = 'text' | 'image' | 'url';

export type CategorizedMessageContent = {
  category: MessageContentCategory;
  content: string;
};
