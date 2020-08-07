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
} from "semantic-ui-react";
import LocationDropDown from "../../components/LocationDropDown";
import { useState, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { IReport, getReport, IReportElement } from "../../services/database";
import Compress from "compress.js";

function ReportRow(props: {
  image: string;
  location?: string;
  description?: string;
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

export default function ReportOverview(props: { report: IReport }) {
  const [items, setItems] = useState<IReportElement[]>(
    props.report.reportElements
  );
  async function uploadFile(event: ChangeEvent<HTMLInputElement>) {
    var files = event.target.files;
    const compress = new Compress();
    let newElements: IReportElement[] = [];
    for (const file of files) {
      const fileName = `${router.query.id}/${file.name}`;
      const resizedImage = await compress.compress([file], {
        size: 0.5, // the max size in MB, defaults to 2MB
        quality: 1, // the quality of the image, max is 1
        maxWidth: 600,
        maxHeight: 600,
        resize: true,
      });
      const img = resizedImage[0];
      const base64str = img.data;
      const asFile = Compress.convertBase64ToFile(base64str, img.ext);
      var url = `${location.protocol}//${location.host}/api/reports/${router.query.id}/image`;
      const asFormData = new FormData();
      asFormData.append("image", asFile, fileName);
      const reservedUrlResponse = await fetch(url, {
        method: "POST",
        cache: "no-cache",
        body: JSON.stringify({
          contentType: file.type,
          fileName: fileName,
        }),
      });
      const s3Response = await reservedUrlResponse.json();
      await fetch(s3Response.uploadPath, {
        method: "PUT",
        cache: "no-cache",
        body: asFile,
      });
      newElements = [
        {
          id: (items.length + 1).toString(),
          image: s3Response.filePath,
        },
        ...newElements,
      ];
    }
    setItems([...newElements, ...items]);
  }
  const router = useRouter();
  return (
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
                <Table.HeaderCell>Location</Table.HeaderCell>
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
                />
              ))}
            </Table.Body>
          </Table>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Button
            type="submit"
            onClick={() => {
              var url = `${location.protocol}//${location.host}/api/reports/${router.query.id}`;
              fetch(url, {
                method: "PUT",
                cache: "no-cache",
                body: JSON.stringify({ reportElements: items }),
              });
            }}
          >
            Save
          </Button>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export async function getServerSideProps({ params }) {
  return { props: { report: await getReport(params.id as string) } };
}
