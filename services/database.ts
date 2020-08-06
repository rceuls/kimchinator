import { MongoClient, ObjectID } from "mongodb";

export interface IReport {
  _id: string;
  name: string;
  date: string;
  reportElements: Array<{
    image: string;
    description: string;
    location?: string;
    id: string;
  }>;
}

const client = new MongoClient("mongodb://localhost:27017/test-dev", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connect() {
  if (!client.isConnected()) await client.connect();
}

export async function saveReport(report: IReport) {
  await connect();
  const result = await client.db().collection("reports").save(report);
  if (result.ops.length !== 1) {
    throw new Error("Could not persist report");
  }
  return result.ops[0] as IReport;
}

export async function getReports() {
  await connect();
  const result = (
    await client.db().collection("reports").find({}).toArray()
  ).map((x) => ({
    ...x,
    date: x.date.toString(),
    _id: x._id.toString(),
  }));
  return result as IReport[];
}

export async function getReport(id: string) {
  await connect();
  const result = (await client
    .db()
    .collection("reports")
    .findOne({ _id: new ObjectID(id) })) as IReport;
  return {
    ...result,
    _id: result._id.toString(),
    date: result.date.toString(),
  };
}
