import {
  Table,
  Image,
  Form,
  TextArea,
  Button,
  Grid,
  FormGroup,
  Label,
  Icon,
  Confirm,
  Segment,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import LocationDropDown from "../../components/LocationDropDown";
import { useState, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { getReport } from "../../services/database";
import { IReportElement, IReport } from "../../services/model";
import { useSession } from "next-auth/client";
import uploadImageForReport from "../../components/uploadFile";
import SemanticDatepicker from "react-semantic-ui-datepickers";

function ReportRow(props: {
  image: string;
  location?: string;
  description?: string;
  responsible?: string;
  byDate?: Date;

  descriptionChanged: (newValue: string) => void;
  locationChanged: (newValue: string) => void;
  responsibleChanged: (newValue: string) => void;
  byDateChanged: (newValue: Date) => void;
}) {
  const [description, setDescription] = useState<string>(props.description);
  const [location, setLocation] = useState<string | undefined>(props.location);
  const [responsible, setResponsible] = useState<string | undefined>(
    props.responsible
  );
  const [byDate, setByDate] = useState<Date | undefined>(
    new Date(props.byDate)
  );

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
        <SemanticDatepicker
          value={byDate}
          required={false}
          datePickerOnly
          showToday
          onChange={(_e, data) => {
            if (!Array.isArray(data.value)) {
              setByDate(data.value);
              props.byDateChanged(data.value);
            }
          }}
        />
        <Form.Input
          type="text"
          placeholder="Responsible"
          onChange={(e) => {
            setResponsible(e.target.value);
            props.responsibleChanged(e.target.value);
          }}
          value={responsible}
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
            placeholder="Description"
          />
        </Form>
      </Table.Cell>
    </Table.Row>
  );
}

export default function ReportOverview(props: { report: IReport }) {
  const [items, setItems] = useState<IReportElement[]>(
    props.report.reportElements
  );
  const [leaveRequested, setLeaveRequested] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const router = useRouter();
  const [session] = useSession();

  function navigateToOverview() {
    router.push(`/reports`);
  }

  async function uploadFile(event: ChangeEvent<HTMLInputElement>) {
    var files = event.target.files;
    const newElements = await uploadImageForReport({
      addedBy: session.user.email,
      files,
      otherItemCount: items.length,
      reportId: router.query.id,
    });
    setItems([...newElements, ...items]);
  }
  return (
    <>
      <Confirm
        open={leaveRequested}
        onCancel={(e) => {
          e.preventDefault();
          setLeaveRequested(false);
        }}
        onConfirm={(e) => {
          e.preventDefault();
          setLeaveRequested(false);
          navigateToOverview();
        }}
      />
      <Segment>
        <Dimmer active={isSaving} inverted>
          <Loader inverted>Saving...</Loader>
        </Dimmer>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Form>
                <FormGroup inline={true}>
                  <Label as="label" basic htmlFor="upload">
                    <Button
                      icon="upload"
                      label={{
                        basic: true,
                        content: "Select file(s)",
                      }}
                      labelPosition="right"
                    />
                    <input
                      hidden
                      id="upload"
                      multiple
                      type="file"
                      onChange={(e) => uploadFile(e)}
                    />
                  </Label>
                  <Label size="large">
                    <Icon name="calendar alternate outline" size="large" />
                    {new Date(props.report.date).toDateString()}
                  </Label>
                  <Label size="large">
                    <Icon name="envelope open outline" size="large" />
                    {props.report.name}
                  </Label>
                </FormGroup>
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Table basic="very" celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Picture</Table.HeaderCell>
                    <Table.HeaderCell>Info</Table.HeaderCell>
                    <Table.HeaderCell>Comment</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {items?.map((x, i) => (
                    <ReportRow
                      key={`report_row${x.id}`}
                      {...x}
                      descriptionChanged={(e) => {
                        const newArray = [...items];
                        newArray[i] = { ...items[i], description: e };
                        setItems(newArray);
                      }}
                      locationChanged={(e) => {
                        const newArray = [...items];
                        newArray[i] = { ...items[i], location: e };
                        setItems(newArray);
                      }}
                      byDateChanged={(e) => {
                        const newArray = [...items];
                        newArray[i] = { ...items[i], byDate: e };
                        setItems(newArray);
                      }}
                      responsibleChanged={(e) => {
                        const newArray = [...items];
                        newArray[i] = { ...items[i], responsible: e };
                        setItems(newArray);
                      }}
                    />
                  ))}
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Button.Group>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setLeaveRequested(true);
                  }}
                >
                  Cancel
                </Button>
                <Button.Or />
                <Button
                  positive
                  type="submit"
                  onClick={async (e) => {
                    e.preventDefault();
                    var url = `/api/reports/${router.query.id}`;
                    setIsSaving(true);
                    await fetch(url, {
                      method: "PUT",
                      cache: "no-cache",
                      body: JSON.stringify({ reportElements: items }),
                    });
                    navigateToOverview();
                  }}
                >
                  Save
                </Button>
              </Button.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </>
  );
}

export async function getServerSideProps({ params }) {
  return { props: { report: await getReport(params.id as string) } };
}
