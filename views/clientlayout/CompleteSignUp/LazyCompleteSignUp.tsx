import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import dynamic from "next/dynamic";

const LazyCompleteSignUpFallback: React.FC = () => (
  <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
    <CircularProgress />
  </Box>
);

const LazyCompleteSignUp = dynamic(() => import("./CompleteSignUp"), {
  loading: LazyCompleteSignUpFallback,
});

export default LazyCompleteSignUp;
