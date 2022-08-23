import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import dynamic from "next/dynamic";

const LazyValidateEmailFormFallBack: React.FC = () => (
  <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
    <CircularProgress />
  </Box>
);

const LazyValidateEmailForm = dynamic(() => import("./ValidateEmailForm"), {
  loading: LazyValidateEmailFormFallBack,
});

export default LazyValidateEmailForm;
