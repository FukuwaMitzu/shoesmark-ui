import { useContext } from "react";
import {
  CustomStepperContext,
  StepStatus,
  StepRequestCallBack,
} from "../CustomStepper";

const useStepper = (name: string) => {
  const {
    getContext,
    initialContext,
    onBackRequest,
    onNextRequest,
    onlyBackWhen,
    onlyNextWhen,
    onContextUpdate,
    setStepStatus,
  } = useContext(CustomStepperContext);
  return {
    context: getContext(name),
    updateData: (data: any) => onContextUpdate(name, data),
    onlyBackWhen: (value: boolean | null) => onlyBackWhen(name, value),
    onlyNextWhen: (value: boolean | null) => onlyNextWhen(name, value),
    changeStepStatus: (status: StepStatus) => setStepStatus(name, status),
    onBackRequest: (callback: StepRequestCallBack) =>
      onBackRequest(name, callback),
    onNextRequest: (callback: StepRequestCallBack) =>
      onNextRequest(name, callback),
  };
};
export default useStepper;
