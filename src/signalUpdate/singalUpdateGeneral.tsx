import { useEffect, useMemo, useState } from "react";
import useSignal from "../signal/createSignal";
import React from "react";
import { ShowProps, SignalUpdateDependencies } from "./singalUdate.types";
import { SignalSetter } from "../signal/createSignal.types";

function SignalUpdateGeneral<T>({
  fn,
  deps,
  showProps,
  useMemoProps,
}: {
  fn: any;
  deps: SignalUpdateDependencies<T>;
  showProps?: ShowProps;
  useMemoProps?: {
    setMemoizedValue: SignalSetter<T>;
  };
}) {
  const [showSignal, setShowSignal] = useSignal(<></>);

  const signalUpdateId = useMemo(() => {
    return Math.random().toString(8).slice(2);
  }, []);

  const [state, setState] = useState(
    deps.map((dep) => {
      return false;
    })
  );

  useEffect(() => {
    deps.forEach((dep, currentIndex) => {
      dep.signal.current = {
        ...dep.signal.current,
        [signalUpdateId]: { arrayIndex: currentIndex, setState },
      };
    });
    return () => {
      deps.forEach((dep) => {
        const entryFound = dep.signal.current[signalUpdateId];
        if (entryFound) {
          const copiedObject = { ...dep.signal.current };
          delete copiedObject[signalUpdateId];
          dep.signal.current = copiedObject;
        }
      });
    };
  }, []);

  useEffect(() => {
    const value = fn();
    if (useMemoProps) {
      useMemoProps.setMemoizedValue(value);
    }

    if (showProps) {
      if (value === true) {
        setShowSignal(showProps.jsx);
      } else {
        let jsxToSet: JSX.Element | null = null;

        showProps.elseIfs?.forEach((ele) => {
          const elseIFValue = ele[0]();
          if (elseIFValue && !jsxToSet) {
            jsxToSet = ele[1];
          }
        });

        jsxToSet = !jsxToSet ? showProps.fallback ?? null : jsxToSet;
        setShowSignal(jsxToSet ?? <></>);
      }
    }
  }, [state]);

  return <>{showSignal.jsx()}</>;
}

export default SignalUpdateGeneral;
