import { Dropdown } from "semantic-ui-react";
import { useState } from "react";
const locationOptions = [
  {
    key: "1",
    text: "Location 001",
    value: "1",
  },
  {
    key: "2",
    text: "Location 002",
    value: "2",
  },
  {
    key: "3",
    text: "Location 003",
    value: "3",
  },
];

export default function LocationDropDown(props: {
  initialValue: string | undefined;
  onChange: (e: unknown) => void;
}) {
  const [initialValue] = useState(props.initialValue);
  return (
    <Dropdown
      fluid
      selection
      placeholder="Select location"
      value={initialValue}
      options={locationOptions}
      onChange={(_m, p) => props.onChange(p.value)}
    />
  );
}
