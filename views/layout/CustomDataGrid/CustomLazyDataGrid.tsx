import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";

const CustomLazyDataGridFallback: React.FC = () => {
  return (
    <>
      <Skeleton variant="rectangular" width={125} height={35 } sx={{ marginBottom: "7px" }} />
      <Skeleton variant="rectangular" width={"100%"} height={150} />
    </>
  );
};

const CustomLazyDataGrid = dynamic(
  () => import("../CustomDataGrid/CustomDataGrid"),
  {
    loading: CustomLazyDataGridFallback,
  }
);

export default CustomLazyDataGrid;
