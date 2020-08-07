import { NextApiRequest, NextApiResponse } from "next";
import { saveReport, IReport } from "../../services/database";
import { getSession } from "next-auth/client";

export default async function report(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
  }

  switch (req.method) {
    case "POST":
      const bodyObj = JSON.parse(req.body) as IReport;
      bodyObj.reportElements = [];
      const result = await saveReport(bodyObj);
      res.status(200).json(result);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
