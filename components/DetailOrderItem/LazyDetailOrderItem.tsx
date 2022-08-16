import Skeleton from "@mui/material/Skeleton";
import dynamic from "next/dynamic";

const LazyDetailOrderItemFallBack: React.FC = (data)=>(
    <Skeleton variant="rectangular" width="100%" height="325px" />
)

const LazyDetailOrderItem = dynamic(()=>import('./DetailOrderItem'), {
    loading: LazyDetailOrderItemFallBack
});

export default LazyDetailOrderItem;
