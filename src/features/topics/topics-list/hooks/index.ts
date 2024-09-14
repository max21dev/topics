import { useTopics } from '@/shared/hooks';

export const useTopicsList = () => {
  const { topics } = useTopics();

  return { topics };
};
