import { useTopic } from '@/shared/hooks';

export const useTopicAvatar = (topicId: string | undefined) => {
  const { topic } = useTopic(topicId);

  return { picture: topic?.picture, name: topic?.name };
};
