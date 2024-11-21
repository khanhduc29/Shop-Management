import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { instance } from "../../../../api/api"
import { OrderType } from "../../types/order.typs"
import { UserList } from "../../../auth/types/auth.types"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { CalendarOutlined, MailOutlined, PhoneOutlined, ShopOutlined } from "@ant-design/icons"
import { ArrowRightIcon } from "@mui/x-date-pickers"
import { useTranslation } from "react-i18next"

dayjs.extend(utc)
dayjs.extend(timezone)

const getStatusColor = (status: string | undefined) => {
  switch (status) {
    case 'Processing':
      return 'warning';
    case 'Succeeded':
      return 'success';
    case 'Cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const EditOrder = () => {

  const { t } = useTranslation('order')

  const [order, setOrder] = useState<OrderType | null>(null)
  const [user, setUser] = useState<UserList | null>(null)
  const [totalOrder, setTotalOrder] = useState<number>(0)
  const { oid } = useParams<string>()

  const navigate = useNavigate()

  const orderDetails = useCallback(async () => {
    try {
      const response = await instance.get(`/order/${oid}`)
      if (response.status === 200) {
        setOrder(response.data.order)
        setUser(response.data.user)
        setTotalOrder(response.data.totalOrders)
      }
    } catch (error) {
      console.error(error)
    }
  }, [oid])

  useEffect(() => {
    orderDetails()
  }, [oid])

  const formatDateToVietnamTime = (date: string | undefined) => {
    return date ? dayjs(date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY - HH:mm:ss') : '';
  }
  const formatPrice = useMemo(() => {
    return (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }, []);



  console.log(order, user, totalOrder)

  return (
    <Stack width={'100%'}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
        <Typography variant="h5">{t('order')} #{order?._id}</Typography>
        <Chip label={order?.status} color={getStatusColor(order?.status)} />
        <Typography variant="body2"><CalendarOutlined />  {formatDateToVietnamTime(order?.createdAt)}</Typography>
      </Box>
      <Divider sx={{ margin: '40px 0' }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
        <Box flex={2} sx={{ boxShadow: '2px 2px 2px 2px #c2c9d666', borderRadius: '10px', padding: '20px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
            <Typography variant="h6" sx={{ fontSize: '16px' }}>{t('orderDetail')} &nbsp; <Chip label={order?.products?.length} /></Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              {order?.status === 'Processing' && <>
                <Button sx={{ padding: '0 10px', color: '#fff', backgroundColor: '#00bfff', '&:hover': { backgroundColor: '#0080ff', '&:hover': { backgroundColor: '#0080ff' } } }} >Complete</Button>
                <Button sx={{ padding: '0 10px', color: '#fff', backgroundColor: '#ff0040', '&:hover': { backgroundColor: '#ff0000' } }}>Cancel</Button>
              </>}
            </Box>
          </Box>
          <Divider sx={{ margin: '10px 0' }} />
          {order?.products?.map((product, index) => (
            <Box key={index}>
              <Box display={'flex'} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box flex={2} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '10px' }}>
                  <img src={product.product.thumb} alt="product-image" height={80} style={{ objectFit: 'cover' }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontSize: '14px', fontWeight: '600' }}>{product.product.title}</Typography>
                    <Typography variant="subtitle2" sx={{ fontSize: '14px', fontWeight: '400' }}>{product.color}</Typography>
                  </Box>
                </Box>
                <Typography flex={1} variant="subtitle2" sx={{ textAlign: 'right', fontSize: '14px', fontWeight: '500' }}>{formatPrice(product.product?.price)}</Typography>
                <Typography flex={1} variant="subtitle2" sx={{ textAlign: 'right', fontSize: '14px', fontWeight: '500' }}>{product.count}</Typography>
                <Typography flex={1} variant="body1" sx={{ textAlign: 'right', fontSize: '14px', fontWeight: '500' }}>
                  {formatPrice(product.count * product.product?.price)}
                </Typography>
              </Box>
              <Divider sx={{ margin: '10px 0' }} />
            </Box>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '50px', marginTop: '20px' }}>
            <Stack sx={{ display: 'flex', alignItems: 'flex-end', gap: '30px' }}>
              <Typography variant="subtitle1" sx={{ fontSize: '14px', fontWeight: '400' }}>{t('subtotal')}: </Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '14px', fontWeight: '400' }}>{t('shippingFee')}: </Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '14px', fontWeight: '400' }}>{t('discount')}: </Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '14px', fontWeight: '400' }}>{t('total')}: </Typography>
            </Stack>
            <Stack sx={{ display: 'flex', alignItems: 'flex-end', gap: '30px' }}>
              <Typography variant="subtitle1" sx={{ fontSize: '14px', fontWeight: '600' }}>{formatPrice(Number(order?.total))} </Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '14px', fontWeight: '600' }}>{formatPrice(Number('0'))} </Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '14px', fontWeight: '600' }}>{formatPrice(Number('0'))} </Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '14px', fontWeight: '600' }}>{formatPrice(Number(order?.total))} </Typography>
            </Stack>

          </Box>
        </Box>

        <Box flex={1} sx={{ boxShadow: '2px 2px 2px 2px #c2c9d666', borderRadius: '10px', padding: '20px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
            <Typography variant="h6" sx={{ fontSize: '16px' }}>{t('customer')} &nbsp; </Typography>
          </Box>
          <Divider sx={{ margin: '10px 0' }} />

          <Box
            sx={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', cursor: 'pointer'
            }}
            onClick={() => navigate(`/user/${user?._id}`)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
              <img src={user?.avatar} alt='user-avatar' height={50} width={50} style={{ objectFit: 'cover', borderRadius: '50%' }} />
              <Typography variant="subtitle1" sx={{ fontSize: '14px', fontWeight: '400' }}>{user?.firstname} {user?.lastname} </Typography>
            </Box>
            <ArrowRightIcon />
          </Box>
          <Divider sx={{ margin: '10px 0' }} />
          <Box
            sx={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', cursor: 'pointer'
            }}
            onClick={() => navigate(`/user/${user?._id}`)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
              <Box sx={{ color: '#09a5be', height: '50px', width: '50px', padding: '5px', borderRadius: '50%', backgroundColor: 'rgba(9, 165, 190, .1)', fontSize: '20px', textAlign: 'center', lineHeight: '40px' }}>
                <ShopOutlined />
              </Box>
              <Typography variant="subtitle1" sx={{ fontSize: '14px', fontWeight: '400' }}>{totalOrder} {t('orders')}</Typography>
            </Box>
            <ArrowRightIcon />
          </Box>
          <Divider sx={{ margin: '10px 0' }} />
          <Box
            sx={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '20px', flexDirection: 'column', gap: '10px'
            }}
          >
            <Typography variant="subtitle1" sx={{ fontSize: '14px', fontWeight: '600' }}>{t('contactInfo')}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '30px', marginLeft: '20px' }}>
              <MailOutlined />
              <Typography variant="subtitle1" sx={{ fontSize: '13px', fontWeight: '400' }}>{user?.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '30px', marginLeft: '20px' }}>
              <PhoneOutlined />
              <Typography variant="subtitle1" sx={{ fontSize: '13px', fontWeight: '400' }}>{user?.mobile}</Typography>
            </Box>

          </Box>
          <Divider sx={{ margin: '10px 0' }} />

          <Box
            sx={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '20px', flexDirection: 'column', gap: '10px'
            }}
          >
            <Typography variant="subtitle1" sx={{ fontSize: '14px', fontWeight: '600' }}>{t('shippingAddress')}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '30px', marginLeft: '20px' }}>
              <Typography variant="subtitle1" sx={{ fontSize: '13px', fontWeight: '400' }}>{user?.address}</Typography>
            </Box>
          </Box>
          <Divider sx={{ margin: '10px 0' }} />
          <Box
            sx={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '20px', flexDirection: 'column', gap: '10px'
            }}
          >
            <Typography variant="subtitle1" sx={{ fontSize: '14px', fontWeight: '600' }}>{t('paymentInfo')}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '30px', marginLeft: '20px' }}>
              <Typography variant="subtitle1" sx={{ fontSize: '13px', fontWeight: '400' }}>{t('cod')}</Typography>
            </Box>
          </Box>
          <Divider sx={{ margin: '10px 0' }} />
        </Box>


      </Box>
    </Stack >
  )
}

export default EditOrder