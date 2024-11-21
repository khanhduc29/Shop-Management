import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Divider, MenuItem, Select, SnackbarCloseReason, Stack, TextField, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import type { UploadFile } from 'antd';
import { useFormik } from 'formik';
import { ProductType } from '../../../types/product.types';
import { instance } from '../../../../../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../../../../store/store';
import SnackbarAlert from '../../../../../components/ToastMessage/SnackbarAlert';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['clean']
  ]
};

interface PreviewFile extends UploadFile {
  url?: string;
  thumbUrl?: string;
}

const EditProduct = ({ productData }: { productData: ProductType }) => {

  // Snackbar
  const [openSnackbar, setOpenSnackbar] = React.useState<{
    open: boolean;
    severity: "success" | "error" | "warning" | "info";
    message: string;
  }>({
    open: false,
    severity: 'success',
    message: '',
  });
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    event?.preventDefault();
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar({
      ...openSnackbar,
      open: false,
    });
  };
  // Description
  const [valueDes, setValueDes] = useState('');

  const { slug } = useParams<{ slug: string }>();

  // Image
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [thumb, setThumb] = useState<UploadFile[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  const handlePreview = async (file: PreviewFile) => {
    setPreviewImage(file.url || file.thumbUrl || '');
    setPreviewOpen(true);
  };

  const handleChangeImages = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    const removedFiles = fileList.filter((file) => !newFileList.some((newFile) => newFile.uid === file.uid));
    setRemovedImages((prev) => [
      ...prev,
      ...removedFiles.map((file) => file.url!).filter((url) => url)
    ]);
    setFileList(newFileList);
  };

  const handleChangeThumb = ({ fileList }: { fileList: UploadFile[] }) => {
    setThumb(fileList);
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  // image upload

  const navigate = useNavigate()
  const handleSubmitProduct = useCallback(async (values: ProductType, pid: string) => {
    const formData = new FormData();

    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        formData.append(key, String(values[key as keyof typeof values]));
      }
    }

    if (removedImages.length > 0) {
      formData.append('imagesToRemove', JSON.stringify(removedImages));
    }

    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append('images', file.originFileObj);
      }
    });

    if (thumb[0]?.originFileObj) {
      formData.append('thumb', thumb[0].originFileObj);
    }

    formData.append('description', valueDes);

    console.log(Object.fromEntries(formData.entries()));
    if (slug === 'add') {
      formData.delete('sold');
      try {
        const response = await instance.post('/product', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (response.status === 200)
          navigate('/product', { replace: true });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await instance.put(`product/${pid}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (response.status === 200) {
          setOpenSnackbar({
            open: true,
            severity: 'success',
            message: 'Product updated successfully',
          });
          // navigate('/product', { replace: true });
        }

      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          setOpenSnackbar({
            open: true,
            severity: 'error',
            message: error.response.data.mes,
          });
        } else {
          setOpenSnackbar({
            open: true,
            severity: 'error',
            message: 'Login failed',
          });
        }
      }
    }

  }, [productData, thumb, fileList, valueDes]);


  const formik = useFormik({
    initialValues: {
      title: '',
      quantity: 0,
      sold: 0,
      color: '',
      view: 0,
      price: 0,
      category: '',
      brand: '',
    },
    onSubmit: (values) => {
      if (slug === 'add') {
        handleSubmitProduct(values, '');
      } else {
        if (productData?._id) {
          handleSubmitProduct(values, productData._id);
        } else {
          console.error('Product ID is undefined');
        }
      }
    },
  })

  useEffect(() => {
    if (productData) {
      formik.setValues({
        title: productData?.title,
        quantity: productData?.quantity,
        sold: productData?.sold,
        color: productData?.color,
        view: productData?.view ?? 0,
        price: productData?.price,
        category: productData?.category,
        brand: productData?.brand,
      })
      setValueDes(productData?.description?.map((item) => `<p>${item}<p/>`).join('') ?? '')
      setFileList(productData?.images?.map((item, index) => ({ uid: index.toString(), name: `image-${index}`, url: item })) ?? [])
      setThumb(productData?.thumb ? [{ uid: '1', name: 'thumb', url: productData.thumb }] : []);
      // setPid(productData?._id ?? '');
    }
  }, [productData])

  const brandData = useAppSelector((state) => state.home.brand).map((item) => item.title);
  const categoryData = useAppSelector((state) => state.home.categories).map((item) => item.title);

  console.log(valueDes)

  const { t } = useTranslation('product');

  return (
    <Stack sx={{ width: '100%' }}>
      <SnackbarAlert
        open={openSnackbar.open}
        onClose={handleCloseSnackbar}
        message={openSnackbar.message}
        severity={openSnackbar.severity}
      />
      <Typography variant="h6" sx={{ textAlign: 'left' }}>{t('prodDetails')}</Typography>
      <Divider sx={{ height: '1px', width: '100%', margin: '10px 0' }} />
      <Box component={'form'} onSubmit={formik.handleSubmit} sx={{ display: 'flex', gap: '30px' }}>
        <Box sx={{ flex: 2 }}>
          <Box sx={{ padding: '20px', boxShadow: '2px 2px 2px 2px #c2c9d666', borderRadius: '5px', height: 'auto', marginBottom: '20px' }}>
            <Typography variant="h6" sx={{ textAlign: 'left' }}>{t('prodInfo')}</Typography>
            <Divider sx={{ height: '1px', width: '100%', margin: '10px 0' }} />
            <Stack spacing={1}>
              <Typography>{t('title')}</Typography>
              <TextField
                fullWidth
                id='title'
                name='title'
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Stack>

            <Box sx={{
              display: 'flex', justifyContent: 'space-between', gap: '10px', width: '100%', margin: '20px 0'
            }}>
              <Stack spacing={1} flex={1}>
                <Typography>{t('quantity')}</Typography>
                <TextField
                  fullWidth
                  id='quantity'
                  name='quantity'
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Stack>
              <Stack spacing={1} flex={1}>
                <Typography>{t('sold')}</Typography>
                <TextField
                  fullWidth
                  id='sold'
                  name='sold'
                  value={formik.values.sold}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={slug === 'add' ? true : false}
                />
              </Stack>
            </Box>

            <Box sx={{
              display: 'flex', justifyContent: 'space-between', gap: '10px', width: '100%', margin: '20px 0'
            }}>
              <Stack spacing={1} flex={1}>
                <Typography>{t('color')}</Typography>
                <TextField
                  fullWidth
                  id='color'
                  name='color'
                  value={formik.values.color}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Stack>
              <Stack spacing={1} flex={1}>
                <Typography>{t('views')}</Typography>
                <TextField
                  fullWidth
                  id='view'
                  name='view'
                  value={formik.values.view}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={slug === 'add' ? true : false}
                />
              </Stack>
            </Box>

            <Stack spacing={1} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
              <Typography>{t('description')}</Typography>
              <ReactQuill
                theme="snow"
                value={valueDes}
                onChange={setValueDes}
                modules={modules}
              />
            </Stack>
          </Box>

          <Box sx={{ padding: '20px', boxShadow: '2px 2px 2px 2px #c2c9d666', borderRadius: '5px', height: 'auto', }}>
            <Typography variant="h6" sx={{ textAlign: 'left' }}>{t('productMedia')}</Typography>
            <Divider sx={{ height: '1px', width: '100%', margin: '10px 0' }} />
            <Box sx={{
              display: 'flex', justifyContent: 'space-between', gap: '10px', width: '100%', margin: '20px 0'
            }}>
              <Stack spacing={1} flex={1}>
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChangeImages}
                  beforeUpload={() => false}
                >
                  {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                  />
                )}
              </Stack>

            </Box>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Stack spacing={1} flex={1} sx={{ padding: '20px', boxShadow: '2px 2px 2px 2px #c2c9d666', borderRadius: '5px', height: 'auto' }}>
            <Typography variant='h6' sx={{ fontWeight: '500' }}>{t('thumbnail')}</Typography>
            <Divider sx={{ height: '1px', width: '100%', margin: '10px 0' }} />
            <Upload
              listType="picture-card"
              fileList={thumb}
              onPreview={handlePreview}
              onChange={handleChangeThumb}
              beforeUpload={() => false}
            >
              {thumb.length >= 1 ? null : uploadButton}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{ display: 'none' }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(''),
                }}
                src={previewImage}
              />
            )}
          </Stack>

          <Stack spacing={1} sx={{ padding: '20px', boxShadow: '2px 2px 2px 2px #c2c9d666', borderRadius: '5px', height: 'auto', marginTop: '30px' }}>
            <Typography variant='h6' sx={{ fontWeight: '500' }}>{t('price')}</Typography>
            <Divider sx={{ height: '1px', width: '100%', margin: '10px 0' }} />
            <Typography>{t('price')}</Typography>
            <TextField
              fullWidth
              id='price'
              name='price'
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Stack>

          <Box sx={{ padding: '20px', boxShadow: '2px 2px 2px 2px #c2c9d666', borderRadius: '5px', height: 'auto', marginTop: '30px' }}>
            <Typography variant='h6' sx={{ fontWeight: '600' }}>{t('organization')}</Typography>
            <Divider sx={{ height: '1px', width: '100%', margin: '10px 0' }} />
            <Stack spacing={1}>
              <Typography>{t('category')}</Typography>
              <Select
                fullWidth
                id='category'
                name='category'
                value={formik.values.category || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {categoryData?.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack spacing={1} sx={{ marginTop: '20px' }}>
              <Typography>{t('brand')}</Typography>
              <Select
                fullWidth
                id='brand'
                name='brand'
                value={formik.values.brand || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {(brandData ?? [])?.map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'end', margin: '20px 0', width: '100%', position: 'fixed', bottom: '10px', right: '20px' }}>
          <Button variant="contained" color="secondary" type="submit" startIcon={<SaveIcon />}>
            {t('save')}
          </Button>
          <Button variant="contained" color="primary" startIcon={<CancelIcon />} sx={{ marginLeft: '20px' }} onClick={() => navigate('/product')}>
            {t('cancel')}
          </Button>
        </Box>
      </Box>

    </Stack>
  );
};

export default EditProduct;
