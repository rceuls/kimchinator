import { NextApiRequest, NextApiResponse } from "next";
import { updateReport } from "../../../services/database";
import { getSession } from "next-auth/client";

export default async function reportDetail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
  }

  switch (req.method) {
    case "PUT":
      // Update or create data in your database
      updateReport(JSON.parse(req.body), req.query.id as string);
      res.status(200).json({});
      break;
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
