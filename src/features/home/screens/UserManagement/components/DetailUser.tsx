import { Box, Button, Chip, Divider, MenuItem, Modal, SnackbarCloseReason, Stack, TextField, Typography } from "@mui/material"
import SendIcon from '@mui/icons-material/Send';
import { UserCurrent } from "../../../types/user.types";
import { useFormik } from "formik";
import { validationSchema } from "../../../helpers/edit-user.helpers";
import React, { memo, useCallback, useEffect, useState } from "react";
import { instance } from "../../../../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { MailOutlined, PhoneOutlined, PlusOutlined } from "@ant-design/icons";
import { Image, Upload, UploadFile } from "antd";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useAppDispatch } from "../../../../../store/store";
import { updateUserInfo } from "../../../redux/home.slice";
import { useTranslation } from "react-i18next";
import SnackbarAlert from "../../../../../components/ToastMessage/SnackbarAlert";

dayjs.extend(utc)
dayjs.extend(timezone)

const roles = [
  {
    value: 'admin',
    label: 'admin',
  },
  {
    value: 'user',
    label: 'user',
  },
];

const status = [
  {
    value: 'true',
    label: 'Blocked',
  },
  {
    value: 'false',
    label: 'Active',
  },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'white',
  borderRadius: 4,
};


type Props = {
  currentUser: UserCurrent | null
  setCurrentUser?: (value: UserCurrent | null) => void
  orders?: any[]
}

