import { TopicsListItem } from '@/features/topics';

import { useTopicsList } from './hooks';

export const TopicsList = () => {
  const { topics } = useTopicsList();

  return topics.map((topic) => <TopicsListItem key={topic.id} topicId={topic.id} />);
};
