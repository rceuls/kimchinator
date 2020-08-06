import { NextApiRequest, NextApiResponse } from "next";
import formidable, { Fields, Files } from "formidable";
import * as fs from "fs";
import uploadS3File from "../../../../services/s3uploader";

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
      const uploadPath = `./tmp/${req.query.id}`;
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
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
      const s3Url = await uploadS3File(
        parsed.image.name,
        parsed.image.type,
        fs.readFileSync(parsed.image.path)
      );
      fs.unlinkSync(parsed.image.path);
      res.status(200).json({ path: s3Url });
      break;
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