const DetailUser: React.FC<Props> = ({ currentUser, setCurrentUser }) => {

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

  const formatDateToVietnamTime = (date: string | undefined) => {
    return date ? dayjs(date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY - HH:mm:ss') : '';
  }

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // Image
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.thumbUrl || URL.createObjectURL(file.originFileObj as Blob));
    setPreviewOpen(true);
  };

  const handleChangeImages = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
    setPreviewImage(fileList.length ? URL.createObjectURL(fileList[0].originFileObj as Blob) : '');
  };


  const navigate = useNavigate()
  const { uid } = useParams()
  const dispatch = useAppDispatch()

  const handleUpdate = useCallback(async (value: UserCurrent) => {
    const formData = new FormData();
    delete value.avatar;

    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        formData.append(key, String(value[key as keyof UserCurrent]));
      }
    }

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('avatar', fileList[0].originFileObj as Blob);
    }

    if (uid === 'add') {
      value = { ...value, password: 'defaultPassword_0' }
    } else {
      formData.delete('password');
    }

    try {
      const response = uid === 'add'
        ? await instance.post(`/user/createuser`, value)
        : await instance.put(`/user/${uid}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      if (uid === 'add') {
        if (response.status === 200 || response.data.success) {
          setOpenSnackbar({
            open: true,
            severity: 'success',
            message: 'Thêm người dùng thành công!',
          });
          setTimeout(() => {
            navigate('/user', { replace: true });
          }, 2000);
        } else {
          setOpenSnackbar({
            open: true,
            severity: 'error',
            message: 'Thêm người dùng thất bại!',
          })
        }
      }
      else {
        if (response.status === 200 || response.data.success) {
          setOpen(false);
          // navigate(`/user/${uid}`, { replace: true });
          setCurrentUser && setCurrentUser(response.data.updatedUser);
          dispatch(updateUserInfo(response.data.updatedUser));
          setOpenSnackbar({
            open: true,
            severity: 'success',
            message: 'Cập nhật người dùng thành công!',
          });
        }
        else {
          setOpenSnackbar({
            open: true,
            severity: 'error',
            message: 'Cập nhật người dùng thất bại!',
          })
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [uid, fileList, navigate]);


  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      mobile: '',
      address: '',
      role: '',
      isBlocked: '',
      avatar: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleUpdate({
        ...values,
        isBlocked: values.isBlocked === 'true'
      })
    },
  });

  useEffect(() => {
    if (currentUser) {
      formik.setValues({
        firstname: currentUser.firstname || '',
        lastname: currentUser.lastname || '',
        email: currentUser.email || '',
        mobile: currentUser.mobile || '',
        address: currentUser.address || '',
        role: currentUser.role || '',
        isBlocked: currentUser.isBlocked?.toString() || 'false',
        avatar: currentUser.avatar || '',
      });
      if (currentUser.avatar) {
        setFileList([{
          uid: '-1',
          name: 'Avatar',
          status: 'done',
          url: currentUser.avatar
        }]);
      }
    }
  }, [currentUser]);

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const { t } = useTranslation('user')

  return (
    <>
      {
        (uid === 'add') ? (
          <Box component={'form'} onSubmit={formik.handleSubmit} sx={{ boxShadow: '2px 2px 2px 2px #c2c9d666', width: '80%', height: 'auto', margin: 'auto', padding: '30px', borderRadius: '10px', display: 'flex', justifyContent: 'space-around' }}>
            <Stack sx={{ width: '80%' }} alignItems='center' spacing={3} >
              <Typography variant="h3" sx={{ width: '100%', textTransform: 'uppercase' }}>{t('add')}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '15px' }}>
                <TextField
                  fullWidth
                  label={t('firstname')}
                  id="firstname"
                  name="firstname"
                  value={formik.values.firstname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.firstname && Boolean(formik.errors.firstname)}
                  helperText={formik.touched.firstname && formik.errors.firstname}
                />
                <TextField
                  fullWidth
                  label={t('lastname')}
                  id="lastname"
                  name="lastname"
                  value={formik.values.lastname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lastname && Boolean(formik.errors.lastname)}
                  helperText={formik.touched.lastname && formik.errors.lastname}

                />
              </Box>

              <TextField
                fullWidth
                label="Email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                fullWidth
                label={t('mobile')}
                id="mobile"
                name="mobile"
                value={formik.values.mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                helperText={formik.touched.mobile && formik.errors.mobile}
              />
              <TextField
                fullWidth
                label={t('address')}
                id="address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '15px' }}>
                <TextField
                  id="role"
                  name="role"
                  select
                  label={t('role')}
                  fullWidth
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {roles.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {(option.label).toUpperCase()}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  id="isBlocked"
                  name="isBlocked"
                  select
                  label={t('status')}
                  fullWidth
                  value={formik.values.isBlocked}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {status.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Chip
                        label={option.label}
                        color={option.value === 'true' ? 'error' : 'success'}
                        size="small"
                      />
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              {/* <TextField fullWidth label="Password" id="password" value={currentUser} defaultValue='*******' /> */}
              <Button variant="contained" type="submit" endIcon={<SendIcon />} sx={{}}>
                {t('submit')}
              </Button>
            </Stack>
          </Box>
        ) :
          (
            <>
              <Typography variant='h6'>{currentUser?.firstname} {currentUser?.lastname}</Typography>
              <Divider sx={{ margin: '20px 0' }} />

              {/* User info */}
              <Stack flex={1} sx={{ height: 'auto', boxShadow: '2px 5px 10px 10px #c2c9d666', padding: '20px 50px', borderRadius: '10px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <img src={currentUser?.avatar} alt='user-avatar' height={70} width={70} style={{ objectFit: 'cover', borderRadius: '50%' }} />
                    <Box>
                      <Typography variant='h6'>{currentUser?.firstname} {currentUser?.lastname}
                        <Typography component={'span'} variant='body1' sx={{ marginLeft: '10px', fontSize: '14px', fontWeight: '400', color: '#999999' }}>({currentUser?.role})</Typography>
                      </Typography>
                      <Typography variant='body1' sx={{ fontSize: '12px', fontWeight: '400', color: '#999999' }}>Create at: {formatDateToVietnamTime(currentUser?.createdAt)}</Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={currentUser?.isBlocked ? 'Blocked' : 'Active'}
                    color={currentUser?.isBlocked ? 'error' : 'success'}
                    size="medium"
                  />
                </Box>


                <Box
                  sx={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '20px', flexDirection: 'column', gap: '10px'
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontSize: '14px', fontWeight: '600' }}>{t('contactInfo')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '30px', marginLeft: '20px' }}>
                    <MailOutlined />
                    <Typography variant="subtitle1" sx={{ fontSize: '13px', fontWeight: '400' }}>{currentUser?.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '30px', marginLeft: '20px' }}>
                    <PhoneOutlined />
                    <Typography variant="subtitle1" sx={{ fontSize: '13px', fontWeight: '400' }}>{currentUser?.mobile}</Typography>
                  </Box>

                </Box>
                <Divider sx={{ margin: '10px 0' }} />

                <Box
                  sx={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '20px', flexDirection: 'column', gap: '10px'
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontSize: '14px', fontWeight: '600' }}>{t('address')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '30px', marginLeft: '20px' }}>
                    <Typography variant="subtitle1" sx={{ fontSize: '13px', fontWeight: '400' }}>{currentUser?.address}</Typography>
                  </Box>
                </Box>
                <Divider sx={{ margin: '10px 0' }} />

                <Box
                  sx={{
                    display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: '20px', gap: '10px'
                  }}
                >
                  <Button
                    onClick={handleOpen}
                    sx={{
                      color: 'white',
                      backgroundColor: '#3399ff',
                      '&:hover': {
                        backgroundColor: '#0066cc'
                      }
                    }}>{t('edit')}</Button>
                  <Button
                    onClick={() => navigate('/user')}
                    sx={{
                      color: 'black',
                      backgroundColor: '#d9d9d9',
                      '&:hover': {
                        backgroundColor: '#cccccc'
                      }
                    }}>{t('back')}</Button>
                </Box>
                <Divider sx={{ margin: '10px 0' }} />
              </Stack>

              <Box sx={{ height: 'auto', boxShadow: '2px 5px 10px 10px #c2c9d666', padding: '20px 50px', borderRadius: '10px', marginTop: '30px' }}>

              </Box>

              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box component={'form'} onSubmit={formik.handleSubmit} sx={{ ...style, width: '80%', height: 'auto', margin: 'auto', padding: '30px', borderRadius: '10px', display: 'flex', justifyContent: 'space-around' }}>
                  <Stack sx={{ width: '80%' }} alignItems='center' spacing={3} >
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      fileList={fileList}
                      beforeUpload={() => false}
                      onPreview={handlePreview}
                      onRemove={() => setFileList([])}
                      onChange={handleChangeImages}
                      maxCount={1}
                    >
                      {fileList.length >= 1 ? null : uploadButton}
                    </Upload>

                    {previewOpen && (
                      <Image.PreviewGroup preview={{ visible: previewOpen, onVisibleChange: (visible) => setPreviewOpen(visible) }}>
                        <Image src={previewImage} alt="Avatar Preview" style={{ display: 'none' }} />
                      </Image.PreviewGroup>
                    )}
                    {/* <UploadImage /> */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '15px' }}>
                      <TextField
                        fullWidth
                        label={t('firstname')}
                        id="firstname"
                        name="firstname"
                        value={formik.values.firstname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.firstname && Boolean(formik.errors.firstname)}
                        helperText={formik.touched.firstname && formik.errors.firstname}
                      />
                      <TextField
                        fullWidth
                        label={t('lastname')}
                        id="lastname"
                        name="lastname"
                        value={formik.values.lastname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.lastname && Boolean(formik.errors.lastname)}
                        helperText={formik.touched.lastname && formik.errors.lastname}

                      />
                    </Box>

                    <TextField
                      fullWidth
                      label="Email"
                      id="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                      fullWidth
                      label={t('mobile')}
                      id="mobile"
                      name="mobile"
                      value={formik.values.mobile}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                      helperText={formik.touched.mobile && formik.errors.mobile}
                    />
                    <TextField
                      fullWidth
                      label={t('address')}
                      id="address"
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.address && Boolean(formik.errors.address)}
                      helperText={formik.touched.address && formik.errors.address}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '15px' }}>
                      <TextField
                        id="role"
                        name="role"
                        select
                        label={t('role')}
                        fullWidth
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        {roles.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {(option.label).toUpperCase()}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        id="isBlocked"
                        name="isBlocked"
                        select
                        label={t('status')}
                        fullWidth
                        value={formik.values.isBlocked}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        {status.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Chip
                              label={option.label}
                              color={option.value === 'true' ? 'error' : 'success'}
                              size="small"
                            />
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                    {/* <TextField fullWidth label="Password" id="password" value={currentUser} defaultValue='*******' /> */}
                    <Button variant="contained" type="submit" endIcon={<SendIcon />} sx={{}}>
                      Submit
                    </Button>
                  </Stack>
                </Box>
              </Modal></>
          )
      }

      <SnackbarAlert
        open={openSnackbar.open}
        onClose={handleCloseSnackbar}
        message={openSnackbar.message}
        severity={openSnackbar.severity}
      />


    </>
  )
}

export default memo(DetailUser)