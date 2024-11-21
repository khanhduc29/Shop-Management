import { memo, useCallback, useEffect, useState } from "react"
import { instance } from "../../../../api/api"
import UserTable from "./components/UserTable"
import { useAppDispatch, useAppSelector } from "../../../../store/store"
import { getListUser } from "../../redux/home.slice"

const UserManagement = () => {

  const dispatch = useAppDispatch()
  const pageD = useAppSelector(state => state.home.userPage.page)

  const userList = useAppSelector(state => state.home.userPage.users)
  const [page, setPage] = useState(pageD);

  const [pageSize, setPageSize] = useState(7);
  const totalUsers = useAppSelector((state) => state.home.userPage.totalUsers)

  const getUserDatas = useCallback(async () => {
    try {
      if (page !== pageD || userList.length === 0) {
        const { data } = await instance.get('user', {
          params: {
            limit: pageSize,
            page,
          }
        });
        // console.log(data)
        dispatch(getListUser({ users: data.products, totalUsers: data.counts, page }))
      }
    } catch (err) {
      console.log(err);
    }
  }, [page, pageSize, pageD, dispatch, userList.length]);

  useEffect(() => {
    getUserDatas();
  }, [getUserDatas]);

  const handleUpdateStatus = useCallback(async (key: string, status: string) => {
    try {
      console.log(key, status)
      const statusValue = (status === 'active') ? true : false
      const response = await instance.put(`user/delete/${key}`, { isBlocked: statusValue });
      if (response.status === 200) {
        getUserDatas()
      }

    } catch (err) {
      console.log(err);
    }
  }, [userList]);

  return (
    <UserTable
      userList={userList}
      totalUsers={totalUsers}
      page={page}
      pageSize={pageSize}
      onPageChange={(page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
      }}
      handleUpdateStatus={handleUpdateStatus}
    />
  )
}

export default memo(UserManagement)