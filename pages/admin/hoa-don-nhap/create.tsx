import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import { CustomNextPage } from "../../_app";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Shoes } from "../../../apiRequests/shoes/shoes";
import Stack from "@mui/material/Stack";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import LazyDetailImportOrderItem from "../../../components/DetailImportOrderItem/LazyDetailImportOrderItem";
import ImportShoesSearchDialog from "../../../components/ImportShoesSearchDialog/ImportShoesSearchDialog";
import currencyFormater from "../../../util/currencyFormater";
import Big from "big.js";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import createImportOrderRequest, {
  CreateImportOrderParam,
} from "../../../apiRequests/importOrder/createImportOrderRequest";
import { useSession } from "next-auth/react";
import createImportOrderDetailRequest, {
  CreateImportOrderDetailParam,
} from "../../../apiRequests/importOrder/createImportOrderDetailRequest";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";

interface TemporaryImportOrderDetail {
  shoesId: string;
  shoes: Shoes;
  quantity: number;
  importPrice: number;
}
interface CreateImportOrderFormInputs {
  note: string;
}
const CreateImportOrder: CustomNextPage = () => {
  const session = useSession();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [temporaryDetailOrder, setTemporaryDetailOrder] = useState<
    TemporaryImportOrderDetail[]
  >([]);
  const createImportOrderForm = useForm<CreateImportOrderFormInputs>();
  const [openShoesSearchDialog, setOpenShoesSearchDialog] = useState(false);

  //=======Queries=============
  const createImportOrder = useMutation(
    (data: CreateImportOrderParam) => createImportOrderRequest(data),
    {
      onSuccess: ({ data }) => {
        const queue = temporaryDetailOrder.map((temp) => {
          return createImportOrderDetail.mutateAsync({
            ...temp,
            importOrderId: data.data.importOrderId,
            accessToken: session.data?.user?.accessToken,
          });
        });
        Promise.all(queue)
          .then(() => {
            enqueueSnackbar("Kh???i t???o th??nh c??ng", { variant: "success" });
            router.back();
          })
          .catch(() => {
            enqueueSnackbar("Kh???i t???o th???t b???i", { variant: "error" });
          });
      },
      onError: () => {
        enqueueSnackbar("Kh???i t???o th???t b???i", { variant: "error" });
      },
    }
  );
  const createImportOrderDetail = useMutation(
    (data: CreateImportOrderDetailParam) => createImportOrderDetailRequest(data)
  );
  //==========Callbacks========
  const handleOpenShoesSearchDialog = () => {
    setOpenShoesSearchDialog(true);
  };
  const handleCloseShoesSearchDialog = () => {
    setOpenShoesSearchDialog(false);
  };
  const handleAddShoes = (shoes: Shoes) => {
    const index = temporaryDetailOrder.findIndex(
      (temp) => temp.shoesId == shoes.shoesId
    );
    if (index > -1) {
      let temp = temporaryDetailOrder[index];
      temporaryDetailOrder[index] = temporaryDetailOrder[0];
      temporaryDetailOrder[0] = temp;
      temp.importPrice = shoes.importPrice;
    } else if (index == -1) {
      temporaryDetailOrder.unshift({
        shoesId: shoes.shoesId,
        quantity: 1,
        shoes,
        importPrice: shoes.importPrice,
      });
      setTemporaryDetailOrder([...temporaryDetailOrder]);
    }
    handleCloseShoesSearchDialog();
  };
  const handleChange = (shoesId: string, quantity: number) => {
    const detail = temporaryDetailOrder.find(
      (detail) => detail.shoesId == shoesId
    );
    if (detail) {
      detail.quantity = quantity;
      setTemporaryDetailOrder([...temporaryDetailOrder]);
    }
  };
  const handleDelete = (shoesId: string) => {
    const filter = temporaryDetailOrder.filter(
      (shoes) => shoes.shoesId != shoesId
    );
    setTemporaryDetailOrder(filter);
  };
  const handleCreate = () => {
    createImportOrder.mutate({
      ...createImportOrderForm.getValues(),
      accessToken: session.data?.user?.accessToken,
    });
  };
  return (
    <Box>
      <Breadcrumbs sx={{ marginBottom: "15px" }}>
        <Link href="/admin/dashboard" passHref>
          <MuiLink underline="hover" color="inherit">
            Dashboard
          </MuiLink>
        </Link>
        <Link href="/admin/hoa-don-nhap" passHref>
          <MuiLink underline="hover" color="inherit">
            Ho?? ????n nh???p
          </MuiLink>
        </Link>
        <Typography color="text.primary">Th??m ho?? ????n nh???p</Typography>
      </Breadcrumbs>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          marginBottom: "25px",
        }}
      >
        Th??m ho?? ????n nh???p
      </Typography>
      <Box>
        <Box sx={{ marginBottom: "15px" }}>
          <Typography>
            Gi?? tr??? ho?? ????n nh???p:{" "}
            {currencyFormater.format(
              temporaryDetailOrder
                .reduce((pre, current) => {
                  const importPrice = new Big(current.importPrice);
                  const quantity = new Big(current.quantity);
                  const niemYet = importPrice.mul(quantity);
                  return pre.plus(niemYet);
                }, new Big(0))
                .toNumber()
            )}
          </Typography>
          <Typography>
            T???ng s??? s???n ph???m:{" "}
            {temporaryDetailOrder.reduce(
              (pre, current) => current.quantity + pre,
              0
            )}
          </Typography>
        </Box>
        <TextField
          label={"Ghi ch??"}
          sx={{ width: "550px" }}
          {...createImportOrderForm.register("note")}
        ></TextField>
        <Box sx={{ marginY: "25px" }}>
          <Button
            variant="outlined"
            startIcon={<AddOutlinedIcon />}
            onClick={handleOpenShoesSearchDialog}
          >
            Th??m m???i
          </Button>
          <ImportShoesSearchDialog
            open={openShoesSearchDialog}
            onClose={handleCloseShoesSearchDialog}
            onItemSelected={handleAddShoes}
          ></ImportShoesSearchDialog>
        </Box>
        <Stack sx={{ marginY: "25px", minHeight: "275px" }} gap={5}>
          {temporaryDetailOrder.map((detail) => (
            <LazyDetailImportOrderItem
              key={detail.shoesId}
              {...detail.shoes}
              price={detail.importPrice}
              quantity={detail.quantity}
              onChange={handleChange}
              onDelete={handleDelete}
            />
          ))}
        </Stack>
        <LoadingButton onClick={handleCreate} variant={"contained"}>
          Kh???i t???o
        </LoadingButton>
      </Box>
    </Box>
  );
};
CreateImportOrder.layout = "manager";
CreateImportOrder.auth = {
  role: ["admin", "employee"],
};
export default CreateImportOrder;
