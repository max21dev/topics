import { Edit, Undo2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';

import { TopicDetailsEdit, TopicDetailsView } from '@/features/topics';

import { useTopicDetails } from './hooks';

export const TopicDetails = ({ topicId }: { topicId: string }) => {
  const { admins, topic, members, canEditMetadata } = useTopicDetails({ topicId });
  const [editMode, setEditMode] = useState(false);

  return (
    <div>
      {canEditMetadata && (
        <Button variant="outline" onClick={() => setEditMode(!editMode)}>
          {editMode ? <Undo2 className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
          {editMode ? 'Back to view mode' : 'Edit'}
        </Button>
      )}
      {editMode ? (
        <TopicDetailsEdit setEditMode={setEditMode} topic={topic} />
      ) : (
        <TopicDetailsView topic={topic} admins={admins} members={members} />
      )}
    </div>
  );
};
