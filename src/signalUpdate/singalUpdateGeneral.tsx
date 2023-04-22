import { useEffect, useMemo, useState } from "react";
import useSignal from "../signal/createSignal";
import React from "react";
import { ShowProps, SignalUpdateDependencies } from "./singalUdate.types";

function SignalUpdateGeneral<T>({
  fn,
  deps,
  showProps,
}: {
  fn: any;
  deps: SignalUpdateDependencies<T>;
  showProps?: ShowProps;
}) {
  const [showSignal, setShowSignal] = useSignal(<></>);

  const useSignalId = useMemo(() => {
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
        [useSignalId]: { arrayIndex: currentIndex, setState },
      };
    });
    return () => {
      deps.forEach((dep) => {
        const entryFound = dep.signal.current[useSignalId];
        if (entryFound) {
          const copiedObject = { ...dep.signal.current };
          delete copiedObject[useSignalId];
          dep.signal.current = copiedObject;
        }
      });
    };
  }, []);

  useEffect(() => {
    const value = fn();
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
        jsxToSet && setShowSignal(jsxToSet);
      }
    }
  }, [state]);

  return <>{showSignal.jsx()}</>;
}

export default SignalUpdateGeneral;
