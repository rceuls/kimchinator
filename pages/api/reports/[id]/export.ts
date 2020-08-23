import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { getReport } from "../../../../services/database";
import pdfkit from "pdfkit";

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
      const report = await getReport(params.id as string);
      if (!report) {
        res.status(404);
      }
      const reportPdf = await createPdf(report);
      res.status(200).json({});
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function createPdf(report: Report) {
  foreach();
}
