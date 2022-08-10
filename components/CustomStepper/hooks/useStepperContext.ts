import { useContext, useState } from "react";
import { CustomStepperContext, StepStatus, StepContext } from "../CustomStepper";

const useStepper = (name: string, defaultValue?: StepContext) =>{
    const [defaultV, setDefault] = useState(defaultValue);
    const {getContext, initalContext, onContextUpdate, setStepStatus} = useContext(CustomStepperContext);
    return {
        context: getContext(name, defaultValue),
        update: (data: any)=>onContextUpdate(name, data),
        reset: (value?: any)=>{
            setDefault(value); 
            onContextUpdate(name, {...(value ?? defaultV)})
        },
        changeStepStatus: (status: StepStatus)=>setStepStatus(name, status)
    }
}
export default useStepper;