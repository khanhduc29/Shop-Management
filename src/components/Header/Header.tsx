import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import Search from './Search';
import CustomDatePicker from '../CustomComponent/CustomDatePicker';
import MenuButton from '../SideMenu/MenuButton';
import ColorModeIconDropdown from '../../theme/ColorModeIconDropdown';
import { memo } from 'react';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import LanguageChange from './LanguageChange';


const Header = () => {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs />
      <Stack direction="row" sx={{ gap: 1 }}>
        <Search />
        <LanguageChange />
        <CustomDatePicker />
        <MenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton>
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}

export default memo(Header);
