import { Table, Image, Form, TextArea, Button } from "semantic-ui-react";
import LocationDropDown from "../../components/LocationDropDown";
import { useState } from "react";
import { IReport } from "../api/reportDetail";

function ReportRow(props: {
  image: string;
  location?: string;
  description: string;
  descriptionChanged: (newValue: string) => void;
  locationChanged: (newValue: string) => void;
}) {
  const [description, setDescription] = useState<string>(props.description);
  const [location, setLocation] = useState<string | undefined>(props.location);

  return (
    <Table.Row>
      <Table.Cell width="four">
        <Image src={props.image} rounded size="large" />
      </Table.Cell>
      <Table.Cell width="two">
        <LocationDropDown
          onChange={(e) => {
            setLocation(e as string);
            props.locationChanged(e as string);
          }}
          initialValue={location}
        />
      </Table.Cell>
      <Table.Cell width="ten">
        <Form>
          <TextArea
            rows={11}
            style={{ resize: "none" }}
            onChange={(_, p) => {
              setDescription(p.value.toString());
              props.descriptionChanged(p.value.toString());
            }}
            value={description}
          />
        </Form>
      </Table.Cell>
    </Table.Row>
  );
}

export default function ReportOverview() {
  const [items, setItems] = useState<IReport>({
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
  });
  return (
    <>
      <Table basic="very" celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Picture</Table.HeaderCell>
            <Table.HeaderCell>Location</Table.HeaderCell>
            <Table.HeaderCell>Comment</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.reportElements.map((x, i) => (
            <ReportRow
              key={x.id}
              {...x}
              descriptionChanged={(e) => {
                items.reportElements[i].description = e;
                setItems(items);
              }}
              locationChanged={(e) => {
                items.reportElements[i].location = e;
                setItems(items);
              }}
            />
          ))}
        </Table.Body>
      </Table>
      <Button type="submit" onClick={() => console.log(items)}>
        Submit
      </Button>
    </>
  );
}
