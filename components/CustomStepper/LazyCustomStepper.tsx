import Skeleton from '@mui/material/Skeleton';
import dynamic from 'next/dynamic';


const LazyCustomStepperFallBack: React.FC = ()=>(
    <Skeleton variant="rectangular" width="100%" height="125px"></Skeleton>
)

const LazyCustomStepper = dynamic(()=>import('./CustomStepper'),{
    loading: LazyCustomStepperFallBack
});

export default LazyCustomStepper;