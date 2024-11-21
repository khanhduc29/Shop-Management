import { Box, Button, Chip, Divider, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Slider, Theme, Typography, useTheme } from "@mui/material";
import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../store/store";
import { getFilter } from "../../../redux/home.slice";
import { CloseOutlined } from "@ant-design/icons";

const formatMoney = (amount: number): string => {
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const colors = [
  'Red',
  'Green',
  'Blue',
  'Pink',
  'Yellow',
  'Crimson',
  'Maroon',
  'Orange',
  'Black'
];

function getStyles(name: string, colorName: readonly string[], theme: Theme) {
  return {
    fontWeight: colorName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
    color: colorName.includes(name)
      ? theme.palette.primary.main
      : theme.palette.text.primary,
  };
}

const minDistance = 100000;

interface DrawerContentProps {
  toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
  value1: number[];
  setValue1: (value: number[]) => void;
  sortBy: string[];
  setSortBy: (value: string[]) => void;
  category: string;
  setCategory: (value: string) => void;
  colorName: string[];
  setColorName: (value: string[]) => void;

}
const FilterList: React.FC<DrawerContentProps> = ({ toggleDrawer, value1, setValue1, sortBy, setSortBy, category, setCategory, colorName, setColorName }) => {

  // console.log('price', value1)
  // console.log('sortBy', sortBy)
  // console.log('category', category)
  // console.log('color', colorName)

  const handleChange1 = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    event.preventDefault();
    if (!Array.isArray(newValue)) {
      return;
    }
    if (activeThumb === 0) {
      setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
    } else {
      setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
    }
  };

  const handleChangeSortBy = (event: SelectChangeEvent<typeof sortBy>) => {
    const {
      target: { value },
    } = event;
    setSortBy(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleChangeCategory = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  const prodCategories = useAppSelector(state => state.home?.categories)?.map(category => category?.title);

  const theme = useTheme();

  const handleChangeColor = (event: SelectChangeEvent<typeof colorName>) => {
    const {
      target: { value },
    } = event;
    setColorName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const dispatch = useAppDispatch()
  const handleSubmit = useCallback(async () => {
    await dispatch(getFilter({ sort: sortBy, category, color: colorName, "price[lt]": value1[1], "price[gte]": value1[0], page: 1 }))
  }, [dispatch, sortBy, category, colorName, value1])

  return (
    <Box sx={{ width: 400, display: 'flex', flexDirection: 'column', marginTop: '50px' }} role="presentation">
      <Box sx={{ marginLeft: '20px' }}>
        <Typography variant='h4' sx={{ textAlign: 'left' }}>Product Filter</Typography>
        <Button sx={{ position: 'absolute', right: '20px', top: '30px' }} onClick={toggleDrawer(false)}><CloseOutlined /></Button>
      </Box>
      <Divider sx={{ margin: '30px 20px' }} />

      <Box sx={{ width: 360, margin: '0 20px 20px 20px', border: '1px solid #c2c9d666', padding: '10px', borderRadius: '5px' }}>
        <Typography id="range-slider" gutterBottom sx={{ fontWeight: '600' }}>Sort By</Typography>
        <Divider sx={{ margin: '10px 0' }} />
        <FormControl sx={{ width: '100%' }}>
          <InputLabel id="demo-multiple-chip-label">Sort By</InputLabel>
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={sortBy}
            onChange={handleChangeSortBy}
            input={<OutlinedInput id="select-multiple-chip" label="Sort By" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            <MenuItem value="">
              <em>Không áp dụng</em>
            </MenuItem>
            <MenuItem value='-price'>Giá giảm dần</MenuItem>
            <MenuItem value='-brand'>Theo nhãn hàng</MenuItem>
            <MenuItem value={30}></MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body2" sx={{ fontSize: '14px', marginTop: '20px', textAlign: 'right' }}>Reset</Typography>
      </Box>

      {/* Sort by price */}
      <Box sx={{ width: 360, margin: '0 20px', border: '1px solid #c2c9d666', padding: '10px', borderRadius: '5px' }}>
        <Typography id="range-slider" gutterBottom sx={{ fontWeight: '600' }}>Price Range</Typography>
        <Divider sx={{ margin: '10px 0' }} />
        <Slider
          getAriaLabel={() => 'Minimum distance'}
          value={value1}
          min={0}
          step={500000}
          max={30000000}
          onChange={handleChange1}
          valueLabelDisplay="auto"
          disableSwap
        />
        <Box sx={{}}>
          <Typography gutterBottom>Price: {formatMoney(value1[0])} - {formatMoney(value1[1])}</Typography>
        </Box>
        <Typography variant="body2" sx={{ fontSize: '14px', marginTop: '20px', textAlign: 'right' }}>Reset</Typography>
      </Box>
      {/* Sort by color */}
      <Box sx={{ width: 360, margin: '20px 20px 20px 20px', border: '1px solid #c2c9d666', padding: '10px', borderRadius: '5px' }}>
        <Typography id="range-slider" gutterBottom sx={{ fontWeight: '600' }}>Color</Typography>
        <Divider sx={{ margin: '10px 0' }} />
        <FormControl sx={{ width: '100%' }}>
          <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={colorName}
            onChange={handleChangeColor}
            input={<OutlinedInput id="select-multiple-chip" label="Color" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} sx={{ backgroundColor: value.toLowerCase(), color: '#fff' }} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {colors.map((color) => (
              <MenuItem
                key={color}
                value={color}
                style={getStyles(color, colorName, theme)}
              // sx={{ backgroundColor: color }}
              >
                {color}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2" sx={{ fontSize: '14px', marginTop: '20px', textAlign: 'right' }}>Reset</Typography>
      </Box>
      {/* Sort by category */}
      <Box sx={{ width: 360, margin: '20px 20px 50px 20px', border: '1px solid #c2c9d666', padding: '10px', borderRadius: '5px' }}>
        <Typography id="range-slider" gutterBottom sx={{ fontWeight: '600' }}>Category</Typography>
        <Divider sx={{ margin: '10px 0' }} />
        <FormControl sx={{ width: '100%' }}>
          <Select
            value={category}
            onChange={handleChangeCategory}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value="">
              <em>Không áp dụng</em>
            </MenuItem>
            {prodCategories?.map((category, index) => (
              <MenuItem key={index} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2" sx={{ fontSize: '14px', marginTop: '20px', textAlign: 'right' }}>Reset</Typography>
      </Box>

      <Button variant="outlined" sx={{ width: '360px', margin: '0 20px 50px 20px', backgroundColor: '#c2c9d666' }} onClick={handleSubmit}>Submit</Button>
    </Box>
  )
}

export default FilterList