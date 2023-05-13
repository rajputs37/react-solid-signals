import { Provider, useSelector } from "react-redux";
import React from "react";
import type { EqualityFn } from "react-redux";
import { SignalGetter } from "../signal/createSignal.types";
import { useEffect, useMemo } from "react";
import useSignal from "../signal/createSignal";
import ReactDOM from "react-dom";

interface TypedUseSelectorSignalHook<TState> {
  <TSelected>(
    selector: (state: TState) => TSelected,
    defaultValue: TSelected,
    equalityFn?: EqualityFn<TSelected>
  ): SignalGetter<TSelected>;
}
function ReduxSignalComponent<TState = unknown, Selected = unknown>({
  selector,
  setSignal,
  equalityFn,
}: {
  selector: (state: TState) => Selected;
  setSignal: any;
  equalityFn?: EqualityFn<Selected> | undefined;
}) {
  const value = useSelector(selector, equalityFn);

  useEffect(() => {
    setSignal(value);
  }, [value]);

  return <></>;
}

function signalStoreInitializer(store: any) {
  return function useSignalSelector<TState = unknown, Selected = unknown>(
    selector: (state: TState) => Selected,
    defaultValue: Selected,
    equalityFn?: EqualityFn<Selected> | undefined
  ) {
    const signalComponentId = useMemo(() => {
      return Math.random().toString(8).slice(2);
    }, []);
    const [signal, setSignal] = useSignal<Selected>(defaultValue);

    useEffect(() => {
      const signalUpdateComponent = (
        <Provider store={store}>
          <ReduxSignalComponent
            selector={selector}
            setSignal={setSignal}
            equalityFn={equalityFn}
          />
        </Provider>
      );
      const alreadyAddedNode = document.getElementById(signalComponentId);

      if (!alreadyAddedNode) {
        const newNode = document.createElement(`div`);
        newNode.id = signalComponentId;

        document.body?.appendChild(newNode);
        ReactDOM.render(signalUpdateComponent, newNode);
      }

      return () => {
        const nodeFound = document.getElementById(signalComponentId);
        if (nodeFound) {
          ReactDOM.unmountComponentAtNode(nodeFound);
          document.body?.removeChild(nodeFound);
        }
      };
    }, []);

    return signal;
  };
}

export { signalStoreInitializer, TypedUseSelectorSignalHook };
