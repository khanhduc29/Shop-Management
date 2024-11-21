import { EyeOutlined } from "@ant-design/icons"
import { Box, Divider, Typography } from "@mui/material"
import { memo } from "react";
import { useTranslation } from "react-i18next";

const TopViewsProduct = ({ productListView }: any) => {
  const { t } = useTranslation('dashboard')
  const formatToVND = (price: number) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  console.log(productListView)
  return (
    <Box sx={{ padding: '20px', border: '1px solid #c2c9d666', borderRadius: '10px', marginTop: '10px' }}>
      {/* Product list goes here */}
      <Typography variant="h4" sx={{ marginBottom: '10px', fontSize: '18px' }}>{t('topViewsProd')}</Typography>
      {productListView?.data?.map((item: any, index: number) => (
        <Box key={index}>
          <Divider />
          <Box sx={{ padding: '10px', margin: '5px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '60%', gap: '15px' }}>
              <img src={item.thumb} alt="thumb" width={60} style={{ borderRadius: '50%', objectFit: 'contain' }} />
              <Typography variant="h6" sx={{ fontSize: '14px' }}>{item.title}</Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontSize: '14px' }}>{formatToVND(item.price)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <EyeOutlined style={{ fontSize: '14px' }} />
              <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: '500' }}>{item.views}</Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default memo(TopViewsProduct)