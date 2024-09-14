import { TopicAvatar } from '@/features/topics';
import { UserInfoRow } from '@/features/users';

import { Topic, TopicAdminPermission } from '@/shared/types';

export const TopicDetailsView = ({
  topic,
  admins,
  members,
}: {
  topic: Topic | undefined;
  admins:
    | {
        publicKey: string;
        permissions: TopicAdminPermission[];
      }[]
    | undefined;
  members:
    | {
        publicKey: string;
      }[]
    | undefined;
}) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col items-center min-h-3">
        <TopicAvatar key={topic?.id} topicId={topic?.id} />
        <div className="text-sm font-light mt-2">{topic?.id}</div>
        <div className="text-lg font-medium">{topic?.name}</div>
        <div className="text-sm text-gray-600 mb-4">{topic?.about}</div>
      </div>
      <div className="m-0">
        {admins && (
          <div>
            <h5 className="font-medium pb-2 m-4 border-b-2 border-b-blue-100">
              Admins ({admins.length})
            </h5>
            {admins.map((admin) => (
              <UserInfoRow pubkey={admin.publicKey} key={admin.publicKey} />
            ))}
          </div>
        )}
        {members && (
          <div>
            <h5 className="font-medium pb-2 m-4 border-b-2 border-b-blue-100">
              Members ({members.length}){' '}
            </h5>
            {members.map((member) => (
              <UserInfoRow pubkey={member.publicKey} key={member.publicKey} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
