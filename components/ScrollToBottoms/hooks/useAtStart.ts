import useStateContext from "./internal/useStateContext";

export default function useAtStart() {
  const { atStart }: any = useStateContext(1);

  return [atStart];
}
