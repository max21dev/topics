import { useActiveUser, useNewEvent } from 'nostr-hooks';
import { useMemo } from 'react';

import {
  useActiveTopic,
  useGlobalNdk,
  useGlobalProfile,
  useLoginModalState,
  usePostReactions,
  useNip29Ndk,
  useTopicAdmin,
  useZapModalState,
} from '@/shared/hooks';
import { useStore } from '@/shared/store';

import { PostListItemProps } from '../types';
import { categorizePostContent, fetchFirstContentImage } from '../utils';

export const usePostListItem = ({
  post,
  itemIndex,
  posts,
}: Pick<PostListItemProps, 'post' | 'itemIndex' | 'posts'>) => {
  const setReplyTo = useStore((state) => state.setReplyTo);

  const { openLoginModal } = useLoginModalState();
  const { setZapTarget, openZapModal } = useZapModalState();

  const { globalNdk } = useGlobalNdk();
  const { nip29Ndk } = useNip29Ndk();

  const { createNewEvent } = useNewEvent({ customNdk: nip29Ndk });
  const { activeUser } = useActiveUser({ customNdk: globalNdk });
  const { activeTopicId } = useActiveTopic();
  const { canDeleteEvent } = useTopicAdmin(activeTopicId, activeUser?.pubkey);
  const { reactions } = usePostReactions(activeTopicId, post);

  const { profile } = useGlobalProfile({ pubkey: post?.authorPublicKey });

  const sameAsCurrentUser = post?.authorPublicKey === activeUser?.pubkey;

  const isLastPost = posts.length === itemIndex + 1;
  const sameAuthorAsNextPost =
    !isLastPost && posts[itemIndex].authorPublicKey === posts[itemIndex + 1].authorPublicKey;
  const firstPostAuthor =
    itemIndex === 0 || posts[itemIndex - 1].authorPublicKey !== post?.authorPublicKey;
  const categorizedPostContent = useMemo(
    () => categorizePostContent(post?.content || ''),
    [post?.content],
  );

  const reply = posts.find((e) => e.id === post?.replyTo);
  const { profile: replyAuthorProfile } = useGlobalProfile({ pubkey: reply?.authorPublicKey });
  const firstReplyImageUrl = useMemo(
    () => fetchFirstContentImage(reply?.content || ''),
    [reply?.content],
  );

  function deletePost(eventId: string, topicId: string) {
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

  function likePost(eventId: string, topicId: string, like: boolean) {
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
    isLastPost,
    sameAuthorAsNextPost,
    firstPostAuthor,
    profile,
    deletePost,
    sameAsCurrentUser,
    canDeleteEvent,
    setReplyTo,
    categorizedPostContent,
    firstReplyImageUrl,
    replyAuthorProfile,
    reply,
    setZapTarget,
    openZapModal,
    activeUser,
    likePost,
    reactions,
  };
};
