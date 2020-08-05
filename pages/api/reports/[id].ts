import { NextApiRequest, NextApiResponse } from "next";

export interface IReport {
  id: string;
  reportElements: Array<{
    image: string;
    description: string;
    location?: string;
    id: string;
  }>;
}

export function getReportDetail(id: string) {
  return {
    id: "abc",
    reportElements: [
      {
        description: "the hills are alive",
        location: "3",
        image: "https://baconmockup.com/1024/768/",
        id: "1",
      },
      {
        description: "with the sound of music",
        image: "https://baconmockup.com/1024/768/",
        id: "2",
      },
    ],
  };
}

export default function reportDetail(
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
      console.log(body);
      res.status(200).json({});
      break;
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
