import { Form, Button } from "semantic-ui-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ReportOverview() {
  const [name, setName] = useState<string>();
  const [date, setDate] = useState<Date>();
  const router = useRouter();

  async function handleSubmit() {
    var url = `${location.protocol}//${location.host}/api/reports`;
    const response = await fetch(url, {
      method: "POST",
      cache: "no-cache",
      body: JSON.stringify({
        name,
        date,
      }),
    });
    if (response.ok) {
      var jsonBody = await response.json();

      if (jsonBody.id) {
        router.push(`/reports/${jsonBody.id}`);
      }
    }
  }
  return (
    <div>
      <Form>
        <Form.Group widths="equal">
          <Form.Input
            label="Name"
            focus
            required
            type="text"
            onChange={(x) => setName(x.target.value)}
          />
          <Form.Input
            label="Date"
            required
            type="date"
            onChange={(x) => setDate(x.target.valueAsDate)}
          />
        </Form.Group>
        <Button type="submit" onClick={() => handleSubmit()}>
          Submit
        </Button>
      </Form>
    </div>
  );
}
