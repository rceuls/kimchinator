import { NextApiRequest, NextApiResponse } from "next";
import formidable, { Fields, Files } from "formidable";
import * as fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function addImage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      const form = new formidable.IncomingForm();
      const uploadPath = `./public/images/${req.query.id}`;
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }
      form.uploadDir = uploadPath;
      form.keepExtensions = true;
      const parsed = await new Promise<Files>((resolve, reject) => {
        form.parse(req, (err: any, fields: Fields, files: Files) => {
          if (err) {
            return reject(err);
          }
          resolve(files);
        });
      });
      res.status(200).json({ path: parsed.image.path.replace("public", "") });
      break;
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
