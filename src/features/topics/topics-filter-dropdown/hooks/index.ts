import { useStore } from '@/shared/store';

export const useTopicFilterDropDown = () => {
  const topicsFilter = useStore((state) => state.topicsFilter);
  const setTopicsFilter = useStore((state) => state.setTopicsFilter);
  const isCollapsed = useStore((state) => state.isCollapsed);
  const setBelongTo = (belongTo: boolean) => {
    setTopicsFilter({ ...topicsFilter, belongTo });
  };
  const setManage = (manage: boolean) => {
    setTopicsFilter({ ...topicsFilter, manage });
  };
  const setOwn = (own: boolean) => {
    setTopicsFilter({ ...topicsFilter, own });
  };
  const setNotJoined = (notJoined: boolean) => {
    setTopicsFilter({ ...topicsFilter, notJoined });
  };

  return {
    topicsFilter,
    setTopicsFilter,
    isCollapsed,
    setBelongTo,
    setManage,
    setOwn,
    setNotJoined,
  };
};
