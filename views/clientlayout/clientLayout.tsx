import Stack from "@mui/material/Stack"
import AppBar from "@mui/material/AppBar"
import React from "react"
import Toolbar from "@mui/material/Toolbar"
import { Typography } from "@mui/material"
import { useSession } from "next-auth/react"
import Searchbar from "./SearchBar/searchBar"

const ClientLayout: React.FC<React.PropsWithChildren> = ({children})=>{
    const session = useSession();

    return(
        <Stack direction={'column'}>
            <AppBar>
                <Toolbar>
                    <Typography variant="h6">ShoesMark</Typography>
                    <Searchbar></Searchbar>
                </Toolbar>
            </AppBar>
            {children}
        </Stack>
    )
}

export default ClientLayout;