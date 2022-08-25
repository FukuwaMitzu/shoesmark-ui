import { Box, Container, Stack, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import CustomStepper, {
  StepItem,
} from "../../components/CustomStepper/CustomStepper";
import LazyCompleteSignUp from "../../views/clientlayout/CompleteSignUp/LazyCompleteSignUp";
import LazySignUpForm from "../../views/clientlayout/SignUpForm/LazySignUpForm";
import LazyValidateEmailForm from "../../views/clientlayout/ValidateEmailForm/LazyValidateEmailForm";
import { CustomNextPage } from "../_app";
import Image from "next/image";

const steps: StepItem[] = [
  {
    name: "signUpForm",
    label: "Thông tin đăng ký",
    renderContent: () => <LazySignUpForm />,
  },
  {
    name: "validateEmailForm",
    label: "Xác thực email",
    renderContent: () => <LazyValidateEmailForm />,
  },
  {
    name: "completeSignUp",
    label: "Hoàn tất đăng ký",
    renderContent: () => <LazyCompleteSignUp />,
  },
];

const SignUpPage: CustomNextPage = () => {
  const handleComplete = () => {
    signIn("credentials", { callbackUrl: "/" });
  };
  return (
    <Stack direction={"row"}>
      <Box width="225px" height={"100vh"} position="sticky" sx={{inset:0}}>
          <Image
            objectFit="cover"
            alt={"Ảnh đăng ký"}
            src={"/images/signInLeftPic.jpg"}
            layout="fill"
          />
      </Box>
      <Container sx={{ paddingY: 10 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase",
            marginBottom: "25px",
          }}
        >
          Đăng ký
        </Typography>
        <CustomStepper onComplete={handleComplete} steps={steps} sticky />
      </Container>
    </Stack>
  );
};
export default SignUpPage;
