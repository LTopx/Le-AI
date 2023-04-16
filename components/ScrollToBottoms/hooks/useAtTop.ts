import useStateContext from "./internal/useStateContext";

export default function useAtTop() {
  const { atTop }: any = useStateContext(1);

  return [atTop];
}
