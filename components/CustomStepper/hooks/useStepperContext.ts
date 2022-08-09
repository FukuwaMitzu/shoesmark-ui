import { useContext } from "react";
import { CustomStepperContext, StepContext } from "../CustomStepper";

const useStepper = (name: string, defaultValue?: StepContext) =>{
    const {getContext, initalContext, onContextUpdate} = useContext(CustomStepperContext);

    return {
        context: getContext(name, defaultValue),
        Update: (data: any)=>onContextUpdate(name, data),
        Reset: ()=>onContextUpdate(name, defaultValue)
    }
}
export default useStepper;