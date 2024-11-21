import { Stack } from "@mui/material"

import Brand from "./Brand";
import Category from "./Category";

const BrandAndCategory = () => {

  return (
    <Stack gap={3} direction={'row'} width={'100%'} justifyContent={'space-between'} flexWrap={'wrap'}>
      <Brand />
      <Category />
    </Stack>
  )
}

export default BrandAndCategory