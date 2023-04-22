import {
  ShowElseIfs,
  SignalUpdateDependencies,
} from "../signalUpdate/singalUdate.types";
import SignalUpdateGeneral from "../signalUpdate/singalUpdateGeneral";
import React from "react";

function Show<T>({
  deps,
  when,
  children,
  defaultComponent,
  elseIfs,
}: {
  deps: SignalUpdateDependencies<T>;
  when: () => boolean;
  children: JSX.Element;
  defaultComponent?: JSX.Element;
  elseIfs?: ShowElseIfs;
}) {
  return (
    <SignalUpdateGeneral
      fn={when}
      deps={deps}
      showProps={{ jsx: children, fallback: defaultComponent, elseIfs }}
    />
  );
}

export default Show;
