import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import { CustomNextPage } from "../_app";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Avatar, Button, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import getMeRequest, { GetMeQueryKey } from "../../apiRequests/user/getMeRequest";
import { useSession } from "next-auth/react";
import stringAvatar from "../../util/stringAvatar";
import dayjs from "dayjs";
import genderList from "../../util/genderList";
import EditIcon from "@mui/icons-material/Edit";

const ProfilePage: CustomNextPage = () => {
  const session = useSession();
  const getMe = useQuery(
    [GetMeQueryKey],
    () => getMeRequest({ accessToken: session.data?.user?.accessToken }),
    {
      select: ({ data }) => data.data,
    }
  );

  const fullName = getMe.isSuccess
    ? getMe.data?.lastName + " " + getMe.data?.firstName
    : "";
  return (
    <Box>
      <Breadcrumbs sx={{ marginBottom: "15px" }}>
        <Link href="/" passHref>
          <MuiLink underline="hover" color="inherit">
            Trang chủ
          </MuiLink>
        </Link>
        <Typography color="text.primary">Thông tin cá nhân</Typography>
      </Breadcrumbs>
      <Typography
        variant="h4"
        fontWeight={"bold"}
        textTransform={"uppercase"}
        color="text.primary"
      >
        Thông tin cá nhân
      </Typography>
      <Stack direction={"row"} alignItems={"center"} gap={2} marginTop={"25px"}>
        <Box sx={{ alignSelf: "flex-start", paddingY: 1 }}>
          <Avatar {...stringAvatar(fullName)}></Avatar>
        </Box>
        <Stack>
          <Stack direction={"row"} gap={5}>
            <Box>
              <Typography variant="h6">{fullName}</Typography>
              <Typography variant="subtitle1" color={"GrayText"}>
                {`Tham gia ngày ${dayjs(getMe.data?.createdAt).format("LL")}`}
              </Typography>
            </Box>
            <Box>
              <Link href={"/profile/edit"} passHref>
                <Button LinkComponent={"a"} variant="outlined" size={"small"} endIcon={<EditIcon />}>
                    Chỉnh sửa hồ sơ
                </Button>
              </Link>
            </Box>
          </Stack>
          <Box marginTop={"15px"}>
            <Box>
              <Typography variant="subtitle1" fontWeight={"bold"}>
                Giới tính
              </Typography>
              <Typography variant="subtitle1">
                {
                  genderList.find(
                    (gender) => gender.value == getMe.data?.gender
                  )?.title
                }
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={"bold"}>
                Email
              </Typography>
              <Typography variant="subtitle1">{getMe.data?.email}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={"bold"}>
                Điện thoại
              </Typography>
              <Typography variant="subtitle1">
                {getMe.data?.phoneNumber}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={"bold"}>
                Tỉnh / Thành phố
              </Typography>
              <Typography variant="subtitle1">{getMe.data?.city}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={"bold"}>
                Quận / Huyện
              </Typography>
              <Typography variant="subtitle1">
                {getMe.data?.district}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={"bold"}>
                Địa chỉ
              </Typography>
              <Typography variant="subtitle1">{getMe.data?.address}</Typography>
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};
ProfilePage.auth = {
  role: ["admin", "user", "employee"],
};
export default ProfilePage;
