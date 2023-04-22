import { SignalUpdateDependencies } from "./singalUdate.types";
import SignalUpdateGeneral from "./singalUpdateGeneral";
import React from "react";

function SignalUpdate<T>({
  fn,
  deps,
}: {
  fn: () => void;
  deps: SignalUpdateDependencies<T>;
}) {
  return <SignalUpdateGeneral fn={fn} deps={deps} />;
}

export default SignalUpdate;
