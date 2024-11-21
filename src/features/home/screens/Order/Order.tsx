import { Box } from "@mui/material"
import OrderTable from "./components/OrderTable"
import { useCallback, useEffect, useState } from "react"
import { instance } from "../../../../api/api"
import { useAppDispatch, useAppSelector } from "../../../../store/store"
import { getListOrder } from "../../redux/home.slice"

const Order = () => {
  const dispatch = useAppDispatch()
  const pageD = useAppSelector(state => state.home.orderPage.page)

  const orderList = useAppSelector(state => state.home.orderPage.orders)
  const [page, setPage] = useState(pageD);

  const [pageSize, setPageSize] = useState(10);
  const totalOrders = useAppSelector((state) => state.home.orderPage.totalOrders)


  const [searchTerm, setSearchTerm] = useState('');

  const getOrderList = useCallback(async () => {
    try {
      if (page !== pageD || orderList.length === 0) {
        const { data } = await instance.get('order/admin', {
          params: {
            limit: pageSize,
            page,
          }
        });
        dispatch(getListOrder({ orders: data.orders, totalOrders: data.counts, page }))
      }

    } catch (err) {
      console.log(err);
    }
  }, [page, pageSize, searchTerm, pageD, dispatch, orderList.length]);

  useEffect(() => {
    getOrderList();
  }, [getOrderList]);

  console.log(orderList)

  // const handleUpdateStatus = useCallback(async (key: string) => {
  //   try {
  //     const response = await instance.put(`user/delete/${key}`);
  //     if (response.status === 200) {
  //       getOrderList()
  //     }

  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, [orderList]);

  return (
    <Box sx={{ width: '100%' }}>
      <OrderTable
        orderList={orderList}
        totalOrders={totalOrders}
        page={page}
        pageSize={pageSize}
        onPageChange={(page, pageSize) => {
          setPage(page);
          setPageSize(pageSize);
        }}
        onSearch={(searchTerm) => {
          setSearchTerm(searchTerm);
          setPage(1);
        }}
      />
    </Box>
  )
}

export default Order