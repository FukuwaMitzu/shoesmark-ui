import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { createContext, ReactNode, useEffect, useState } from "react";
import TabPanel from "@mui/lab/TabPanel";
import TabsContext from "@mui/lab/TabContext";

interface StepItem {
  name: string;
  label?: string;
  optional?: ReactNode;
  status?: StepStatus;
  renderContent: () => ReactNode;
}
type StepConditional = {
  next: boolean | null;
  back: boolean | null;
};
export type StepRequestCallBack = () => void;
type StepRequest = {
  next: StepRequestCallBack;
  back: StepRequestCallBack;
};
interface CustomStepperProps {
  steps: StepItem[];
  sticky?: boolean;
  onComplete?: (e: any[]) => void;
}
export type StepStatus = "complete" | "valid" | "invalid";
interface StepContext {
  name: string;
  status: StepStatus;
  data?: any;
}
interface CustomStepperContextProps {
  initialContext: StepContext[];
  onlyBackWhen: (contextName: string, value: boolean | null) => void;
  onlyNextWhen: (contextName: string, value: boolean | null) => void;
  getContext: (
    contextName: string,
    defaultContext?: StepContext
  ) => StepContext | undefined;
  onContextUpdate: (contextName: string, data: any) => void;
  setStepStatus: (contextName: string, status: StepStatus) => void;
  onBackRequest: (contextName: string, callback: StepRequestCallBack) => void;
  onNextRequest: (contextName: string, callback: StepRequestCallBack) => void;
}
const CustomStepperContext = createContext<CustomStepperContextProps>({
  initialContext: [],
  onlyBackWhen: () => undefined,
  onlyNextWhen: () => undefined,
  getContext: () => ({ name: "", status: "invalid" }),
  onContextUpdate: () => {},
  setStepStatus: () => {},
  onBackRequest: () => undefined,
  onNextRequest: () => undefined,
});

