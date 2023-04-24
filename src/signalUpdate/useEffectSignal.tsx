import { useEffect, useMemo, useState } from "react";
import useSignal from "../signal/createSignal";
import { SignalUpdateDependencies } from "../signalUpdate/singalUdate.types";
import ReactDOM from "react-dom";
import SignalUpdateGeneral from "../signalUpdate/singalUpdateGeneral";
import React from "react";

function useEffectSignal<T>(fn: () => any, deps: SignalUpdateDependencies<T>) {
  const signalComponentId = useMemo(() => {
    return Math.random().toString(8).slice(2);
  }, []);

  useEffect(() => {
    const signalUpdateComponent = <SignalUpdateGeneral deps={deps} fn={fn} />;
    const alreadyAddedNode = document.getElementById(signalComponentId);
    if (!alreadyAddedNode) {
      const newNode = document.createElement(`div`);
      newNode.id = signalComponentId;

      document.body.appendChild(newNode);
      ReactDOM.render(
        signalUpdateComponent,
        document.getElementById(signalComponentId)
      );
    }

    return () => {
      const nodeFound = document.getElementById(signalComponentId);
      if (nodeFound) {
        ReactDOM.unmountComponentAtNode(nodeFound);
        document.body.removeChild(nodeFound);
      }
    };
  }, []);

  return null;
}

export default useEffectSignal;
