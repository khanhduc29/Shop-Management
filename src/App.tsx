import "quill/dist/quill.core.css";

import './App.css'
import Routes from './routes/Routes'
import { useAppDispatch } from "./store/store";
import { useEffect } from "react";
import { getBrand, getCategory } from "./features/home/redux/home.action";
function App() {

  const dispatch = useAppDispatch()
  useEffect(() => {
    const pro = dispatch(getBrand())
    const pro1 = dispatch(getCategory())
    return () => {
      pro.abort()
      pro1.abort()
    }
  }, [dispatch])

  return (
    <>
      <Routes />
    </>
  )
}

export default App
