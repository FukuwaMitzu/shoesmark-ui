import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import getAllShoesRequest, {
  GetAllShoesQueryKey,
} from "../../apiRequests/shoes/getAllShoesRequest";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import CardActionArea from "@mui/material/CardActionArea";
import ShoesSearchDialogItem from "./ShoesSearchDialogItem";
import { Shoes } from "../../apiRequests/shoes/shoes";
import Box from "@mui/material/Box";
import { useEffect } from "react";

interface ShoesSearchDialogProps {
  open: boolean;
  onItemSelected?: (shoes: Shoes) => void;
  onClose?: () => void;
}

interface SearchShoesFormInputs {
  SKU: string;
}
const ShoesSearchDialog: React.FC<ShoesSearchDialogProps> = (props) => {
  const searchForm = useForm<SearchShoesFormInputs>({
    defaultValues: {
      SKU: "",
    },
  });

  //====Queries==============
  const getShoesQuery = useQuery(
    [GetAllShoesQueryKey],
    () =>
      getAllShoesRequest({
        limit: 8,
        SKU: searchForm.getValues("SKU"),
      }),
    {
      select: ({ data }) => data.data,
    }
  );

  useEffect(() => {
    const delay = setTimeout(() => {
      getShoesQuery.refetch();
    }, 250);
    return ()=>clearTimeout(delay);
  }, [searchForm.watch("SKU")]);

  const handleClose = () => {
    if (props.onClose) props.onClose();
  };
  const handleSelect = (shoes: Shoes) => {
    if (props.onItemSelected) props.onItemSelected(shoes);
  };
  const handleSubmit: SubmitHandler<SearchShoesFormInputs> = (data) => {
    getShoesQuery.refetch();
  };
  return (
    <Dialog open={props.open} maxWidth={"lg"} fullWidth>
      <DialogTitle>Tìm kiếm giày</DialogTitle>
      <DialogContent>
        <Box sx={{ paddingY: "10px" }}>
          <form onSubmit={searchForm.handleSubmit(handleSubmit)}>
            <Stack
              direction={"row"}
              gap={1}
              sx={{ maxWidth: "550px", width: "100%" }}
            >
              <TextField
                label={"Mã đơn vị lưu kho"}
                {...searchForm.register("SKU")}
                fullWidth
              ></TextField>
              <Button
                variant="contained"
                type={"submit"}
                sx={{ flexShrink: 0 }}
              >
                Tìm kiếm
              </Button>
            </Stack>
          </form>
          <Stack
            direction={"row"}
            flexWrap={"wrap"}
            columnGap={2}
            rowGap={3}
            sx={{ marginY: "25px" }}
          >
            {getShoesQuery.isSuccess &&
              getShoesQuery.data.map((shoes) => (
                <Box
                  key={shoes.shoesId}
                  sx={{ maxWidth: "250px", width: "100%" }}
                >
                  {shoes.quantity > 0 ? (
                    <CardActionArea onClick={() => handleSelect(shoes)}>
                      <ShoesSearchDialogItem {...shoes}></ShoesSearchDialogItem>
                    </CardActionArea>
                  ) : (
                    <Box sx={{filter:"brightness(80%) grayscale(60%)"}}>
                        <ShoesSearchDialogItem {...shoes}></ShoesSearchDialogItem>
                    </Box>
                  )}
                </Box>
              ))}
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color={"error"} onClick={handleClose}>
          Huỷ
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ShoesSearchDialog;
