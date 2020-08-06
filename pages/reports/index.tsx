import { getReports, IReport } from "../../services/database";
import { useState } from "react";
import { Table } from "semantic-ui-react";
import Link from "next/link";

export default function ReportIndex({ allReports }) {
  const [reports] = useState<IReport[]>(allReports);
  return (
    <Table basic="very" celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Date</Table.HeaderCell>
          <Table.HeaderCell># Remarks</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {reports.map((x, i) => (
          <Table.Row key={i}>
            <Table.Cell>{x.name}</Table.Cell>
            <Table.Cell>{new Date(x.date).toDateString()}</Table.Cell>
            <Table.Cell>{x.reportElements.length}</Table.Cell>
            <Table.Cell>
              <Link href={`/reports/${x._id}`}>
                <a>Edit</a>
              </Link>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

export async function getServerSideProps() {
  return { props: { allReports: await getReports() } };
}
