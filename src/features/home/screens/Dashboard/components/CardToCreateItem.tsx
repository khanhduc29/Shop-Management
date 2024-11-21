import { Box, Typography } from "@mui/material"
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { CardToCreateItemType } from "./ProductTable";
import { memo } from "react";
import { useNavigate } from 'react-router-dom';

const CardToCreateItem = ({ cardToCreateItem }: { cardToCreateItem: CardToCreateItemType }) => {
  const navigate = useNavigate()
  return (
    <Box
      onClick={() => navigate(cardToCreateItem.path)}
      sx={{ flexGrow: 1, margin: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 'auto', padding: '30px 20px', width: '100%', borderRadius: '10px', border: '1px solid #c2c9d666' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '30px' }} >
        {cardToCreateItem.image}
        <Box>
          <Typography sx={{ fontSize: '18px', fontWeight: '600', color: 'text.primary', cursor: 'pointer', '&:hover': { color: 'blue' } }}>{cardToCreateItem.title}</Typography>
          <Typography sx={{ fontSize: '14px', fontWeight: '400', color: 'text.secondary' }}>{cardToCreateItem.description}</Typography>
        </Box>
      </Box>
      <ArrowForwardIosOutlinedIcon />
    </Box>
  )
}

export default memo(CardToCreateItem)