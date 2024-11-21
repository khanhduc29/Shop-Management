import { Box } from "@mui/material"
import EditProduct from "./components/EditProduct"
import { ProductType } from "../../types/product.types";
import { useParams } from "react-router-dom";
import { memo, useCallback, useEffect, useState } from "react";
import { instance } from "../../../../api/api";

const DetailProduct = () => {
  const [productData, setProductData] = useState<ProductType>({} as ProductType);
  const { slug } = useParams<{ slug: string }>();

  const getProductData = useCallback(async () => {
    try {
      const response = await instance.get(`product/getDetail/${slug}`);
      setProductData(response.data.productData);
    } catch (error) {
      console.log(error);
      console.log('error in get product data in edit product');
    }

  }, [slug])

  useEffect(() => {
    if (slug === 'add') return
    getProductData();
  }, [slug])

  console.log(productData)

  return (
    <Box sx={{ width: '100%' }}>
      {productData && <EditProduct productData={productData} />}
    </Box>
  )
}

export default memo(DetailProduct) 