import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import { styled } from "@mui/material/styles";
import LogoutIcon from "@mui/icons-material/Logout";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import HistoryIcon from "@mui/icons-material/History";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import getAllCategoryRequest, {
  GetAllCategoryQueryKey,
} from "../../../apiRequests/category/getAllCategoryRequest";
import AccordionDetails from "@mui/material/AccordionDetails";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import getMeRequest, {
  GetMeQueryKey,
} from "../../../apiRequests/user/getMeRequest";
import { Avatar } from "@mui/material";
import stringAvatar from "../../../util/stringAvatar";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";

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

  //=========Queries======
  const getMyProfile = useQuery(
    [GetMeQueryKey],
    () =>
      getMeRequest({
        accessToken: session.data?.user?.accessToken,
      }),
    {
      select: ({ data }) => data.data,
      enabled: session.status == "authenticated",
    }
  );
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
          {session.status == "authenticated" && (
            <>
              <ListItem disablePadding>
                <Link href={"/profile"} passHref>
                  <ListItemButton selected={router.pathname == "/profile"}>
                    <ListItemIcon>
                      <Avatar
                        {...stringAvatar(
                          `${getMyProfile.data?.lastName} ${getMyProfile.data?.firstName}`
                        )}
                      />
                    </ListItemIcon>
                    <ListItemText>{`${getMyProfile.data?.lastName} ${getMyProfile.data?.firstName}`}</ListItemText>
                  </ListItemButton>
                </Link>
              </ListItem>
            </>
          )}
          <ListItem disablePadding>
            <Link href={"/"} passHref>
              <ListItemButton selected={router.pathname == "/"}>
                <ListItemIcon>
                  <HomeOutlinedIcon />
                </ListItemIcon>
                <ListItemText>Trang ch???</ListItemText>
              </ListItemButton>
            </Link>
          </ListItem>
          {session.status == "authenticated" &&
            ["admin", "employee"].some(
              (role) => role === session.data.user?.role
            ) && (
              <ListItem disablePadding>
                <Link href={"/admin"} passHref>
                  <ListItemButton>
                    <ListItemIcon>
                      <MonitorHeartOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText>Qu???n tr???</ListItemText>
                  </ListItemButton>
                </Link>
              </ListItem>
            )}

          <ListItem disablePadding>
            <Link href={"/cart"} passHref>
              <ListItemButton selected={router.pathname == "/cart"}>
                <ListItemIcon>
                  <LocalMallOutlinedIcon />
                </ListItemIcon>
                <ListItemText>Gi??? h??ng</ListItemText>
              </ListItemButton>
            </Link>
          </ListItem>
          {session.status == "authenticated" && (
            <>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <NotificationsNoneOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText>Th??ng b??o</ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText>L???ch s??? ????n h??ng</ListItemText>
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
                <ListItemText>T??m ki???m s???n ph???m</ListItemText>
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
                  <CategoryOutlinedIcon />
                </ListItemIcon>
                <Typography>Danh m???c</Typography>
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
                <ListItemText>????ng xu???t</ListItemText>
              </ListItemButton>
            </ListItem>
          ) : (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={() => signIn()}>
                  <ListItemIcon>
                    <LoginOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText>????ng nh???p</ListItemText>
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </MobileDrawer>
    </>
  );
};
export default MobileMenu;
