import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import db, { DBData } from "../_db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = (req.query.id as string) || "";
  const session = await getSession({ req });
  await db.read();

  if (!id.trim()) {
    return res.status(400).json({ message: "Drawing id cannot be empty" });
  }

  if (req.method === "GET") {
    const drawing = db.chain.get("drawings").find({ id }).value();
    if (!drawing || drawing.id !== id) {
      return res.status(404).json({ message: "Drawing not found" });
    }

    return res.send({
      drawing,
    });
  }

  if (req.method === "DELETE") {
    const drawings = db.chain.get("drawings");

    const drawing = drawings.find({ id }).value();

    if (!drawing) {
      return res.status(404).json({
        message: "Drawing not found",
      });
    }

    if (
      !session ||
      !session?.user?.name ||
      drawing.owner !== session?.user?.name
    ) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const allDrawings = drawings.value();

    db.data = {
      ...(db.data as DBData),
      drawings: allDrawings.filter((d) => d.id !== id),
    };

    await db.write();

    return res.status(200).json({
      message: "OK",
      data: drawing,
    });
  }

  return res.status(200).json({ id });
}
