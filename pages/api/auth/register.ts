// NextJS api
import type { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "../../../lib/passwordUtils";
import db from "../_db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // username and password from request body
  const { username, password } = JSON.parse(req.body || {});
  await db.read();

  console.log("credentials", db.chain.get("credentials").value());

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (!username || !password) {
    return res.status(400).json({
      message: "Please provide username and password",
    });
  }

  // check if user exists
  const user = db.chain.get("credentials").find({ username }).value();

  if (user) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashed = await hashPassword(password);
  console.log("hashed: ", hashed);

  db.data?.credentials.push({
    username,
    password: hashed,
  });

  await db.write();

  res.status(200).json({ username });
}
