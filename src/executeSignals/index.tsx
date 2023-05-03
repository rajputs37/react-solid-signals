import { SignalUpdateDependencies } from "../signalUpdate/singalUdate.types";
import SignalUpdateGeneral from "../signalUpdate/singalUpdateGeneral";
import React from "react";

function Show<T>({
  deps,
  jsxCallback,
}: {
  deps: SignalUpdateDependencies<T>;
  jsxCallback: () => JSX.Element | null;
}) {
  return (
    <SignalUpdateGeneral
      deps={deps}
      fn={() => {}}
      executeProps={{ executeSignalFunction: jsxCallback }}
    />
  );
}

export default Show;
