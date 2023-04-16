import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import debounceFn from "./debounce";

export interface EventSpyProps {
  debounce: number;
  name: string;
  onEvent: any;
  target: any;
}

const EventSpy = ({ debounce = 200, name, onEvent, target }: EventSpyProps) => {
  // We need to save the "onEvent" to ref.
  // This is because "onEvent" may change from time to time, but debounce may still fire to the older callback.
  const onEventRef = useRef<any>();

  onEventRef.current = onEvent;

  const debouncer = useMemo(
    () =>
      debounceFn((event: any) => {
        const { current } = onEventRef;

        current && current(event);
      }, debounce),
    [debounce, onEventRef]
  );

  const handleEvent = useCallback(
    (event: any) => {
      event.timeStampLow = Date.now();

      debouncer(event);
    },
    [debouncer]
  );

  useLayoutEffect(() => {
    target.addEventListener(name, handleEvent, { passive: true });
    handleEvent({ target, type: name });

    return () => target.removeEventListener(name, handleEvent);
  }, [name, handleEvent, target]);

  return null;
};

export default EventSpy;
