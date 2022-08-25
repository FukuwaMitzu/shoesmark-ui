import {
  Box,
  Breadcrumbs,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { isDefined } from "class-validator";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { Category } from "../../apiRequests/category/category";
import getCategoryRequest from "../../apiRequests/category/getCategoryRequest";
import getAllShoesRequest, {
  GetAllShoesQueryKey,
} from "../../apiRequests/shoes/getAllShoesRequest";
import CustomPagination from "../../components/CustomPagination/CustomPagination";
import useCustomPagination from "../../components/CustomPagination/hooks/useCustomPagination";
import LazyShoesCard from "../../components/ShoesCard/LazyShoesCard";
import { CustomNextPage } from "../_app";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = (context.params?.id as string) ?? "";
  const category = await getCategoryRequest(id);
  if (!isDefined(category))
    return {
      notFound: true,
    };
  return {
    props: {
      category: category.data.data,
    },
  };
};

const CategoryPage: CustomNextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const category = props.category as Category;

  const { handlePagination, pagination, setPagination } = useCustomPagination({
    limit: 15,
    offset: 0,
    total: 0,
  });
  //========Queries===========
  const getAllShoesQuery = useQuery(
    [
      GetAllShoesQueryKey,
      { limit: pagination.limit, offset: pagination.offset },
      category,
    ],
    () => {
      const queryData = {
        categoryIds: [category.categoryId],
      };
      return getAllShoesRequest({
        limit: pagination.limit,
        offset: pagination.offset,
        ...queryData,
      });
    },
    {
      select: (data) => data.data,
      onSuccess: (data) => {
        setPagination({ ...pagination, total: data.total });
      },
    }
  );

  return (
    <Box>
      <Breadcrumbs sx={{ marginBottom: "15px" }}>
        <Link href="/" passHref>
          <MuiLink underline="hover" color="inherit">
            Trang chủ
          </MuiLink>
        </Link>
        <Typography color="text.primary">Danh mục</Typography>
      </Breadcrumbs>
      <Typography
        variant="h4"
        fontWeight={"bold"}
        textTransform={"uppercase"}
        color="text.primary"
      >
        Giày {category.categoryName}
      </Typography>
      <Typography>{category.description}</Typography>
      <Box>
        <Stack direction={"row"} flexWrap={"wrap"} gap={2} marginTop={"55px"}>
          {!getAllShoesQuery.isLoading &&
            getAllShoesQuery.data &&
            getAllShoesQuery.data.data.map((shoes) => (
              <LazyShoesCard key={shoes.shoesId} {...shoes} />
            ))}
        </Stack>
        {getAllShoesQuery.data && (
          <Stack alignItems={"center"} marginTop={"35px"}>
            <CustomPagination
              limit={pagination.limit}
              offset={pagination.offset}
              total={pagination.total}
              onPageChange={handlePagination}
            />
          </Stack>
        )}
      </Box>
    </Box>
  );
};
CategoryPage.layout="customer";
export default CategoryPage;
