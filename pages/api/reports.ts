import { NextApiRequest, NextApiResponse } from "next";
import { saveReport } from "../../services/database";
import { getSession } from "next-auth/client";
import { IReport } from "../../services/model";

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
      const bodyObj: IReport = {
        ...(JSON.parse(req.body) as IReport),
        reportElements: [],
        addedBy: session.user.email,
        addedOn: new Date(),
      };
      const result = await saveReport(bodyObj);
      res.status(200).json(result);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
