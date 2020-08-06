import { Menu } from "semantic-ui-react";
import Link from "next/link";

export default function NavigationMenu() {
  return (
    <Menu>
      <Menu.Item>
        <Link href="/reports/new">
          <a>New Report</a>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link href="/reports">
          <a>Report overview</a>
        </Link>
      </Menu.Item>
    </Menu>
  );
}
