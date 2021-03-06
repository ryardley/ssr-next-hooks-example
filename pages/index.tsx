import React from "react";
import { withSsrHooks } from "../lib/withSsrHooks";
import { useInteraction } from "../components/useInteraction";
import { getName } from "../funcs/getName";
import NestedHook from "../components/NestedHook";

// withSsrHooks can be added via babel transform wrapping whatever is exported by `export default`
export default withSsrHooks(() => {
  const [data] = useInteraction(getName, 2);

  return (
    <div>
      <h1>Hello {data?.name}</h1>
      <ul>
        <li>
          <NestedHook />
        </li>
      </ul>
    </div>
  );
});
