
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Divider, { dividerClasses } from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import { paperClasses } from '@mui/material/Paper';
import { listClasses } from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon, { listItemIconClasses } from '@mui/material/ListItemIcon';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { SnackbarCloseReason } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { postLogout } from '../../features/auth/redux/auth.actions';
import SnackbarAlert from '../ToastMessage/SnackbarAlert';
import MenuButton from './MenuButton';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const MenuItem = styled(MuiMenuItem)({
  margin: '2px 0',
});

export default function OptionsMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { userInfo } = useAppSelector((state) => state.authManagement);
  const navigate = useNavigate();

  console.log(userInfo)

  const handleViewCurrent = () => {
    navigate(`/user/${userInfo?._id}`);
    handleClose();
  }

  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(postLogout())
        .unwrap()
        .then(() => {
          setOpenSnackbar({
            open: true,
            severity: 'success',
            message: 'Logged out successfully',
          });
        });

    } catch (error) {
      setOpenSnackbar({
        open: true,
        severity: 'error',
        message: 'An error occurred while logging out',
      });
    }
  };

  // Snackbar
  const [openSnackbar, setOpenSnackbar] = React.useState({
    open: false,
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
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
  //

  const { t } = useTranslation('sidebar');

  return (
    <React.Fragment>
      <SnackbarAlert
        open={openSnackbar.open}
        onClose={handleCloseSnackbar}
        message={openSnackbar.message}
        severity={openSnackbar.severity}
      />
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: 'transparent' }}
      >
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: '4px',
            width: '150px',
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: '4px -4px',
          },
        }}
      >
        <MenuItem onClick={handleViewCurrent}>{t('profile')}</MenuItem>
        {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: 'auto',
              minWidth: 0,
            },
          }}
        >
          <ListItemText>{t(('logout'))}</ListItemText>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
