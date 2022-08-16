import Skeleton from '@mui/material/Skeleton';
import dynamic from 'next/dynamic';

const LazyShoesCardFallback: React.FC = ()=>(
    <Skeleton variant="rectangular"  sx={{maxWidth:"250px", width:"100%", height: "355px"}} />
)

const LazyShoesCard = dynamic(()=>import('./ShoesCard'), {
    loading: LazyShoesCardFallback
});

export default LazyShoesCard;