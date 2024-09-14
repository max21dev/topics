import { useActiveUser } from 'nostr-hooks';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useActiveTopic, useGlobalNdk, useTopicPosts } from '@/shared/hooks';
import { LimitFilter } from '@/shared/types';

const limitFilter: LimitFilter = { limit: 200 };

export const usePostList = () => {
  const postsContainerRef = useRef<HTMLDivElement>(null);
  const postRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [deletedPosts, setDeletedPosts] = useState<string[]>([]);

  const { globalNdk } = useGlobalNdk();
  const { activeTopicId } = useActiveTopic();
  const { posts } = useTopicPosts(activeTopicId, limitFilter);

  const { activeUser } = useActiveUser({ customNdk: globalNdk });

  const processedPosts = useMemo(
    () =>
      posts
        .filter((post) => !deletedPosts.includes(post.id))
        .sort((a, b) => a.createdAt - b.createdAt),
    [posts, deletedPosts],
  );

  useEffect(() => {
    if (postsContainerRef.current) {
      postsContainerRef.current.scrollTop = postsContainerRef.current.scrollHeight;
    }
  }, [processedPosts]);

  const scrollToPost = (postId: string) => {
    const postElement = postRefs.current[postId];
    if (postElement && postsContainerRef.current) {
      postsContainerRef.current.scrollTo({
        top: postElement.offsetTop - postsContainerRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return {
    postsContainerRef,
    postRefs,
    setDeletedPosts,
    activeUser,
    processedPosts,
    scrollToPost,
  };
};
