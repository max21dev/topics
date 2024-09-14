import { useStore } from '@/shared/store';

export const useActiveTopic = () => {
  const activeTopicId = useStore((state) => state.activeTopicId);
  const setActiveTopicId = useStore((state) => state.setActiveTopicId);

  return { activeTopicId, setActiveTopicId };
};
