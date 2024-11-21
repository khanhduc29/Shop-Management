import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ForgotPassword from '../../components/ForgotPasswordProps';
import AppTheme from '../../../../theme/AppTheme';
import { FacebookIcon, GoogleIcon } from '../../components/CustomIcons';

import { useFormik } from 'formik';
import logo from '../../../../assets/images/logo_transprent.png'
import { initFormValue, schema } from '../../helpers/sign-in.helpers';
import { useAppDispatch } from '../../../../store/store';
import { postLogin } from '../../redux/auth.actions';
import { unwrapResult } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { SnackbarCloseReason } from '@mui/material';
import SnackbarAlert from '../../../../components/ToastMessage/SnackbarAlert';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

const LoginScreen = (props: { disableCustomTheme?: boolean }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = React.useCallback(async (values: typeof initFormValue) => {
    try {
      const resultLogin = await dispatch(postLogin(values));
      unwrapResult(resultLogin);
      navigate('/', { replace: true });
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
  }, [])

  const formik = useFormik({
    initialValues: initFormValue,
    validationSchema: schema,
    onSubmit: (values) => {
      handleLogin(values);
    },
  });

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <SnackbarAlert
          open={openSnackbar.open}
          onClose={handleCloseSnackbar}
          message={openSnackbar.message}
          severity={openSnackbar.severity}
        />
        <Card variant="outlined">
          <img src={logo} alt="Logo" height={50} width={100} />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>
          <form
            onSubmit={formik.handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              fullWidth
              variant="outlined"
              sx={{ ariaLabel: 'email' }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: "5px" }}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Link
                component="button"
                type="button"
                onClick={handleClickOpen}
                variant="body2"
                sx={{ alignSelf: 'baseline' }}
              >
                Forgot your password?
              </Link>
            </Box>
            <TextField
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              name="password"
              placeholder="••••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              fullWidth
              variant="outlined"
            />

            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              sx={{ mt: 5 }}
              type="submit"
              fullWidth
              variant="contained"
            >
              Sign in
            </Button>

          </form>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Google')}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Facebook')}
              startIcon={<FacebookIcon />}
            >
              Sign in with Facebook
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}

export default React.memo(LoginScreen)