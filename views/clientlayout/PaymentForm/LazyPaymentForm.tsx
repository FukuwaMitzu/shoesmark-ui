import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import dynamic from "next/dynamic";

const LazyPaymentFormFallback: React.FC = () => (
  <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
    <CircularProgress />
  </Box>
);

const LazyPaymentForm = dynamic(() => import("./PaymentForm"), {
  loading: LazyPaymentFormFallback,
});

export default LazyPaymentForm;
