import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path, { resolve } from "path";
import { randomId } from "../../lib/utils";

const fileMap: Record<string, string> = {
  png: "images",
  mp4: "videos",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
    return;
  }

  const { data, ext } = JSON.parse(req.body || {});

  if (!data || !ext || !fileMap[ext]) {
    res.status(400).json({ message: "Missing required dataUrl and ext" });
    return;
  }

  const fileName = `${randomId()}.${ext}`;

  const currentFolder = resolve(process.cwd(), 'public/static');

  const folderPath = resolve(process.cwd(), `public/static/${fileMap[ext]}`);
  const filePath = resolve(process.cwd(), `public/static/${fileMap[ext]}`, fileName);
  
  console.log('folderPath: ', folderPath);
  console.log('filePath: ', filePath);

  if (!fs.existsSync(folderPath)) {
    console.log('inside check: creaig fodler')
    fs.mkdirSync(folderPath, {recursive: true});
  }
  
  const base64Data = data.replace(/^data:(.*?);base64,/, "").replace(/\s/g, "");
  await fs.writeFile(filePath, base64Data, "base64", function (err) {
    if (err) {
      console.log(err);
      res.status(500).end("Internal Server Error");
    } else {
      res.status(200).json({
        result: fileName,
      });
    }
  });
  // const filePath = path.resolve(
  //   __dirname,
  //   `../../../../public/static/${fileMap[ext]}`,
  //   fileName
  // );

}
