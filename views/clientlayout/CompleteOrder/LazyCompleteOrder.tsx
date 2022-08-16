import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import dynamic from "next/dynamic";

const LazyCompleteOrderFallback: React.FC = ()=>(
    <Box sx={{ display: 'flex', width:"100%", justifyContent:"center"}}>
      <CircularProgress />
    </Box>
)

const LazyCompleteOrder = dynamic(()=>import('./CompleteOrder'), {
    loading: LazyCompleteOrderFallback
});

export default LazyCompleteOrder;