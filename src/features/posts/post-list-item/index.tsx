import { ThumbsDown, ThumbsUp, Trash2, Undo, Zap } from 'lucide-react';
import { useState } from 'react';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/shared/components/ui/context-menu.tsx';

import { UserAvatar } from '@/features/users/user-avatar';
import { cn, ellipsis, loader } from '@/shared/utils';

import { usePostListItem } from './hooks';
import { PostListItemProps } from './types';
import { format } from 'date-fns';

export const PostListItem = ({
  post,
  itemIndex,
  posts,
  scrollToPost,
  setDeletedPosts,
}: PostListItemProps) => {
  const {
    profile,
    deletePost,
    firstPostAuthor,
    isLastPost,
    sameAuthorAsNextPost,
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
  } = usePostListItem({ itemIndex, posts, post });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!post) return null;

  return (
    <div className={cn('flex ml-3 gap-3', !sameAuthorAsNextPost ? 'mb-4' : 'mb-0')}>
      {!sameAsCurrentUser && (
        <>
          {isLastPost || !sameAuthorAsNextPost ? (
            <div className="mt-auto">
              <UserAvatar pubkey={post.authorPublicKey} />
            </div>
          ) : (
            <div className="w-10" />
          )}
        </>
      )}

      <div className="flex flex-col">
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={cn(
                'p-2 mt-1 rounded-lg max-w-xl whitespace-pre-wrap',
                sameAsCurrentUser
                  ? 'mr-2 bg-blue text-blue-foreground'
                  : 'bg-secondary text-secondary-foreground',
              )}
            >
              {firstPostAuthor && !sameAsCurrentUser && (
                <div className="mb-1 text-xs font-semibold opacity-50">
                  {profile?.displayName
                    ? profile.displayName
                    : post.authorPublicKey.slice(0, 5) + '...'}
                </div>
              )}

              {post.replyTo && (
                <div
                  className="mb-2 text-xs bg-primary/20 cursor-pointer border-l-4 border-primary/25 rounded-lg p-1 flex items-start"
                  onClick={() => scrollToPost(post.replyTo || '')}
                >
                  {firstReplyImageUrl && (
                    <img src={loader(firstReplyImageUrl, { w: 50 })} alt="Reply Post Image" />
                  )}
                  <div>
                    <div className="text-xs font-semibold opacity-60">
                      {replyAuthorProfile?.displayName
                        ? replyAuthorProfile.displayName
                        : reply?.authorPublicKey?.slice(0, 5) + '...'}
                    </div>
                    <div>{ellipsis(reply?.content || '', 50)}</div>
                  </div>
                </div>
              )}

              <div
                className={cn(
                  'flex gap-2',
                  post.content.length < 80 ? 'items-center' : 'flex-col justify-end',
                )}
              >
                <div>
                  {categorizedPostContent.map((part, i) => {
                    if (part.category == 'text') {
                      return (
                        <p key={i} className="text-sm">
                          {part.content}
                        </p>
                      );
                    } else if (part.category == 'image') {
                      return (
                        <img
                          key={i}
                          src={loader(part.content, { w: 200 })}
                          alt="post"
                          className="max-w-full h-40 rounded-lg mt-2 cursor-pointer"
                          max-width="200"
                          onClick={() => setSelectedImage(part.content)}
                        />
                      );
                    } else if (part.category == 'url') {
                      return (
                        <a
                          key={i}
                          href={part.content}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-pink-400 underline break-all"
                        >
                          {part.content}
                        </a>
                      );
                    }
                  })}
                </div>

                <div className="ml-auto flex gap-2 items-center text-end text-xs font-light cursor-default opacity-60">
                  {reactions && reactions.like > 0 && (
                    <div className="flex items-center">
                      <span className="mr-1">{reactions.like}</span>
                      <ThumbsUp className="h-3 w-3" />
                    </div>
                  )}

                  {reactions && reactions.disLike > 0 && (
                    <div className="flex items-center">
                      <span className="mr-1">{reactions.disLike}</span>
                      <ThumbsDown className="h-3 w-3" />
                    </div>
                  )}

                  <span>{format(new Date(post.createdAt * 1000), 'HH:mm')}</span>
                </div>
              </div>
            </div>
          </ContextMenuTrigger>
          {activeUser && (
            <ContextMenuContent>
              {canDeleteEvent && (
                <ContextMenuItem
                  onClick={() => {
                    deletePost(post.id, post.topicId);
                    setDeletedPosts((prev) => [...(prev || []), post.id]);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-3" />
                  Delete
                </ContextMenuItem>
              )}
              <ContextMenuItem onClick={() => setReplyTo(post)}>
                <Undo className="h-4 w-4 mr-3" />
                Reply
              </ContextMenuItem>
              <ContextMenuItem onClick={() => likePost(post.id, post.topicId, true)}>
                <ThumbsUp className="h-4 w-4 mr-3" />
                Like
              </ContextMenuItem>
              <ContextMenuItem onClick={() => likePost(post.id, post.topicId, false)}>
                <ThumbsDown className="h-4 w-4 mr-3" />
                Dislike
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  setZapTarget(post.event);
                  openZapModal();
                }}
              >
                <Zap className="h-4 w-4 mr-3 text-warning" />
                <span className="text-warning">Zap</span>
              </ContextMenuItem>
            </ContextMenuContent>
          )}
        </ContextMenu>
      </div>

      {/* Image Overlay */}
      {selectedImage && (
        <div
          className="fixed max-w-full p-20 inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Enlarged post" className="h-auto rounded-lg" />
        </div>
      )}
    </div>
  );
};
