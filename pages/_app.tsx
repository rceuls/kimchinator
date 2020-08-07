import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import NavigationMenu from "../components/NavigationMenu";
import { Container } from "semantic-ui-react";
import { signIn, useSession } from "next-auth/client";
import { Provider } from "next-auth/client";

function MyApp({ Component, pageProps }) {
  const [session, loading] = useSession();

  return (
    <>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={signIn}>Sign in</button>
        </>
      )}
      {session && (
        <Provider session={pageProps.session}>
          <NavigationMenu />
          <Container>
            <Component {...pageProps} />
          </Container>
        </Provider>
      )}
    </>
  );
}

export default MyApp;
