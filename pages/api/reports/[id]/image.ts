import { NextApiRequest, NextApiResponse } from "next";
import uploadS3File from "../../../../services/s3uploader";

export default async function addImage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      const params = JSON.parse(req.body);
      const [s3Url, filePath] = await uploadS3File(
        params.fileName,
        params.contentType
      );
      res.status(200).json({ uploadPath: s3Url, filePath });
      break;
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
