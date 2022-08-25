import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import NotificationsIcon from "@mui/icons-material/Notifications";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { styled } from "@mui/material/styles";
import LogoutIcon from "@mui/icons-material/Logout";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import HistoryIcon from "@mui/icons-material/History";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import getAllCategoryRequest, {
  GetAllCategoryQueryKey,
} from "../../../apiRequests/category/getAllCategoryRequest";
import AccordionDetails from "@mui/material/AccordionDetails";
import CategoryIcon from "@mui/icons-material/Category";
const MobileDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: "100%",
    maxWidth: "350px",
  },
}));

const MobileMenu: React.FC = (props) => {
  const session = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  //========Callbacks============
  const tougleMenu = () => {
    setOpen(!open);
  };

  //=====Effects============
  useEffect(() => {
    setOpen(false);
  }, [router.query]);

  const getAllCategory = useQuery(
    [GetAllCategoryQueryKey],
    () => getAllCategoryRequest({}),
    {
      select: (data) => data.data,
    }
  );

  const category = getAllCategory.data;
  return (
    <>
      <IconButton color="inherit" onClick={tougleMenu}>
        <MenuIcon></MenuIcon>
      </IconButton>
      <MobileDrawer
        keepMounted
        variant="temporary"
        anchor="right"
        open={open}
        onClose={tougleMenu}
      >
        <List>
          <ListItem disablePadding>
            <Link href={"/"} passHref>
              <ListItemButton selected={router.pathname == "/"}>
                <ListItemIcon>
                  <HomeOutlinedIcon />
                </ListItemIcon>
                <ListItemText>Trang chủ</ListItemText>
              </ListItemButton>
            </Link>
            </ListItem>
            {session.status == "authenticated" && ["admin", "employee"].some((role)=>role === session.data.user?.role)  &&(
          <ListItem disablePadding>
            <Link href={"/admin"} passHref>
              <ListItemButton>
                <ListItemIcon>
                  <MonitorHeartOutlinedIcon />
                </ListItemIcon>
                <ListItemText>Quản trị</ListItemText>
              </ListItemButton>
            </Link>
          </ListItem>  
            )
}      
          {session.status == "authenticated" && (
            <>
              <ListItem disablePadding>
                <Link href={"/profile"} passHref>
                  <ListItemButton selected={router.pathname == "/profile"}>
                    <ListItemIcon>
                      <AccountCircleOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText>Tài khoản</ListItemText>
                  </ListItemButton>
                </Link>
              </ListItem>
            </>
          )}
          <ListItem disablePadding>
            <Link href={"/cart"} passHref>
              <ListItemButton selected={router.pathname == "/cart"}>
                <ListItemIcon>
                  <LocalMallIcon />
                </ListItemIcon>
                <ListItemText>Giỏ hàng</ListItemText>
              </ListItemButton>
            </Link>
          </ListItem>
          {session.status == "authenticated" && (
            <>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText>Thông báo</ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText>Lịch sử đơn hàng</ListItemText>
                </ListItemButton>
              </ListItem>
            </>
          )}
          <ListItem disablePadding>
            <Link href={"/shoes"} passHref>
              <ListItemButton selected={router.pathname == "/shoes"}>
                <ListItemIcon>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText>Tìm kiếm sản phẩm</ListItemText>
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding>
            <Accordion
              sx={{
                boxShadow: "none",
                width: "100%",
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <Typography>Danh mục</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ fontFamily: "Roboto" }}>
                <List>
                  {category &&
                    category.data.map((row) => (
                      <Link
                        key={row.categoryId}
                        href={`/category/${row.categoryId}`}
                        passHref
                      >
                        <ListItemButton
                          selected={
                            router.asPath == `/category/${row.categoryId}`
                          }
                        >
                          {row.categoryName}
                        </ListItemButton>
                      </Link>
                    ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </ListItem>
          {session.status == "authenticated" ? (
            <ListItem disablePadding>
              <ListItemButton onClick={() => signOut({ redirect: false })}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText>Đăng xuất</ListItemText>
              </ListItemButton>
            </ListItem>
          ) : (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={() => signIn()}>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText>Đăng nhập</ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <Link href={"/auth/signUp"} passHref>
                  <ListItemButton>
                    <ListItemIcon></ListItemIcon>
                    <ListItemText>Đăng ký</ListItemText>
                  </ListItemButton>
                </Link>
              </ListItem>
            </>
          )}
        </List>
      </MobileDrawer>
    </>
  );
};
export default MobileMenu;
