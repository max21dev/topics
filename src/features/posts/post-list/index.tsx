import { AnimatePresence, motion } from 'framer-motion';

import { PostListDateBadge, PostListItem } from '@/features/posts';

import { cn, sameDay } from '@/shared/utils';

import { usePostList } from './hooks';

export function PostList() {
  const { postsContainerRef, postRefs, setDeletedPosts, scrollToPost, activeUser, processedPosts } =
    usePostList();

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
      <div
        ref={postsContainerRef}
        className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col bg-background"
      >
        <AnimatePresence>
          {processedPosts.map((post, i, arr) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: 'spring',
                  bounce: 0.3,
                  duration: processedPosts.indexOf(post) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                'flex flex-col gap-2 whitespace-pre-wrap',
                post.authorPublicKey !== activeUser?.pubkey ? 'items-start' : 'items-end mr-2',
              )}
              ref={(el) => {
                postRefs.current[post.id] = el;
              }}
            >
              {(i == 0 || !sameDay(post.createdAt, processedPosts[i - 1].createdAt)) && (
                <PostListDateBadge date={new Date(post.createdAt * 1000)} />
              )}
              <PostListItem
                post={post}
                setDeletedPosts={setDeletedPosts}
                scrollToPost={scrollToPost}
                itemIndex={i}
                posts={arr}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
