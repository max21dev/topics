import { NDKEvent } from '@nostr-dev-kit/ndk';

export type Topic = {
  id: string;
  name: string;
  picture: string;
  about: string;
  privacy: 'public' | 'private';
  type: 'open' | 'closed';
  admins: TopicAdmin[];
  members: TopicMember[];
  event: NDKEvent;
};

export type TopicMetadata = {
  id: string;
  name: string;
  picture: string;
  about: string;
};

export type TopicAdmin = {
  publicKey: string;
  permissions: TopicAdminPermission[];
};

export type TopicMember = {
  publicKey: string;
};

export type TopicAdminPermission =
  | 'add-user'
  | 'edit-metadata'
  | 'delete-event'
  | 'remove-user'
  | 'add-permission'
  | 'remove-permission'
  | 'edit-topic-status'
  | 'create-topic';

export type TopicMessage = {
  id: string;
  topicId: string;
  authorPublicKey: string;
  content: string;
  createdAt: number;
  event: NDKEvent;
  replyTo?: string | null;
};
export type TopicReply = {
  id: string;
  topicId: string;
  topicMessageId: string;
  authorPublicKey: string;
  content: string;
  createdAt: string;
};

export type LimitFilter = {
  since?: number;
  until?: number;
  limit?: number;
};

export type TopicsFilter = {
  belongTo?: boolean;
  manage?: boolean;
  own?: boolean;
  notJoined?: boolean;
};
