import { CircularProgress, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import signUpRequest from "../../../api/auth/signUpRequest";
import useStepper from "../../../components/CustomStepper/hooks/useStepperContext";

const CompleteSignUp: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const currentStep = useStepper("completeSignUp");
  const signUpStep = useStepper("signUpForm");
  const validateStep = useStepper("validateEmailForm");

  //====Queries==========
  const signUp = useMutation(
    () =>
      signUpRequest({
        ...signUpStep.context.data,
        accessCode: validateStep.context.data.accessCode,
      }),
    {
      onSuccess: () => {
        currentStep.changeStepStatus("complete");
        setLoading(false);
      },
    }
  );

  useEffect(() => {
    signUp.mutate();
  }, []);

  return (
    <Box paddingTop="35px">
      <Stack alignItems={"center"} gap={5}>
        {loading && <CircularProgress size={50}></CircularProgress>}
        <Typography>
          {loading
            ? "Tài khoản đang được xử lý. Xin hãy đợi một lúc"
            : "Tài khoản của bạn đã được khởi tạo thành công."}
        </Typography>
      </Stack>
    </Box>
  );
};
export default CompleteSignUp;
