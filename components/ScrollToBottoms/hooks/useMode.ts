import useStateContext from "./internal/useStateContext";

export default function useMode() {
  const { mode }: any = useStateContext(1);

  return [mode];
}
