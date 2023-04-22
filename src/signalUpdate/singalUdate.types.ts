import { SignalGetter } from "../signal/createSignal.types";

type SignalUpdateDependencies<T> = Array<SignalGetter<T>>;
type ShowElseIfs = Array<[() => boolean, JSX.Element]>;

type ShowProps = {
  jsx: JSX.Element;
  fallback?: JSX.Element;
  elseIfs?: ShowElseIfs;
};

export { SignalUpdateDependencies, ShowProps, ShowElseIfs };
