import ExpandMore from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CustomListItemButton from "./CustomListItemButton/CustomListItemButton";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import ListItem from "@mui/material/ListItem";
import Container from "@mui/material/Container";
import WaterfallChartOutlinedIcon from "@mui/icons-material/WaterfallChartOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ComputerIcon from "@mui/icons-material/Computer";
import { signOut } from "next-auth/react";
import ListItemButton from "@mui/material/ListItemButton";
import LogoutIcon from "@mui/icons-material/Logout";

interface ManagerLayoutProps extends React.PropsWithChildren {}

const drawerWidth = 280;

const ManagerLayout: React.FC<ManagerLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline></CssBaseline>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            ShoesMark
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
      >
        <List sx={{ width: "100%", paddingBottom: 10, paddingTop: 2 }}>
          <ListItem disablePadding>
            <CustomListItemButton href="/admin/dashboard">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <WaterfallChartOutlinedIcon />
                <Typography>Dashboard</Typography>
              </Box>
            </CustomListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <CustomListItemButton href="/">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <ComputerIcon />
                <Typography>Trang sản phẩm</Typography>
              </Box>
            </CustomListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <Accordion
              defaultExpanded
              sx={{
                boxShadow: "none",
                width: "100%",
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore></ExpandMore>}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Inventory2OutlinedIcon></Inventory2OutlinedIcon>
                  <Typography>Quản lý danh mục</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  <CustomListItemButton href="/admin/giay">
                    Giày
                  </CustomListItemButton>
                  <CustomListItemButton href="/admin/thuong-hieu">
                    Thương hiệu
                  </CustomListItemButton>
                  <CustomListItemButton href="/admin/mau-sac">
                    Màu sắc
                  </CustomListItemButton>
                  <CustomListItemButton href="/admin/the-loai">
                    Thể loại
                  </CustomListItemButton>
                  <CustomListItemButton href="/admin/nguoi-dung">
                    Người dùng
                  </CustomListItemButton>
                  <CustomListItemButton href="/admin/thong-bao">
                    Thông báo
                  </CustomListItemButton>
                </List>
              </AccordionDetails>
            </Accordion>
          </ListItem>
          <ListItem disablePadding>
            <Accordion
              defaultExpanded
              sx={{
                boxShadow: "none",
                width: "100%",
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore></ExpandMore>}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <LocalOfferOutlinedIcon></LocalOfferOutlinedIcon>
                  <Typography>Quản lý bán hàng</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  <CustomListItemButton href="/admin/don-hang">
                    Đơn hàng
                  </CustomListItemButton>
                  <CustomListItemButton href="/admin/hoa-don-nhap">
                    Hoá đơn nhập
                  </CustomListItemButton>
                  <CustomListItemButton
                    href="https://dashboard.tawk.to/#/dashboard/62c680b27b967b1179986c23"
                    target="_blank"
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography sx={{ flex: 1 }}> Tư vấn sản phẩm</Typography>
                      <OpenInNewIcon />
                    </Box>
                  </CustomListItemButton>
                </List>
              </AccordionDetails>
            </Accordion>
          </ListItem>
          <ListItem disablePadding>
            <Accordion
              defaultExpanded
              sx={{
                boxShadow: "none",
                width: "100%",
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore></ExpandMore>}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <BarChartOutlinedIcon />
                  <Typography>Báo cáo thống kê</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  <CustomListItemButton href="/admin/thong-ke/doanh-thu">
                    Báo cáo doanh thu
                  </CustomListItemButton>
                  <CustomListItemButton href="/admin/thong-ke/bao-cao-ton-kho">
                    Báo cáo tồn kho
                  </CustomListItemButton>
                </List>
              </AccordionDetails>
            </Accordion>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => signOut()}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <LogoutIcon />
                <Typography>Đăng xuất</Typography>
              </Box>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box component={"main"} sx={{ flexGrow: 1, p: 2 }}>
        <Toolbar />
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </Box>
  );
};

export default ManagerLayout;
