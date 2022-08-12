import { useContext, useState } from "react";
import { CustomStepperContext, StepStatus, StepContext, StepRequestCallBack } from "../CustomStepper";

const useStepper = (name: string, defaultValue?: StepContext) =>{
    const [defaultV, setDefault] = useState(defaultValue);
    const {getContext, initialContext, onBackRequest,onNextRequest, onlyBackWhen, onlyNextWhen, onContextUpdate, setStepStatus} = useContext(CustomStepperContext);
    return {
        context: getContext(name, defaultValue),
        updateData: (data: any)=>onContextUpdate(name, data),
        resetData: (value?: any)=>{
            setDefault(value); 
            onContextUpdate(name, {...(value ?? defaultV)})
        },
        onlyBackWhen: (value: boolean | null)=>onlyBackWhen(name, value),
        onlyNextWhen: (value: boolean | null)=>onlyNextWhen(name, value),
        changeStepStatus: (status: StepStatus)=>setStepStatus(name, status),
        onBackRequest: (callback: StepRequestCallBack)=>onBackRequest(name, callback),
        onNextRequest: (callback: StepRequestCallBack)=>onNextRequest(name, callback),
    }
}
export default useStepper;