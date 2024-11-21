import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useLocation } from 'react-router-dom';
import { HOME_ROUTES } from '../../features/home/routes/home.routes';
import { memo } from 'react';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: theme.palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

const NavbarBreadcrumbs = () => {

  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbs = pathnames.length === 0
    ? [{ text: 'Home', url: '/' }]
    : pathnames.map((_, index) => {
      const url = `/${pathnames.slice(0, index + 1).join('/')}`;
      const route = HOME_ROUTES.find((route) => route.path === url);
      return route ? { text: route.breadcrumbs, url } : null;
    }).filter(Boolean);

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1">Dashboard</Typography>
      {breadcrumbs.map((breadcrumbs, index) => (
        breadcrumbs && (
          <Typography key={index} variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
            {breadcrumbs.text}
          </Typography>
        )
      ))}
    </StyledBreadcrumbs>
  );
}

export default memo(NavbarBreadcrumbs);
