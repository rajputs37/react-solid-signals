import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import React from "react";
import {
  CompoentRenderProps,
  SignalGetter,
  SignalSetter,
} from "./createSignal.types";

const batchUpdate =
  ReactDOM.unstable_batchedUpdates || ((fn: () => void) => fn());

const isPrimitiveValue = (data: unknown) => typeof data !== "object";

function useSignal<T>(initialValue: T): [SignalGetter<T>, SignalSetter<T>] {
  const valRef = useRef<T>(initialValue);
  const signalSetters = useRef<SignalSetter<T>[]>([]);

  const signalRef = useRef<{
    [key: string]: {
      arrayIndex: number;
      setState: Dispatch<SetStateAction<boolean[]>>;
    };
  }>({});

  const Render = ({ keyPath, mapCallback }: CompoentRenderProps) => {
    const [value, setValue] = useState(valRef.current);

    useEffect(() => {
      signalSetters.current.push(setValue);
      return () => {
        const index = signalSetters.current.indexOf(setValue);
        signalSetters.current.splice(index, 1);
      };
    }, []);

    if (!Array.isArray(keyPath)) {
      return value;
    }

    const subVal = keyPath.reduce((obj: any, key: string) => obj[key], value);

    return mapCallback ? subVal.map(mapCallback) : subVal;
  };

  const proxyCallback = useCallback((obj: any, keyPath: string[]): T => {
    return new Proxy(obj, {
      get: (target, key: string) => {
        const val = target[key];

        if (key === "map" && val === Array.prototype.map) {
          const fakeArrayMap = (
            mapCallback: CompoentRenderProps["mapCallback"]
          ) => {
            return <Render keyPath={keyPath} mapCallback={mapCallback} />;
          };
          return fakeArrayMap;
        }

        keyPath.push(key);

        if (isPrimitiveValue(val) || React.isValidElement(val)) {
          return <Render keyPath={keyPath} />;
        }

        return proxyCallback(val, keyPath);
      },
    }) as T;
  }, []);

  return useMemo(() => {
    return [
      {
        jsx: () => {
          if (
            isPrimitiveValue(valRef.current) ||
            React.isValidElement(valRef.current)
          ) {
            return (<Render />) as T;
          }

          return proxyCallback(valRef.current, []);
        },
        value: () => {
          return valRef.current;
        },
        signal: signalRef,
      },
      (payload: SetStateAction<T>) => {
        const getUpdatedVal = (prev: T) =>
          payload instanceof Function ? payload(prev) : payload;

        if (signalSetters.current.length === 0) {
          valRef.current = getUpdatedVal(valRef.current);
        } else {
          batchUpdate(() => {
            signalSetters.current.forEach((signalSetter) => {
              signalSetter((prev) => (valRef.current = getUpdatedVal(prev)));
            });

            for (const key in signalRef.current) {
              const signalListener = signalRef.current[key];
              signalListener.setState((prev) => {
                const copy = [...prev];
                copy[signalListener.arrayIndex] =
                  !prev[signalListener.arrayIndex];
                return copy;
              });
            }
          });
        }
      },
    ];
  }, [proxyCallback]);
}

export default useSignal;
