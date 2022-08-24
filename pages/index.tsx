import { Box, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import getAllShoesRequest, {
  GetAllShoesQueryKey,
} from "../apiRequests/shoes/getAllShoesRequest";
import LazyShoesCard from "../components/ShoesCard/LazyShoesCard";

const Home: NextPage = () => {
  //========Queries===========
  const getAllSaleShoesQuery = useQuery(
    [GetAllShoesQueryKey + "Sale"],
    () => {
      return getAllShoesRequest({
        limit: 8,
        sortBy: {
          sale: "DESC",
        },
      });
    },
    {
      select: (data) => data.data,
    }
  );

  const getAllNewShoesQuery = useQuery(
    [GetAllShoesQueryKey + "New"],
    () => {
      return getAllShoesRequest({
        limit: 8,
        sortBy: {
          dateCreated: "DESC",
        },
      });
    },
    {
      select: (data) => data.data,
    }
  );

  return (
    <Stack direction={"column"} gap={10}>
      <Box>
        <Typography
          variant="h5"
          textTransform={"uppercase"}
          fontWeight={"bold"}
        >
          Khuyến mãi
        </Typography>
        <Stack direction={"row"} flexWrap={"wrap"} gap={2} marginTop={"35px"}>
          {!getAllSaleShoesQuery.isLoading &&
            getAllSaleShoesQuery.data &&
            getAllSaleShoesQuery.data.data.map((shoes) => (
              <LazyShoesCard key={shoes.shoesId} {...shoes} />
            ))}
        </Stack>
      </Box>
      <Box>
        <Typography
          variant="h5"
          textTransform={"uppercase"}
          fontWeight={"bold"}
        >
          Sản phẩm mới
        </Typography>
        <Stack direction={"row"} flexWrap={"wrap"} gap={2} marginTop={"35px"}>
          {!getAllNewShoesQuery.isLoading &&
            getAllNewShoesQuery.data &&
            getAllNewShoesQuery.data.data.map((shoes) => (
              <LazyShoesCard key={shoes.shoesId} {...shoes} />
            ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default Home;
