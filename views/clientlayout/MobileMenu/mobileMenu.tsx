import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import LogoutIcon from '@mui/icons-material/Logout';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import HistoryIcon from '@mui/icons-material/History';
import Link from 'next/link';

const MobileDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        width: "100%",
        maxWidth: "350px",
    }
}));

const MobileMenu: React.FC = (props) => {
    const session = useSession();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    //========Callbacks============
    const tougleMenu = () => {
        setOpen(!open);
    }

    //=====Effects============
    useEffect(() => {
        setOpen(false);
    }, [router.pathname]);




    return (
        <>
            <IconButton color='inherit' onClick={tougleMenu}>
                <MenuIcon></MenuIcon>
            </IconButton>
            <MobileDrawer
                anchor="right"
                open={open}
                onClose={tougleMenu}
            >
                <List>
                    {
                        session.status == "authenticated" &&
                        <>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                                    <ListItemText>Tài khoản</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <Divider />
                        </>
                    }
                    <ListItem disablePadding>
                        <Link href={"/cart"} passHref>
                            <ListItemButton>
                                <ListItemIcon><LocalMallIcon /></ListItemIcon>
                                <ListItemText>Giỏ hàng</ListItemText>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    {
                        session.status == "authenticated" &&
                        <>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon><NotificationsIcon /></ListItemIcon>
                                    <ListItemText>Thông báo</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon><HistoryIcon /></ListItemIcon>
                                    <ListItemText>Lịch sử đơn hàng</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        </>
                    }
                    <Divider />
                    <ListItem disablePadding>
                        <Link href={"/shoes"} passHref>
                            <ListItemButton>
                                <ListItemIcon><SearchIcon /></ListItemIcon>
                                <ListItemText>Tìm kiếm sản phẩm</ListItemText>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Accordion sx={{
                            boxShadow: "none",
                            width: "100%"
                        }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <ListItemIcon></ListItemIcon>
                                <Typography>
                                    Danh mục
                                </Typography>
                            </AccordionSummary>
                        </Accordion>
                    </ListItem>
                    <Divider />
                    {
                        session.status == "authenticated" ?
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => signOut()}>
                                    <ListItemIcon><LogoutIcon /></ListItemIcon>
                                    <ListItemText>Đăng xuất</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            :
                            <>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => signIn()}>
                                        <ListItemIcon></ListItemIcon>
                                        <ListItemText>Đăng nhập</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon></ListItemIcon>
                                        <ListItemText>Đăng ký</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            </>
                    }
                </List>
            </MobileDrawer>
        </>
    )
}
export default MobileMenu;