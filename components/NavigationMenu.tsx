import { Menu, Icon, Button, Label } from "semantic-ui-react";
import Link from "next/link";
import { signout, useSession } from "next-auth/client";

export default function NavigationMenu() {
  const [session, loading] = useSession();
  return (
    <>
      {session && (
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
          <Menu.Item position="right">
            <a href="/api/auth/signout">
              <Button as="div" labelPosition="left">
                <Label basic pointing="right">
                  {session.user.email}
                </Label>
                <Button
                  icon
                  onClick={(e) => {
                    e.preventDefault();
                    signout();
                  }}
                >
                  <Icon name="sign out" />
                </Button>
              </Button>
            </a>
          </Menu.Item>
        </Menu>
      )}
    </>
  );
}
