import React from "react";
import { withSsrHooks } from "../lib/withSsrHooks";
import { useInteraction } from "../lib/useInteraction";
import { getName } from "../funcs/getName";

export default withSsrHooks(() => {
  const [data] = useInteraction(getName, 2);

  return <h1>Hello {data?.name}</h1>;
});
