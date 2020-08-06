import { NextApiRequest, NextApiResponse } from "next";
import { updateReport } from "../../../services/database";

export default async function reportDetail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
    body,
  } = req;

  switch (method) {
    case "PUT":
      // Update or create data in your database
      updateReport(JSON.parse(body), id as string);
      res.status(200).json({});
      break;
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
