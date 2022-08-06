import PrimarySearchAppBar from "./NavBar/NavBar"
import ShoeColors from "./Container/Color/Color"
import ShoeInfo from "./Container/Info/info"
import { Stack } from "@mui/material"
import { Box } from "@mui/system"


export default function ClientLayout(props){
    return(
        <Stack direction={'column'}>
            <PrimarySearchAppBar></PrimarySearchAppBar>
            <Stack direction={'row'}>
                <Box>

                </Box>
                <ShoeInfo></ShoeInfo>
            </Stack>
            <ShoeColors></ShoeColors>
        </Stack>
    )
}