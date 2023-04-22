import { Dispatch, MutableRefObject, SetStateAction } from "react";

type NormalGetter<T> = () => T;

type SignalGetter<T> = {
  jsx: NormalGetter<T>;
  value: NormalGetter<T>;
  signal: MutableRefObject<{
    [key: string]: {
      arrayIndex: number;
      setState: Dispatch<SetStateAction<boolean[]>>;
    };
  }>;
};
type SignalSetter<T> = Dispatch<SetStateAction<T>>;

type CompoentRenderProps = {
  keyPath?: string[];
  mapCallback?: (...args: unknown[]) => unknown;
};

export { CompoentRenderProps, SignalGetter, SignalSetter, NormalGetter };
