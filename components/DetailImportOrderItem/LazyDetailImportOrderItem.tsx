import Skeleton from "@mui/material/Skeleton";
import dynamic from "next/dynamic";

const LazyDetailOrderItemFallBack: React.FC = (data)=>(
    <Skeleton variant="rectangular" width="100%" height="325px" />
)

const LazyDetailImportOrderItem = dynamic(()=>import('./DetailImportOrderItem'), {
    loading: LazyDetailOrderItemFallBack
});

export default LazyDetailImportOrderItem;
