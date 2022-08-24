import Button from "@mui/material/Button";
import { Stack, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import useStepper from "../../../components/CustomStepper/hooks/useStepperContext";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import sendOtpRequest from "../../../apiRequests/auth/sendOtpRequest";
import { isDefined, isEmpty } from "class-validator";
import getAccessCodeRequest, {
  GetAccessCodeQueryKey,
} from "../../../apiRequests/auth/getAccessCodeRequest";

type ValidateEmailFormInputs = {
  accessCode: string;
  otp: string;
};

const ValidateEmailForm: React.FC = () => {
  const [counter, setCounter] = useState(30);

  const currentStep = useStepper("validateEmailForm");
  const signUpFormStep = useStepper("signUpForm");

  const validateForm = useForm<ValidateEmailFormInputs>();

  let email = signUpFormStep.context.data.email as string;

  //========Queries=================
  const sendOtp = useMutation(() =>
    sendOtpRequest({
      action: "CREATE_ACCOUNT",
      email: email,
    })
  );

  const getAccessCode = useQuery(
    [GetAccessCodeQueryKey],
    () =>
      getAccessCodeRequest({
        code: validateForm.getValues("otp"),
        email: email,
      }),
    {
      select: ({ data }) => data.data,
      onSuccess: (data) => {
        validateForm.reset({
          accessCode: data.accessCode,
        });
      },
      retry: false,
      enabled: false,
    }
  );

  useEffect(() => {
    if (counter == 0) return;
    const delay = setTimeout(() => {
      setCounter((counter) => counter - 1);
    }, 1000);
    return () => clearTimeout(delay);
  }, [counter]);

  //SendOTP first
  useEffect(() => {
    sendOtp.mutate();
  }, []);

  //Check otp good
  useEffect(() => {
    const delay = setTimeout(() => {
      if (
        !isDefined(validateForm.watch("accessCode")) &&
        !isEmpty(validateForm.watch("otp"))
      ) {
        getAccessCode.refetch();
      }
    }, 150);
    return () => clearTimeout(delay);
  }, [validateForm.watch("otp")]);

  //Complete the step
  useEffect(() => {
    if (isDefined(validateForm.watch("accessCode"))) {
      currentStep.updateData(validateForm.getValues());
      currentStep.changeStepStatus("complete");
    }
  }, [validateForm.watch("accessCode")]);

  //=======Callbacks============
  const handleSend = () => {
    setCounter(30);
    sendOtp.mutate();
  };

  return (
    <Box>
      <form>
        <Stack
          direction={"column"}
          width={"350px"}
          gap={2}
          sx={{ margin: "auto" }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              textTransform: "uppercase",
              marginBottom: "15px",
            }}
          >
            Xác thực email
          </Typography>
          {currentStep.context.status != "complete" ? (
            <Typography
              variant="subtitle1"
              sx={{
                marginBottom: "15px",
              }}
            >
              Vui lòng nhập mã xác nhận ShoesMark vừa gửi tới địa chỉ{" "}
              <Typography component={"span"} fontWeight={"bold"}>
                {email}
              </Typography>{" "}
              của bạn
            </Typography>
          ) : (
            <Typography
              variant="subtitle1"
              sx={{
                marginBottom: "15px",
              }}
            >
              Xác nhận thành công, bạn có thể đi tiếp
            </Typography>
          )}
          <TextField
            label={"Mã xác nhận"}
            {...validateForm.register("otp")}
            error={getAccessCode.isError}
            helperText={
              getAccessCode.isError &&
              (getAccessCode.error as any).response.data.message[0]
            }
          ></TextField>
          <Button
            disabled={counter != 0 || currentStep.context.status == "complete"}
            variant="contained"
            onClick={handleSend}
          >
            Gửi lại mã xác nhận {counter != 0 ? counter : ""}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
export default ValidateEmailForm;
