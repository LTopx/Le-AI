import useStateContext from "./internal/useStateContext";

export default function useAtBottom() {
  const { atBottom }: any = useStateContext(1);

  return [atBottom];
}
