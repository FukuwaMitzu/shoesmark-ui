import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import { CustomNextPage } from "../../_app";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
const ImportOrderPage: CustomNextPage = () => {
  return (
    <Box>
      <Breadcrumbs sx={{ marginBottom: "15px" }}>
        <Link href="/admin/dashboard" passHref>
          <MuiLink underline="hover" color="inherit">
            Dashboard
          </MuiLink>
        </Link>
        <Typography color="text.primary">Đơn hàng</Typography>
      </Breadcrumbs>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", marginBottom: "25px" }}
      >
        Quản lý Đơn hàng
      </Typography>
    </Box>
  );
};

ImportOrderPage.layout = "manager";
ImportOrderPage.auth = {
  role: ["admin", "employee"],
};
export default ImportOrderPage;
