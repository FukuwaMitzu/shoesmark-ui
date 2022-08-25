import type {} from "@mui/lab/themeAugmentation";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { NextPage } from "next";
import { ThemeProvider } from "@emotion/react";
import Auth, { AuthOptions } from "../components/Auth";
import { createTheme } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
//Day js setup
import dayjs from "dayjs";
import "dayjs/locale/vi";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import dynamic from "next/dynamic";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.locale("vi");
//==========================

export type CustomNextPage = NextPage & {
  auth?: AuthOptions;
  layout?: "customer" | "manager";
};

type CustomAppProps = AppProps & {
  Component: CustomNextPage;
};

const LazyClientLayout = dynamic(
  () => import("../views/clientlayout/ClientLayout")
);
const LazyAdminLayout = dynamic(() => import("../views/layout/ManagerLayout"));

const theme = createTheme();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      keepPreviousData: true,
    },
  },
});

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {
  let view = null;

  switch (Component.layout) {
    case "manager":
      view = (
        <LazyAdminLayout>
          <Component {...pageProps} />
        </LazyAdminLayout>
      );
      break;
    case "customer":
      view = (
        <LazyClientLayout>
          <Component {...pageProps} />
        </LazyClientLayout>
      );
      break;
    default:
      view = <Component {...pageProps} />;
      break;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider
        session={session}
        refetchInterval={5 * 60}
        refetchOnWindowFocus
      >
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <SnackbarProvider>
              <Auth auth={Component.auth}>{view}</Auth>
            </SnackbarProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
