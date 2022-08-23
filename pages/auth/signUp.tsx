import { Box, Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import Link from "next/link";
import CustomStepper, {
  StepItem,
} from "../../components/CustomStepper/CustomStepper";
import LazyCompleteSignUp from "../../views/clientlayout/CompleteSignUp/LazyCompleteSignUp";
import LazySignUpForm from "../../views/clientlayout/SignUpForm/LazySignUpForm";
import LazyValidateEmailForm from "../../views/clientlayout/ValidateEmailForm/LazyValidateEmailForm";
import { CustomNextPage } from "../_app";

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
    <Box>
      <Breadcrumbs sx={{ marginBottom: "15px" }}>
        <Link href="/" passHref>
          <MuiLink underline="hover" color="inherit">
            Trang chủ
          </MuiLink>
        </Link>
        <Typography color="text.primary">Đăng ký</Typography>
      </Breadcrumbs>
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
    </Box>
  );
};
export default SignUpPage;
