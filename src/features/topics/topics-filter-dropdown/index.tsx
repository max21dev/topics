import { Filter } from 'lucide-react';

import { Button } from '@/shared/components/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu.tsx';

import { useTopicFilterDropDown } from './hooks';

export const TopicsFilterDropdown = () => {
  const { setBelongTo, setManage, setOwn, setNotJoined, topicsFilter, isCollapsed } =
    useTopicFilterDropDown();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {isCollapsed ? (
            <Button variant="outline">
              <Filter />
            </Button>
          ) : (
            <Button variant="outline" className="w-full">
              {'Apply filter for Topics list'}
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          <DropdownMenuLabel>Show Topics that:</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={topicsFilter?.belongTo} onCheckedChange={setBelongTo}>
            I belong to
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={topicsFilter?.manage} onCheckedChange={setManage}>
            I manage
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            disabled={true}
            checked={topicsFilter?.own}
            onCheckedChange={setOwn}
          >
            I own
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={topicsFilter?.notJoined}
            onCheckedChange={setNotJoined}
          >
            I haven't joined
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
