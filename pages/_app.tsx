import type { } from '@mui/lab/themeAugmentation';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react';
import { NextPage } from 'next';
import { ThemeProvider } from '@emotion/react';
import { ManagerLayout } from '../views/layout/managerLayout';
import Auth, { AuthOptions } from '../components/Auth';
import { createTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import ClientLayout from '../views/clientlayout/ClientLayout';
import { LocalizationProvider } from '@mui/x-date-pickers';
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
//Day js setup
import dayjs from "dayjs";
import "dayjs/locale/vi";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.locale('vi');
//==========================




export type CustomNextPage = NextPage & {
  auth?: AuthOptions
  layout?: "customer" | "manager"
}

type CustomAppProps = AppProps & {
  Component: CustomNextPage
}


const theme = createTheme();
const queryClient = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps } }: CustomAppProps) {
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
            {
              Component.layout == "manager" ?
                <Auth auth={Component.auth}>
                  <ManagerLayout>
                    <Component {...pageProps} />
                  </ManagerLayout>
                </Auth>
                :
                <Auth auth={Component.auth}>
                  <ClientLayout>
                    <Component {...pageProps} />
                  </ClientLayout>
                </Auth>
            }
          </SnackbarProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}

export default MyApp
