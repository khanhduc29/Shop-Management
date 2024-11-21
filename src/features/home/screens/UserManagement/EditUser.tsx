import React from "react"
import { useParams } from "react-router-dom"
import { UserCurrent } from "../../types/user.types"
import { instance } from "../../../../api/api"
import DetailUser from "./components/DetailUser"
import { Box } from "@mui/material"

const EditUser = () => {
  const { uid } = useParams()
  const [currentUser, setCurrentUser] = React.useState<UserCurrent | null>(null)
  const [orders, setOrders] = React.useState<any[]>([])

  const getCurrentUser = React.useCallback(async () => {
    try {
      if (uid === 'add') {
        setCurrentUser({
          firstname: '',
          lastname: '',
          email: '',
          mobile: '',
          address: '',
          role: 'user',
          isBlocked: false,
          avatar: '',
        })
        return
      } else {
        const response = await instance.get(`/user/${uid}`)
        setCurrentUser(response.data.rs)
      }
    } catch (error) {
      console.log(error)
    }
  }, [uid])

  const getOrders = React.useCallback(async () => {
    try {
      const response = await instance.get(`/order/by-uid`, { params: { uid: uid } })
      setOrders(response.data.response)
    } catch (error) {
      console.log(error)
    }
  }, [uid])

  React.useEffect(() => {
    getCurrentUser()
    getOrders()
  }, [uid])

  return (
    <Box sx={{ width: '100%' }}>
      <DetailUser currentUser={currentUser} orders={orders} setCurrentUser={setCurrentUser} />

    </Box>
  )
}

export default EditUser