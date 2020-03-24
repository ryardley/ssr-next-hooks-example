import fetch from "isomorphic-fetch";

// Simulates calling an RPC function
export async function getName(id: number) {
  const url = `http://localhost:3000/api/data/${id}`;
  const response = await fetch(url);
  return await response.json();
}
