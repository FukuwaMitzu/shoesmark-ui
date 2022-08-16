import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import dynamic from "next/dynamic";

const LazyCartCustomizeFallback: React.FC = ()=>(
    <Box sx={{ display: 'flex', width:"100%", justifyContent:"center"}}>
      <CircularProgress />
    </Box>
)

const LazyCartCustomize = dynamic(()=>import('./CartCustomize'), {
    loading: LazyCartCustomizeFallback,
});
export default LazyCartCustomize;