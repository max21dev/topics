import { Info, Loader2 } from 'lucide-react';

import { TopicAvatar, TopicDetails } from '@/features/topics';

import { Button } from '@/shared/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';

import { useTopicTopBar } from './hooks';

export const TopicTopBar = () => {
  const { topic, isTopicDetailsOpen, status, toggleTopicDetails, activeTopicId } = useTopicTopBar();

  return (
    <div className="w-full border-b">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-2">
          {status == 'loading' && <Loader2 className="w-6 h-6 animate-spin" />}
          {status == 'success' && (
            <>
              <TopicAvatar topicId={activeTopicId} />

              <div className="flex flex-col">
                <span className="font-light text-xs">{topic?.id}</span>
                <span className="font-bold mt-0 mb-0">{topic?.name}</span>
                <span className="text-xs">
                  {topic?.privacy} and {topic?.type}
                </span>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Sheet onOpenChange={() => toggleTopicDetails()}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info size={25} />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full lg:max-w-screen-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle />
                <SheetDescription />
              </SheetHeader>
              {isTopicDetailsOpen && activeTopicId && (
                <div className="grid gap-4 py-4">
                  <TopicDetails topicId={activeTopicId} />
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* <div className="p-2 border-t"></div> */}
    </div>
  );
};
