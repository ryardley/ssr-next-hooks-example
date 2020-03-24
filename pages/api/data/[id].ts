import { NextApiRequest, NextApiResponse } from "next";

// Simulated RPC server
export default (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const output = id === "1" ? { name: "Bob" } : { name: "Jane" };

  res.send(JSON.stringify(output));
};
