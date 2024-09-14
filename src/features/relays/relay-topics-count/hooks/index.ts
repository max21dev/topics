import { useTopics } from '@/shared/hooks';

export const useRelayTopicsCount = () => {
  const { topics } = useTopics();

  return { relayTopicsCount: topics.length };
};
