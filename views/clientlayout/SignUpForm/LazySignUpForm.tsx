import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import dynamic from "next/dynamic";

const LazySignFormUpFallback: React.FC = () => (
  <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
    <CircularProgress />
  </Box>
);

const LazySignUpForm = dynamic(() => import("./SignUpForm"), {
  loading: LazySignFormUpFallback,
});

export default LazySignUpForm;
