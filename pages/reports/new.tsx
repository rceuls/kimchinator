import { Form, Button } from "semantic-ui-react";

export default function ReportOverview() {
  return (
    <div>
      <Form>
        <Form.Group widths="equal">
          <Form.Input label="Name" focus required type="text" />
          <Form.Input label="Date" required type="date" />
        </Form.Group>
        <Form.Input label="Files" required type="file" />
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}
