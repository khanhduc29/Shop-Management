import CardToCreateItem from "./CardToCreateItem"
import oc_prod from '../../../../../assets/images/oc-megaphone.svg'
import oc_discount from '../../../../../assets/images/oc-discount.svg'
import oc_collection from '../../../../../assets/images/oc-collection.svg'
import { Grid2 } from "@mui/material"
import TopViewsProduct from "./TopViewsProduct"
import { memo } from "react"
import { useTranslation } from "react-i18next"

export type CardToCreateItemType = {
  title: string,
  description: string,
  image: React.ReactNode,
  path: string
}


const ProductTable = ({ productListRating, productListInStock, productListView }: any) => {
  const { t } = useTranslation('dashboard')
  
  const cardToCreateItem: CardToCreateItemType[] = [
    {
      title: t('prod'),
      description: t('createProd'),
      image: <img src={oc_collection} width={80} alt="blog" />,
      path: "/product/add"
  
    },
    {
      title: t('discount'),
      description: t('createDiscount'),
      image: <img src={oc_discount} width={80} alt="discount" />,
      path: "/coupon"
    },
    {
      title: t('blog'),
      description: t('createBlog'),
      image: <img src={oc_prod} width={80} alt="product" />,
      path: "/blog"
    }
  ]
  console.log(productListInStock, productListRating)
  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ lg: 5, md: 12, sm: 12 }}>
        {cardToCreateItem?.map((item, index) => (
          <CardToCreateItem cardToCreateItem={item} key={index} />
        ))}
      </Grid2>
      <Grid2 size={{ lg: 7, md: 12, sm: 12 }}>
        {/* Product list goes here */}
        <TopViewsProduct productListView={productListView} />
      </Grid2>
    </Grid2>
  )
}

export default memo(ProductTable)