import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { memo, useMemo } from 'react';
import { CardActions, Divider } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { Popconfirm } from 'antd';
import { ProductType } from '../../../types/product.types';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';


const ProductList = ({ product, handleDeleteProduct }: { product: ProductType, handleDeleteProduct: (id: string) => void }) => {
  const formatPrice = useMemo(() => {
    return (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }, [product.price]);

  const { t } = useTranslation('product');

  return (
    <Card sx={{ display: 'flex', width: 'auto', flexDirection: 'column', backgroundColor: '#fff', border: 'none', boxShadow: '2px 2px 2px 2px #c2c9d666' }}>
      <Box sx={{ display: 'flex', justifyContent: 'start', gap: '20px', alignItems: 'center' }}>
        <CardMedia
          component="img"
          sx={{
            width: 80, height: 80, objectFit: 'cover',
          }}
          image={product.thumb}
          alt="Live from space album cover"
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h5" sx={{ fontSize: '13px' }}>
              {product.title}
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ color: 'text.secondary', fontSize: '13px' }}
            >
              {formatPrice(product.price)}
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ color: 'text.secondary', fontSize: '13px' }}
            >
              {product.category} - {product.brand}
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ color: 'text.secondary', fontSize: '13px' }}
            >
              {t('quantity')}: {product.quantity} - {t('sold')}: {product.sold}
            </Typography>
          </CardContent>

        </Box>
      </Box>
      <Divider style={{ margin: '0' }} />
      <CardActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
        <NavLink to={product?.slug ?? product._id ?? '#'}>
          <Box sx={{ textAlign: 'center', cursor: 'pointer' }}>
            <EditOutlined style={{ fontSize: '13px', color: '#00bfff' }} />
          </Box>
        </NavLink>
        <Box sx={{ textAlign: 'center', cursor: 'pointer' }}>
          <Popconfirm
            placement="topRight"
            title={t('acceptDelete')}
            description={t('delete')}
            okText={t('okText')}
            cancelText={t('cancelText')}
            onConfirm={() => product._id && handleDeleteProduct(product._id)}
          >
            <DeleteOutlined style={{ fontSize: '13px', color: 'red' }} />
          </Popconfirm>
        </Box>
      </CardActions>
    </Card>
  );
}

export default memo(ProductList)
