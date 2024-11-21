import { Box, Chip, Drawer, Grid2, IconButton, InputBase, Paper } from "@mui/material"
import React, { memo, useCallback } from "react"
import ProductList from "./components/ProductList"
import { instance } from "../../../../api/api";
import { Button, Pagination } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { deleteProduct, getProductList, removeFilter } from "../../redux/home.slice";
import FilterList from "./components/FilterList";
import { useTranslation } from "react-i18next";
import { GridSearchIcon } from "@mui/x-data-grid";
import debounce from "lodash.debounce";

const ProductManagement = () => {

  const { t } = useTranslation('product');

  const dispatch = useAppDispatch()
  const products = useAppSelector((state) => state.home.productPage.products)

  const pageD = useAppSelector(state => state.home.productPage.page)
  const sort = useAppSelector(state => state.home.productPage.sort)
  const title1 = useAppSelector(state => state.home.productPage.title)
  const priceLt = useAppSelector(state => state.home.productPage['price[lt]'])
  const priceGte = useAppSelector(state => state.home.productPage['price[gte]'])
  const color = useAppSelector(state => state.home.productPage.color)
  const categoryB = useAppSelector(state => state.home.productPage.category)

  const [page, setPage] = React.useState(pageD);
  const [value1, setValue1] = React.useState<number[]>([Number(priceGte), Number(priceLt)]);
  const [sortBy, setSortBy] = React.useState<string[]>(sort || []);
  const [category, setCategory] = React.useState(categoryB || '');
  const [colorName, setColorName] = React.useState<string[]>(color || []);
  // const [title, setTitle] = React.useState(title1 || '');
  const [searchTerm, setSearchTerm] = React.useState(title1 || '');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState(title1 || '');

  // const [rowsPerPage, setRowsPerPage] = React.useState(9);
  const rowsPerPage = 12;
  const totalProducts = useAppSelector((state) => state.home.productPage.totalProducts)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debounceSearch(e.target.value);
  };

  const debounceSearch = useCallback(
    debounce((term) => {
      setDebouncedSearchTerm(term);
    }, 1000), // adjust delay as needed
    []
  );

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await instance.get(`product`, {
        params: {
          limit: rowsPerPage,
          page,
          sort: sortBy.join(','),
          "price[lt]": value1[1],
          "price[gte]": value1[0],
          color: colorName?.map(el => el.toLowerCase()).join(',') || null,
          category: category || null,
          title: debouncedSearchTerm || null
        }
      });
      dispatch(getProductList({ products: data.products, totalProducts: data.counts, page, sort: sortBy, title: debouncedSearchTerm, "price[lt]": value1[1], "price[gte]": value1[0], color: colorName, category: category }))
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [page, rowsPerPage, pageD, dispatch, products.length, sort, title1, priceLt, priceGte, color, categoryB, debouncedSearchTerm, category, colorName, sortBy, value1]);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts, sort, title1, priceLt, priceGte, color, categoryB]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const navigate = useNavigate();
  const handleNavigateToAdd = () => {
    navigate('/product/add');
  }

  const handleDeleteProduct = useCallback(async (id: string) => {
    const response = await instance.delete(`/product/${id}`)
    if (response.status === 200) {
      dispatch(deleteProduct(response.data.deletedProduct._id));
    }
  }, [])

  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setIsOpen(open);
  };

  const handleRemoveFilter = (filterType: string) => {
    dispatch(removeFilter({ filterType }));}

  return (
    <Box sx={{ width: '100%', }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', margin: '30px 0 0 0' }}>
        <Button type="primary" style={{ backgroundColor: '#c2c9d666', color: 'black' }} icon={<PlusOutlined />} onClick={handleNavigateToAdd} > {t('addNew')}</Button>
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search product"
            inputProps={{ 'aria-label': 'search product' }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <GridSearchIcon />
          </IconButton>
        </Paper>
        <Box>
          <Button onClick={toggleDrawer(true)} style={{ backgroundColor: 'transparent', color: 'black' }} icon={<FilterAltOutlinedIcon />}>{t('filter')}</Button>
          <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
            <FilterList
              toggleDrawer={toggleDrawer}
              value1={value1}
              setValue1={setValue1}
              sortBy={sortBy}
              setSortBy={setSortBy}
              category={category}
              setCategory={setCategory}
              colorName={colorName}
              setColorName={setColorName}
            />
          </Drawer>
        </Box>

      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '20px' }}>
        {sortBy.length > 0 && sortBy.map((sortValue) => (
          <Chip
            key={sortValue}
            label={`Sort: ${sortValue}`}
            onDelete={() => setSortBy([])}
            variant="outlined"
            sx={{ fontSize: '12px', padding: '4px' }}
          />
        ))}
        {category && (
          <Chip
            label={`Category: ${category}`}
            onDelete={() => setCategory('')}
            variant="outlined"
            sx={{ fontSize: '12px', padding: '4px' }}
          />
        )}
        {colorName.length > 0 && colorName.map((colorValue) => (
          <Chip
            key={colorValue}
            label={`Color: ${colorValue}`}
            onDelete={() => setColorName([])}
            variant="outlined"
            sx={{ fontSize: '12px', padding: '4px' }}
          />
        ))}
        {(priceGte !== 0 || priceLt !== 30000000) && (
          <Chip
            label={`Price: ${priceGte} - ${priceLt}`}
            onDelete={() => handleRemoveFilter('price')}
            variant="outlined"
            sx={{ fontSize: '12px', padding: '4px' }}
          />
        )}
        {debouncedSearchTerm && (
          <Chip
            label={`Search: ${debouncedSearchTerm}`}
            onDelete={() => {
              setDebouncedSearchTerm('')
              setSearchTerm('')
            }}
            variant="outlined"
            sx={{ fontSize: '12px', padding: '4px' }}
          />
        )}
      </Box>

      <Grid2 container spacing={1}>
        {products?.length > 0 ? (
          products.map((product) =>
            <Grid2 key={product._id} size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
              <ProductList product={product} handleDeleteProduct={handleDeleteProduct} />
            </Grid2>)
        ) : <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>{t('noProd')}</Box>
        }
      </Grid2>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <Pagination
          current={page}
          total={totalProducts}
          pageSize={rowsPerPage}
          showSizeChanger={false}
          onChange={handlePageChange} />
      </Box>
    </Box>
  )
}

export default memo(ProductManagement)