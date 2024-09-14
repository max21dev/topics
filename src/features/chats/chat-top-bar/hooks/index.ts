import { useActiveTopic, useTopic } from '@/shared/hooks';
import { useStore } from '@/shared/store';

export const useChatTopBar = () => {
  const { activeTopicId } = useActiveTopic();
  const { topic, status } = useTopic(activeTopicId);

  const isTopicDetailsOpen = useStore((state) => state.isTopicDetailsOpen);
  const toggleTopicDetails = useStore((state) => state.toggleTopicDetails);

  return {
    topic,
    status,
    isTopicDetailsOpen,
    toggleTopicDetails,
    activeTopicId,
  };
};
