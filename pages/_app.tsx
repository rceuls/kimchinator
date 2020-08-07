import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import { Container } from "semantic-ui-react";
import { signIn, useSession } from "next-auth/client";
import { Provider } from "next-auth/client";
import dynamic from "next/dynamic";
const NavigationMenu = dynamic(() => import("../components/NavigationMenu"), {
  ssr: false,
});

function MyApp({ Component, pageProps }) {
  const [session] = useSession();

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
