import Box from "@mui/material/Box";
import React, { useState } from "react";
import { CustomNextPage } from "../_app";
import Image from "next/image";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MuiLink from "@mui/material/Link";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import LoadingButton from "@mui/lab/LoadingButton";
import { useRouter } from "next/router";
import Alert from "@mui/material/Alert";

interface SignInFormInputs {
  username: string;
  password: string;
}
const SignInPage: CustomNextPage = () => {
  const signInForm = useForm<SignInFormInputs>();
  const router = useRouter();
  const callbackUrl = router.query.callbackUrl as string | undefined;
  const [err, setError] = useState(false);
  const signInQuery = useMutation(
    (data: SignInFormInputs) =>
      signIn("credentials", { redirect: false, ...data }),
    {
      onSuccess: (data) => {
        if (!data?.error) {
          router.push(callbackUrl || "/");
        } else {
          setError(true);
        }
      },
    }
  );
  const handleSubmit: SubmitHandler<SignInFormInputs> = (data) => {
    signInQuery.mutate(data);
  };
  return (
    <Stack direction="row" sx={{ minHeight: "100vh" }}>
      <Box width="225px" height={"100vh"} position="sticky" sx={{ inset: 0 }}>
        <Image
          objectFit="cover"
          alt={"Ảnh đăng ký"}
          src={"/images/signInLeftPic.jpg"}
          layout="fill"
        />
      </Box>
      <Container sx={{ minHeight: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
            width: "450px",
            alignItems: "center",
          }}
        >
          <Box width="100%">
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                marginBottom: "25px",
              }}
            >
              Đăng Nhập
            </Typography>
            <Stack
              component={"form"}
              method={"POST"}
              onSubmit={signInForm.handleSubmit(handleSubmit)}
              gap={2}
            >
              {err && !signInQuery.isLoading && (
                <Alert severity="info">
                  Tài khoản hoặc mật khẩu đăng nhập không đúng
                </Alert>
              )}
              <TextField
                fullWidth
                label="Email / Tên đăng nhập"
                {...signInForm.register("username")}
              />
              <TextField
                type="password"
                fullWidth
                label="Mật khẩu"
                {...signInForm.register("password")}
              />
              <LoadingButton
                loading={signInQuery.isLoading}
                type="submit"
                variant="contained"
              >
                Đăng nhập
              </LoadingButton>
            </Stack>
            <Typography sx={{ marginTop: 3 }}>
              Chưa có tài khoản?{" "}
              <MuiLink
                href="/auth/signUp"
                textTransform="uppercase"
                fontWeight={"bold"}
                sx={{ textDecoration: "none" }}
              >
                Đăng ký
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Stack>
  );
};

export default SignInPage;
