import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import MuiLink from "@mui/material/Link";
import { CustomNextPage } from "../../_app";
import { useSession } from "next-auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useMutation, useQuery } from "@tanstack/react-query";
import createShoesRequest from "../../../apiRequests/shoes/createShoesRequest";
import Button from "@mui/material/Button";
import { ChangeEvent, useRef } from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import getAllCategoryRequest from "../../../apiRequests/category/getAllCategoryRequest";
import getAllColorRequest from "../../../apiRequests/color/getAllColorRequest";
import getAllBrandRequest from "../../../apiRequests/brand/getAllBrandRequest";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import sizeList from "../../../util/sizeFilterList";

type CreateShoesFormInputs = {
  shoesName: string;
  description: string;
  shoesImage: unknown;
  UPC: string;
  SKU: string;
  categories: string[];
  brandId?: string;
  colorId?: string;
  size: number;
  price: number;
  importPrice: number;
  sale: number;
  quantity: number;
};

const CreateShoesPage: CustomNextPage = () => {
  const session = useSession();
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const imageRef: any = useRef();
  //========Queries============================
  const createShoesQuery = useMutation(
    (data: FormData) =>
      createShoesRequest({
        formData: data,
        accessToken: session.data?.user?.accessToken,
      }),
    {
      onSuccess: () => {
        router.back();
        enqueueSnackbar("Kh???i t???o th??nh c??ng", { variant: "success" });
      },
      onError: () => {
        enqueueSnackbar("Kh???i t???o th???t b???i", { variant: "error" });
      },
    }
  );

  const getAllCategory = useQuery(
    ["getAllCategory"],
    () => getAllCategoryRequest({}),
    {
      select: (data) => data.data,
    }
  );
  const getAllColor = useQuery(["getAllColor"], () => getAllColorRequest({}), {
    select: (data) => data.data,
  });
  const getAllBrand = useQuery(["getAllBrand"], () => getAllBrandRequest({}), {
    select: (data) => data.data,
  });

  //======Callbacks==================================
  const createShoesForm = useForm<CreateShoesFormInputs>();
  const handleCreateShoes: SubmitHandler<CreateShoesFormInputs> = (data) => {
    const form = new FormData();
    for (var key in data) {
      form.append(key, (data as any)[key]);
    }
    form.append("categories", JSON.stringify(data.categories));
    createShoesQuery.mutate(form);
  };
  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    var selectedFile = event.target.files[0];
    if (!selectedFile) return;
    var reader = new FileReader();
    imageRef.current.title = selectedFile.name;

    reader.onload = function (event) {
      imageRef.current.src = event.target?.result;
    };

    reader.readAsDataURL(selectedFile);
  }
  //=================================
  return (
    <Box>
      <Breadcrumbs sx={{ marginBottom: "15px" }}>
        <Link href="/admin/dashboard" passHref>
          <MuiLink underline="hover" color="inherit">
            Dashboard
          </MuiLink>
        </Link>
        <Link href="/admin/giay" passHref>
          <MuiLink underline="hover" color="inherit">
            Gi??y
          </MuiLink>
        </Link>
        <Typography color="text.primary">Th??m Gi??y</Typography>
      </Breadcrumbs>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          marginBottom: "25px",
        }}
      >
        Th??m Gi??y
      </Typography>
      <form onSubmit={createShoesForm.handleSubmit(handleCreateShoes)}>
        <Stack direction={"row"} spacing={4} sx={{ marginBottom: "50px" }}>
          <Stack spacing={2}>
            <Controller
              name="shoesImage"
              control={createShoesForm.control}
              render={({ field }) => (
                <Stack direction={"column"} spacing={2} width={"250px"}>
                  <img width={250} height={250} ref={imageRef}></img>
                  <Button
                    component={"label"}
                    startIcon={<CameraAltIcon />}
                    variant={"text"}
                  >
                    T???i ???nh l??n{" "}
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        onFileSelected(e);
                        if (e.target.files) field.onChange(e.target.files[0]);
                      }}
                    />
                  </Button>
                </Stack>
              )}
            />
            <LoadingButton
              loading={createShoesQuery.isLoading}
              variant="contained"
              type="submit"
            >
              Kh???i t???o
            </LoadingButton>
          </Stack>
          <Stack direction={"column"} spacing={2} width={"475px"}>
            <TextField
              label={"T??n gi??y"}
              {...createShoesForm.register("shoesName")}
            ></TextField>
            <TextField
              label={"M?? v???ch s???n ph???m"}
              {...createShoesForm.register("UPC")}
            ></TextField>
            <TextField
              label={"M?? ????n v??? l??u kho"}
              {...createShoesForm.register("SKU")}
            ></TextField>
            <Controller
              name="categories"
              control={createShoesForm.control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  getOptionLabel={(option: any) => option.categoryName}
                  filterSelectedOptions
                  options={getAllCategory.data?.data ?? []}
                  renderInput={(params) => (
                    <TextField {...params} label="Th??? lo???i" />
                  )}
                  onChange={(e, data) =>
                    field.onChange(data.map((a) => a.categoryId))
                  }
                />
              )}
            />
            <Controller
              name="brandId"
              control={createShoesForm.control}
              render={({ field }) => (
                <Autocomplete
                  getOptionLabel={(option: any) => option.brandName}
                  filterSelectedOptions
                  options={getAllBrand.data?.data ?? []}
                  renderInput={(params) => (
                    <TextField {...params} label="Th????ng hi???u" />
                  )}
                  onChange={(e, option) => field.onChange(option?.brandId)}
                />
              )}
            />
            <Controller
              name="colorId"
              control={createShoesForm.control}
              render={({ field }) => (
                <Autocomplete
                  getOptionLabel={(option: any) => option.colorName}
                  filterSelectedOptions
                  options={getAllColor.data?.data ?? []}
                  renderOption={(params, option) => (
                    <Box component={"li"} {...params}>
                      <Box
                        sx={{
                          backgroundColor: option.colorHex,
                          width: "35px",
                          height: "35px",
                          marginRight: "10px",
                        }}
                      ></Box>
                      <Typography>{option.colorName}</Typography>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} label="M??u s???c" />
                  )}
                  onChange={(e, option) => field.onChange(option?.colorId)}
                />
              )}
            />
            <Controller
              name="size"
              control={createShoesForm.control}
              render={({ field }) => (
                <Autocomplete
                  filterSelectedOptions
                  getOptionLabel={(option) => option.toString()}
                  options={sizeList}
                  renderInput={(params) => (
                    <TextField {...params} label="K??ch c???" />
                  )}
                  onChange={(e, option) => field.onChange(option)}
                />
              )}
            />
          </Stack>
          <Stack spacing={2}>
            <TextField
              label={"????n gi?? nh???p"}
              {...createShoesForm.register("importPrice")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">VND</InputAdornment>
                ),
              }}
            ></TextField>
            <TextField
              label={"????n gi?? b??n"}
              {...createShoesForm.register("price")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">VND</InputAdornment>
                ),
              }}
            ></TextField>
            <TextField
              label={"Chi???t kh???u"}
              {...createShoesForm.register("sale")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">%</InputAdornment>
                ),
              }}
            ></TextField>
            <TextField
              label={"S??? l?????ng trong kho"}
              {...createShoesForm.register("quantity")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">????i</InputAdornment>
                ),
              }}
            ></TextField>
          </Stack>
        </Stack>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              textTransform: "uppercase",
              marginBottom: "25px",
            }}
          >
            M?? t???
          </Typography>
          <TextField
            fullWidth
            multiline
            {...createShoesForm.register("description")}
            maxRows={20}
            rows={15}
          />
        </Box>
      </form>
    </Box>
  );
};

CreateShoesPage.layout = "manager";
CreateShoesPage.auth = {
  role: ["admin", "employee"],
};
export default CreateShoesPage;
