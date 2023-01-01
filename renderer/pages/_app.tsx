import type { AppProps } from "next/app";


import { CssBaseline, ThemeProvider } from "@mui/material";
import Container from "@mui/material/Container";
import { SnackbarProvider } from "notistack";
import { ShoppingCartProvider } from "../context/ShoppingCartContext";
import { empireTheme } from "../styles";


// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={empireTheme}>
        <CssBaseline />
        <SnackbarProvider>
          <ShoppingCartProvider>
            <Container>
              <Component {...pageProps} />
            </Container>
          </ShoppingCartProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}
