import { NextApiRequest, NextApiResponse } from "next";

export default function report(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
    body,
  } = req;

  switch (method) {
    case "POST":
      // Update or create data in your database
      console.log(body);
      const bodyObj = JSON.parse(body);
      bodyObj.id = 12;
      res.status(200).json(JSON.stringify(bodyObj));
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
