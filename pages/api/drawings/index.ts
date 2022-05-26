import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { randomId } from "../../../lib/utils";
import db from "../_db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  await db.read();

  if (req.method === "GET") {
    const drawings = db.chain.get("drawings").value() || [];

    const publicDrawings = drawings.filter((drawing) => drawing.isPublic);
    const userDrawings =
      session && session.user?.name
        ? drawings
            .filter((drawing) => !drawing.isPublic)
            .filter((drawing) => drawing.owner === session?.user?.name)
        : [];

    return res.send({
      drawings: [...publicDrawings, ...userDrawings],
    });
  }

  if (req.method === "POST") {
    if (!session || !session.user?.name) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      isPublic = true,
      createdAt = Date.now(),
      duration,
      imageFileName,
      videoFileName,
    } = JSON.parse(req.body || {});

    if (!imageFileName || !videoFileName) {
      return res.status(400).json({ message: "Missing image and/or video" });
    }

    db.data?.drawings.push({
      id: randomId(),
      owner: session.user.name,
      isPublic,
      createdAt,
      duration,
      imageFileName,
      videoFileName,
    });

    await db.write();

    return res.status(200).json({ message: "OK" });
  }
}
