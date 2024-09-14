import { zodResolver } from '@hookform/resolvers/zod';
import { useActiveUser, useNewEvent } from 'nostr-hooks';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useGlobalNdk, useLoginModalState, useNip29Ndk } from '@/shared/hooks';
import { Topic, TopicMetadata } from '@/shared/types';
import { useToast } from '@/shared/components/ui/use-toast';

const metadataFormSchema = z.object({
  name: z.string().min(5, {
    message: 'Username must be at least 5 characters.',
  }),
  picture: z.union([
    z.string().url({
      message: 'Please enter a valid URL.',
    }),
    z.literal(''),
  ]),
  about: z.string().optional(),
});

export const useTopicDetailsEdit = ({
  topic,
  setEditMode,
}: {
  topic: Topic | undefined;
  setEditMode: (value: boolean) => void;
}) => {
  const { globalNdk } = useGlobalNdk();
  const { nip29Ndk } = useNip29Ndk();
  const { openLoginModal } = useLoginModalState();

  const { activeUser } = useActiveUser({ customNdk: globalNdk });
  const { createNewEvent } = useNewEvent({ customNdk: nip29Ndk });

  const { toast } = useToast();

  const updateTopicMetadata = (
    topicMetadata: TopicMetadata,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    if (!activeUser) {
      openLoginModal();
      return;
    }

    const event = createNewEvent();
    event.kind = 9002;
    event.tags = [
      ['h', topicMetadata.id],
      ['name', topicMetadata?.name],
      ['about', topicMetadata?.about],
      ['picture', topicMetadata?.picture],
    ];
    event.publish().then((r) => {
      r.size > 0 ? onSuccess?.() : onError?.();
    });
  };

  const metadataForm = useForm<z.infer<typeof metadataFormSchema>>({
    resolver: zodResolver(metadataFormSchema),
    defaultValues: {
      name: topic?.name,
      about: topic?.about,
      picture: topic?.picture,
    },
  });

  function onSubmit(values: z.infer<typeof metadataFormSchema>) {
    const updatedTopic: TopicMetadata = {
      id: topic?.id,
      name: values.name,
      picture: values.picture,
      about: values.about,
    } as TopicMetadata;

    updateTopicMetadata(
      updatedTopic,
      () => toast({ title: 'Success', description: 'Topic updated successfully' }),
      () =>
        toast({ title: 'Error', description: 'Failed to update topic', variant: 'destructive' }),
    );

    setEditMode(false);
  }

  return { metadataForm, onSubmit };
};
