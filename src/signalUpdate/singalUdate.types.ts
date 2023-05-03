import { SignalGetter } from "../signal/createSignal.types";

type SignalUpdateDependencies<T> = Array<SignalGetter<T>>;

export { SignalUpdateDependencies };
