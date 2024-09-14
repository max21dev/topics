import { Button } from '@/shared/components/ui/button.tsx';

import { TopicAvatar } from '@/features/topics';

import { cn, displayTime, ellipsis } from '@/shared/utils';

import { useTopicsListItem } from './hooks';

export const TopicsListItem = ({ topicId }: { topicId: string | undefined }) => {
  const { topic, isCollapsed, posts, setActiveTopicId, activeTopicId, showTopic } =
    useTopicsListItem({
      topicId,
    });

  if (!topic || !showTopic) return null;

  return (
    <Button
      variant="ghost"
      size="lg"
      className={cn(
        'gap-4 items-center px-2 py-8 cursor-pointer overflow-hidden',
        isCollapsed ? 'justify-center' : 'justify-start',
        activeTopicId === topicId && 'bg-accent',
      )}
      onClick={() => setActiveTopicId(topicId)}
    >
      <TopicAvatar topicId={topicId} />

      {!isCollapsed && (
        <div className="flex flex-col items-start w-full min-w-0">
          <div className="w-full flex items-center">
            <div className="truncate">{topic.name}</div>

            {posts.length > 0 && (
              <div className="ml-auto shrink-0 text-gray-300 text-xs">
                {displayTime(posts[0].createdAt)}
              </div>
            )}
          </div>

          <span className="text-gray-400 truncate">{ellipsis(topic.about, 20)} </span>

          {posts.length > 0 && (
            <span className="text-xs text-gray-300 truncate">{ellipsis(posts[0].content, 20)}</span>
          )}
        </div>
      )}
    </Button>
  );
};
