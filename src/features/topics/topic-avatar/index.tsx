import { Avatar, AvatarImage } from '@/shared/components/ui/avatar';

import { getAvatarFallbackColor, loader } from '@/shared/utils';

import { useTopicAvatar } from './hooks';

export const TopicAvatar = ({ topicId }: { topicId: string | undefined }) => {
  const { picture, name } = useTopicAvatar(topicId);

  return (
    <Avatar
      className={`flex justify-center items-center ${!picture ? getAvatarFallbackColor(topicId + (name || '')) : ''}`}
    >
      {picture ? (
        <AvatarImage
          src={loader(picture, { w: 50, h: 50 })}
          alt={name}
          width={6}
          height={6}
          className="w-10 h-10"
        />
      ) : (
        <span className="text-white text-lg">{name?.[0].toUpperCase()}</span>
      )}
    </Avatar>
  );
};
