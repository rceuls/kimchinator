import {
  Form,
  Button,
  Segment,
  Dimmer,
  Loader,
  Confirm,
} from "semantic-ui-react";
import { useState } from "react";
import { useRouter } from "next/router";
import SemanticDatepicker from "react-semantic-ui-datepickers";

export default function ReportOverview() {
  const [name, setName] = useState<string>();
  const [date, setDate] = useState<Date>(new Date());
  const [leaveRequested, setLeaveRequested] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const router = useRouter();
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
          router.push("/reports");
        }}
      />
      <Segment>
        <Dimmer active={isSaving} inverted>
          <Loader inverted>Saving...</Loader>
        </Dimmer>
        <Form>
          <Form.Group widths="equal">
            <Form.Input
              label="Name"
              focus
              required
              type="text"
              onChange={(e) => {
                e.preventDefault();
                setName(e.target.value);
              }}
            />
            <SemanticDatepicker
              label="Date"
              value={date}
              required={false}
              datePickerOnly
              showToday
              onChange={(_e, data) => {
                if (!Array.isArray(data.value)) {
                  setDate(data.value);
                }
              }}
            />
          </Form.Group>
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
                const response = await fetch("/api/reports", {
                  method: "POST",
                  cache: "no-cache",
                  body: JSON.stringify({
                    name,
                    date,
                  }),
                });
                setIsSaving(true);
                if (response.ok) {
                  var jsonBody = await response.json();
                  if (jsonBody._id) {
                    router.push(`/reports/${jsonBody._id}`);
                  }
                } else {
                  setIsSaving(false);
                }
              }}
            >
              Save
            </Button>
          </Button.Group>
        </Form>
      </Segment>
    </>
  );
}
