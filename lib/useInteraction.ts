import React from "react";
import { processInput } from "./withSsrHooks";

export function useInteraction(interaction: Function, args: any) {
  const [data, setData] = React.useState(processInput(interaction, args));
  async function callComputation(input_) {
    const result = await interaction(input_);
    setData(result);
  }
  return [data, callComputation];
}
