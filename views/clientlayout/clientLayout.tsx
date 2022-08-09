import React from "react"
import Stack from "@mui/material/Stack"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { useSession } from "next-auth/react"
import Searchbar from "./SearchBar/SearchBar"
import CartButton from "./CartButton/CartButton"
import NotificationButton from "./NotificationButton/NotificationButton"
import Link from "next/link"
import MuiLink from "@mui/material/Link"
import { styled } from "@mui/material/styles"
import MobileMenu from "./MobileMenu/MobileMenu"
import Container from "@mui/material/Container";

const DesktopButtons = styled(Toolbar)(({ theme }) => ({
    [theme.breakpoints.down("md")]: {
        display: "none"
    }
}));


const ClientLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    const session = useSession();

    return (
        <Stack direction={'column'}>
            <AppBar>
                <Toolbar sx={{gap:1}}>
                    <Link href="/" passHref>
                        <MuiLink color={"inherit"} sx={{ textDecoration: "none" }}>
                            <Typography variant="h6">ShoesMark</Typography>
                        </MuiLink>
                    </Link>
                    <Searchbar></Searchbar>
                    <Box sx={{ flex: 1 }}></Box>                
                    <DesktopButtons>
                        <Stack direction={"row"} spacing={3}>
                            <CartButton></CartButton>
                            {
                                session.status == "authenticated" &&
                                <NotificationButton></NotificationButton>
                            }
                        </Stack>
                    </DesktopButtons>
                    <MobileMenu></MobileMenu>
                </Toolbar>
            </AppBar>
            <Toolbar></Toolbar>
            <Container maxWidth="lg" sx={{padding:5}}>
                {children}
            </Container>
        </Stack>
    )
}

export default ClientLayout;