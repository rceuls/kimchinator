import { getReports } from "../../services/database";
import { useState } from "react";
import { Table, Icon, Button, ButtonGroup } from "semantic-ui-react";
import Link from "next/link";
import { IReport } from "../../services/model";

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
              <ButtonGroup>
                <Link href={`/reports/${x._id}`}>
                  <Button animated="vertical">
                    <Button.Content hidden>Edit</Button.Content>
                    <Button.Content visible>
                      <Icon name="edit" />
                    </Button.Content>
                  </Button>
                </Link>
                <Link href={`/reports/${x._id}/pdf`}>
                  <Button animated="vertical">
                    <Button.Content hidden>PDF</Button.Content>
                    <Button.Content visible>
                      <Icon name="file pdf" />
                    </Button.Content>
                  </Button>
                </Link>
              </ButtonGroup>
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
