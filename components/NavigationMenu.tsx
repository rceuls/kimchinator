import { Menu } from "semantic-ui-react";
import Link from "next/link";

export default function NavigationMenu() {
  return (
    <Menu>
      <Menu.Item>
        <Link href="/report/new">
          <a>New Report</a>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link href="/report/overview">
          <a>Report overview</a>
        </Link>
      </Menu.Item>
    </Menu>
  );
}
