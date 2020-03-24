import { useInteraction } from "../lib/useInteraction";
import { getName } from "../funcs/getName";
export default () => {
  const [data] = useInteraction(getName, 1);

  return <div>Nested: {data?.name}</div>;
};
