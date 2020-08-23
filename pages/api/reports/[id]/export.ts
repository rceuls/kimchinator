import { NextApiRequest, NextApiResponse } from "next";
import uploadS3File from "../../../../services/s3uploader";
import { getSession } from "next-auth/client";

export default async function exportToPdf(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
  }

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
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
