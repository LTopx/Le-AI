import useStateContext from "./internal/useStateContext";

export default function useAtEnd() {
  const { atEnd }: any = useStateContext(1);

  return [atEnd];
}
