import { useRelayTopicsCount } from './hooks';

export const RelayTopicsCount = () => {
  const { relayTopicsCount } = useRelayTopicsCount();

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center text-2xl">
        <span className="font-medium">Topics</span>
        <span className="text-zinc-300">({relayTopicsCount})</span>
      </div>
    </div>
  );
};
