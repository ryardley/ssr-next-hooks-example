import fetch from "isomorphic-fetch";
import { createClientFunction } from "../lib/withSsrHooks";

// Simulates calling an RPC function
export const getName = createClientFunction("getName", async (id: number) => {
  const url = `http://localhost:3000/api/data/${id}`;
  const response = await fetch(url);
  return await response.json();
});
