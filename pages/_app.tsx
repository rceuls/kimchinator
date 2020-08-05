import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import NavigationMenu from "../components/NavigationMenu";
import { Container } from "semantic-ui-react";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NavigationMenu />
      <Container>
        <Component {...pageProps} />
      </Container>
    </>
  );
}

export default MyApp;
