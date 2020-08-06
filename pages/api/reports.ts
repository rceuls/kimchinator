import { NextApiRequest, NextApiResponse } from "next";
import { saveReport, IReport } from "../../services/database";

export default async function report(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
    body,
  } = req;

  switch (method) {
    case "POST":
      // Update or create data in your database
      const bodyObj = JSON.parse(body) as IReport;
      bodyObj.reportElements = [];
      const result = await saveReport(bodyObj);
      res.status(200).json(result);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