const CustomStepper: React.FC<CustomStepperProps> = (data) => {
  const [activeStep, setActiveStep] = useState(0);

  //=============Context===============
  const [initialContext, setInitialContext] = useState<StepContext[]>(
    data.steps.map((step) => ({
      name: step.name,
      status: step.status ?? "invalid",
    }))
  );
  const [conditional, setConditional] = useState<StepConditional[]>(
    data.steps.map((step) => ({ next: null, back: null }))
  );
  const [requestCallBack, setRequestCallBack] = useState<StepRequest[]>(
    data.steps.map((step) => ({ next: () => {}, back: () => {} }))
  );
  const getContext = (contextName: string, defaultContext?: StepContext) => {
    return (
      initialContext.find((context) => context.name == contextName) ??
      defaultContext
    );
  };
  //Check nextList condition
  useEffect(() => {
    if (conditional[activeStep].next && activeStep < initialContext.length) {
      requestCallBack[activeStep].next();
      setActiveStep((activeStep) => activeStep + 1);
    }
  }, [conditional, requestCallBack, activeStep, initialContext.length]);

  //Check backList condition
  useEffect(() => {
    if (conditional[activeStep].back && activeStep > 0) {
      requestCallBack[activeStep].back();
      setActiveStep((activeStep) => activeStep - 1);
    }
  }, [conditional, requestCallBack, activeStep]);

  //Handle steps
  const handleNextStep = () => {
    if (conditional[activeStep].next == null) {
      requestCallBack[activeStep].next();
      setActiveStep((activeStep) => activeStep + 1);
    }
  };
  const handleOnBack = () => {
    if (conditional[activeStep].back == null) {
      requestCallBack[activeStep].back();
      setActiveStep((activeStep) => activeStep - 1);
    }
  };

  //Stop going next step
  const nextDisabled = initialContext[activeStep].status == "invalid";
  //Stop going back step
  const backDisabled =
    initialContext[activeStep].status == "complete" ||
    (activeStep > 0
      ? initialContext[activeStep - 1].status == "complete"
      : false);
  const onContextUpdate = (contextName: string, data: any) => {
    const context = initialContext.find(
      (context) => context.name == contextName
    );
    if (context) {
      if (context.status != "complete") {
        context.data = data;
        setInitialContext((initialContext) => [...initialContext]);
      }
    }
  };
  const onlyNextWhen = (contextName: string, value: boolean | null) => {
    const index = initialContext.findIndex((data) => data.name == contextName);
    if (index != -1) {
      conditional[index].next = value;
      setConditional((conditional) => [...conditional]);
    }
  };
  const onlyBackWhen = (contextName: string, value: boolean | null) => {
    const index = initialContext.findIndex((data) => data.name == contextName);
    if (index != -1) {
      conditional[index].back = value;
      setConditional((conditional) => [...conditional]);
    }
  };
  const onNextRequest = (
    contextName: string,
    callback: StepRequestCallBack
  ) => {
    const index = initialContext.findIndex((data) => data.name == contextName);
    if (index != -1) {
      requestCallBack[index].next = callback;
      setRequestCallBack((conditional) => [...requestCallBack]);
    }
  };
  const onBackRequest = (
    contextName: string,
    callback: StepRequestCallBack
  ) => {
    const index = initialContext.findIndex((data) => data.name == contextName);
    if (index != -1) {
      requestCallBack[index].back = callback;
      setRequestCallBack((conditional) => [...requestCallBack]);
    }
  };
  const setStepStatus = (contextName: string, status: StepStatus) => {
    const context = initialContext.find(
      (context) => context.name == contextName
    );
    if (context) {
      if (context.status != "complete") {
        context.status = status;
        setInitialContext((initialContext) => [...initialContext]);
      }
    }
  };

  const handleComplete = () => {
    if (data.onComplete) {
      data.onComplete(initialContext);
    }
  };
  //========================================
  if (data.steps.length == 0) return <></>;

  return (
    <CustomStepperContext.Provider
      value={{
        initialContext,
        onlyNextWhen,
        onlyBackWhen,
        getContext,
        onNextRequest,
        onBackRequest,
        onContextUpdate,
        setStepStatus,
      }}
    >
      <Box
        sx={
          data.sticky
            ? {
                marginTop: "15px",
                position: "sticky",
                top: "75px",
                paddingTop: "20px",
                paddingBottom: "10px",
                paddingX: "7px",
                backgroundColor: "background.paper",
                boxShadow: 1,
                zIndex: 2,
              }
            : {}
        }
      >
        <Stepper activeStep={activeStep}>
          {data.steps.map((step) => (
            <Step key={step.label}>
              <StepLabel optional={step.optional}>
                {step.label ?? step.name}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        {data.sticky && (
          <Stack direction={"row"} spacing={2} marginTop="15px">
            {activeStep > 0 && !backDisabled && (
              <Button color="inherit" onClick={handleOnBack}>
                Back
              </Button>
            )}
            <Box sx={{ flex: 1 }}></Box>
            {data.steps[activeStep].optional && (
              <Button color="inherit" onClick={handleNextStep}>
                Skip
              </Button>
            )}
            {activeStep == data.steps.length - 1 ? (
              <Button disabled={nextDisabled} onClick={handleComplete}>
                Complete
              </Button>
            ) : (
              <Button disabled={nextDisabled} onClick={handleNextStep}>
                Next
              </Button>
            )}
          </Stack>
        )}
      </Box>
      <Box marginTop={"35px"}>
        <TabsContext value={activeStep.toString()}>
            {data.steps.map((step, index) => (
              <TabPanel key={step.name} value={index.toString()}>
                {step.renderContent()}
              </TabPanel>
            ))}
        </TabsContext>
      </Box>
      {!data.sticky && (
        <Stack direction={"row"} spacing={2} marginTop="15px">
          {activeStep > 0 && !backDisabled && (
            <Button color="inherit" onClick={handleOnBack}>
              Back
            </Button>
          )}
          <Box sx={{ flex: 1 }}></Box>
          {data.steps[activeStep].optional && (
            <Button color="inherit" onClick={handleNextStep}>
              Skip
            </Button>
          )}
          {activeStep == data.steps.length - 1 ? (
            <Button disabled={nextDisabled} onClick={handleComplete}>
              Complete
            </Button>
          ) : (
            <Button disabled={nextDisabled} onClick={handleNextStep}>
              Next
            </Button>
          )}
        </Stack>
      )}
    </CustomStepperContext.Provider>
  );
};

export default CustomStepper;
export { CustomStepperContext };
export type { StepItem, StepContext };
