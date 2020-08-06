import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import NavigationMenu from "../components/NavigationMenu";
import { Container } from "semantic-ui-react";
import { signin, useSession } from "next-auth/client";

function MyApp({ Component, pageProps }) {
  const [session, loading] = useSession();

  return (
    <>
      {!session && (
        <a
          href="/api/auth/signin"
          onClick={(e) => {
            e.preventDefault();
            signin();
          }}
        >
          <button className="signInButton">Sign in</button>
        </a>
      )}
      {session && (
        <>
          <NavigationMenu />
          <Container>
            <Component {...pageProps} />
          </Container>
        </>
      )}
    </>
  );
}

export default MyApp;
