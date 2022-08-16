import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import dynamic from "next/dynamic";



const LazyCreateOrderFormFallback: React.FC = ()=>(
    <Box sx={{ display: 'flex', width:"100%", justifyContent:"center"}}>
      <CircularProgress />
    </Box>
)

const LazyCreateOrderForm = dynamic(()=>import('./CreateOrderForm'), {
    loading: LazyCreateOrderFormFallback
});

export default LazyCreateOrderForm;