import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { createContext, ReactNode, useState } from "react";

interface StepItem {
    name: string,
    label?: string,
    optional?: ReactNode,
    status?: StepStatus,
    renderContent: () => ReactNode
}
interface CustomStepperProps {
    steps: StepItem[],
    sticky?: boolean,
    onComplete?: (e:any[]) => void
}
export type StepStatus = "complete" | "valid" | "invalid";
interface StepContext {
    name: string,
    status: StepStatus
    data?: any
}
interface CustomStepperContextProps {
    initalContext: StepContext[]
    getContext: (contextName: string, defaultContext?: StepContext) => StepContext | undefined
    onContextUpdate: (contextName: string, data: any) => void
    setStepStatus: (contextName:string, status: StepStatus)=>void
}
const CustomStepperContext = createContext<CustomStepperContextProps>({
    initalContext: [],
    getContext: () => ({ name: "", status: "invalid" }),
    onContextUpdate: () => {},
    setStepStatus: () => {}
});

const CustomStepper: React.FC<CustomStepperProps> = (data) => {
    const [activeStep, setActiveStep] = useState(0);

    const handleNextStep = () => {
        setActiveStep(activeStep + 1);
    }
    const handleOnBack = () => {
        setActiveStep(activeStep - 1);
    }
    //=============Context===============
    const [initalContext, setInitialContext] = useState<StepContext[]>(data.steps.map((step) => ({ name: step.name, status: step.status ?? "invalid"})));

    const getContext = (contextName: string, defaultContext?: StepContext) => {
        return initalContext.find((context) => context.name == contextName) ?? defaultContext;
    }

    //Stop going next step
    const nextDisabled = initalContext[activeStep].status == "invalid";
    //Stop going back step
    const backDisabled = initalContext[activeStep].status == "complete" || (activeStep>0 ? initalContext[activeStep-1].status == "complete" : false);
    const onContextUpdate = (contextName: string, data: any) => {
        const context = initalContext.find((context) => context.name == contextName);
        if (context) {
            if(context.status!="complete"){
                context.data = data;
                setInitialContext([...initalContext]);
            }
        }
    }

    const setStepStatus = (contextName:string, status: StepStatus)=>{
        const context = initalContext.find((context) => context.name == contextName);
        if (context) {
            if(context.status!="complete")
            {
                context.status = status;
                setInitialContext([...initalContext]);
            }
        }
    }

    const handleComplete = ()=>{
        if(data.onComplete){
            data.onComplete(initalContext);
        }
    }
    //========================================

    if (data.steps.length == 0) return <></>;

    return (
        <CustomStepperContext.Provider value={{ initalContext, getContext, onContextUpdate, setStepStatus}}>
            <Box
                sx={data.sticky ? {
                    marginTop: "15px",
                    position: "sticky",
                    top: "75px",
                    paddingTop: "20px",
                    paddingBottom: "10px",
                    paddingX: "7px",
                    backgroundColor: "background.paper",
                    boxShadow: 1,
                    zIndex: 2
                } : {}}
            >
                <Stepper
                    activeStep={activeStep}
                >
                    {
                        data.steps.map((step) => (
                            <Step key={step.label}>
                                <StepLabel
                                    optional={step.optional}
                                >{step.label ?? step.name}</StepLabel>
                            </Step>
                        ))
                    }
                </Stepper>
                {
                    data.sticky &&
                    <Stack direction={"row"} spacing={2} marginTop="15px">
                        {
                            activeStep > 0 && !backDisabled &&
                            <Button color="inherit" onClick={handleOnBack}>Back</Button>
                        }
                        <Box sx={{ flex: 1 }}></Box>
                        {
                            data.steps[activeStep].optional &&
                            <Button color="inherit" onClick={handleNextStep}>Skip</Button>
                        }
                        {
                            activeStep == data.steps.length - 1 ?
                                <Button disabled={nextDisabled} onClick={handleComplete}>Complete</Button>
                                :
                                <Button disabled={nextDisabled} onClick={handleNextStep}>Next</Button>
                        }
                    </Stack>
                }
            </Box>
            <Box marginTop={"35px"}>
                {
                    data.steps[activeStep].renderContent()
                }
            </Box>
            {
                !data.sticky &&
                <Stack direction={"row"} spacing={2} marginTop="15px">
                    {
                        activeStep > 0 && !backDisabled &&
                        <Button color="inherit" onClick={handleOnBack}>Back</Button>
                    }
                    <Box sx={{ flex: 1 }}></Box>
                    {
                        data.steps[activeStep].optional &&
                        <Button color="inherit" onClick={handleNextStep}>Skip</Button>
                    }
                    {
                        activeStep == data.steps.length - 1 ?
                            <Button disabled={nextDisabled} onClick={handleComplete}>Complete</Button>
                            :
                            <Button disabled={nextDisabled} onClick={handleNextStep}>Next</Button>
                    }
                </Stack>
            }
        </CustomStepperContext.Provider>
    )
}

export default CustomStepper;
export { CustomStepperContext };
export type { StepItem, StepContext };
