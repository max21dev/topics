import { PostList } from '@/features/posts';
import { RelaySelectDropdown, RelayTopicsCount } from '@/features/relays';
import { TopicBottomBar, TopicsFilterDropdown, TopicsList, TopicTopBar } from '@/features/topics';
import { ActiveUserInfo } from '@/features/users';

import { ModeToggle } from '@/shared/components/mode-toggle';
import { Sidebar } from '@/shared/components/sidebar';

import { cn } from '@/shared/utils';

import { useHomePage } from './hooks';

export function HomePage() {
  const { isCollapsed, activeTopicId, activeUser } = useHomePage();

  return (
    <>
      <div className="flex w-full h-full">
        <Sidebar>
          <div className="flex flex-col w-full h-full">
            <div className="p-2">
              <div className="flex gap-1">
                {!isCollapsed && <ModeToggle />}

                <RelaySelectDropdown />
              </div>

              {activeUser?.pubkey && (
                <div className="mt-2 flex gap-1">
                  <TopicsFilterDropdown />
                </div>
              )}
            </div>

            <div className="p-2">{!isCollapsed && <RelayTopicsCount />}</div>

            <div
              className={cn(
                'p-2 flex flex-col h-full gap-4 overflow-y-hidden hover:overflow-y-auto',
                isCollapsed && 'justify-center',
              )}
            >
              <TopicsList />
            </div>

            <div className="mt-auto w-full">
              <ActiveUserInfo />
            </div>
          </div>
        </Sidebar>

        <div className="w-full">
          <div className="flex flex-col justify-between w-full h-full">
            {!activeTopicId ? (
              <div className="flex justify-center items-center h-full">Please select a Topic</div>
            ) : (
              <>
                <TopicTopBar />
                <PostList />
                <TopicBottomBar />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
