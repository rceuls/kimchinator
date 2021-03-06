import { MongoClient, ObjectID, ObjectId } from "mongodb";
import { IReport } from "./model";

const client = new MongoClient(process.env.MONGO_CONNECTIONSTRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connect() {
  if (!client.isConnected()) {
    await client.connect();
    console.log("Connected to database");
  }
}

export async function saveReport(report: IReport) {
  await connect();
  const result = await client.db().collection("reports").save(report);
  if (result.ops.length !== 1) {
    throw new Error("Could not persist report");
  }
  return result.ops[0] as IReport;
}

export async function updateReport(report: IReport, id: string) {
  await connect();
  await client
    .db()
    .collection("reports")
    .updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          reportElements: report.reportElements,
        },
      }
    );
  return report;
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
  };
}
