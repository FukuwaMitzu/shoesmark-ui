import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import IconButton from "@mui/material/IconButton"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import { Color } from '../../api/color/color'
import { SHOESMARK_API_DOMAIN } from '../../config/domain'
import Image from "next/image"
interface ShoesCardProps {
    shoesName: string
    size: number,
    color?: Color,
    shoesImage: string,
    price: number,
    sale: number
}


const ShoesCard: React.FC<ShoesCardProps> = (data) => {
    const niemYet = data.price;
    const khuyenMai = data.price * (100-data.sale)/100;

    var formatter = new Intl.NumberFormat('vi', {
        style: 'currency',
        currency: 'VND',
      });

    return (
        <Card sx={{ maxWidth: "250px" }}>
            <CardHeader
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={
                    <Typography
                        sx={{
                            height: "48px",
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: '2',
                            WebkitBoxOrient: 'vertical',
                        }}
                    >{data.shoesName}</Typography>
                }
                subheader={
                    <Stack direction={"row"} gap={2} alignItems="center">
                        <Typography>Size: {data.size}</Typography>
                        {
                            data.color &&
                            <Stack direction={"row"} alignItems="center" gap={1}>
                                <Box sx={{ backgroundColor: data.color?.colorHex, width: "15px", height: "15px" }}></Box>
                                <Typography>{data.color?.colorName}</Typography>
                            </Stack>
                        }
                    </Stack>
                }
            />
            <Image
                layout='responsive'
                width={"100%"}
                height={"75px"}
                objectFit={"cover"}
                src={`${SHOESMARK_API_DOMAIN}/${data.shoesImage}`}
            />
            <CardContent> 
                <Typography color={"GrayText"} sx={{ textDecorationLine: "line-through", opacity: data.sale!=0? 1 : 0 }}>{`${formatter.format(niemYet)}`}</Typography>
                <Typography color={"error"} variant={"h6"}>
                    {formatter.format(khuyenMai)}   
                </Typography>
            </CardContent>
        </Card>
    )
}
export default ShoesCard;