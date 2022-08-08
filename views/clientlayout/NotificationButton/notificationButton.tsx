import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';

interface NotificationButtonProps{

}

const NotificationButton: React.FC<NotificationButtonProps> = (props)=>{
    return (
        <IconButton color="inherit">
            <Badge badgeContent={10} color={"error"}>
                <NotificationsIcon></NotificationsIcon>
            </Badge>
        </IconButton>
    )
}
export default NotificationButton;