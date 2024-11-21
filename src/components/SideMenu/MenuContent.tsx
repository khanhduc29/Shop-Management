import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
// import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
// import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
// import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import DiscountIcon from '@mui/icons-material/Discount';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { NavLink } from 'react-router-dom';
import React from 'react';
import { useTranslation } from 'react-i18next';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, path: '/', lgk: 'home' },
  { text: 'Products', icon: <AnalyticsRoundedIcon />, path: '/product', lgk: 'products' },
  { text: 'Users', icon: <PeopleRoundedIcon />, path: '/user', lgk: 'users' },
  { text: 'Order', icon: <ShoppingCartIcon />, path: '/order', lgk: 'orders' },
  { text: 'Blog', icon: <AssignmentRoundedIcon />, path: '/blog', lgk: 'blog' },
  { text: 'Brand And Category', icon: <BookmarksIcon />, path: '/brand', lgk: 'brandandcategory' },
  { text: 'Coupon', icon: <DiscountIcon />, path: '/coupon', lgk: 'coupon' },
];

// const secondaryListItems = [
//   { text: 'Settings', icon: <SettingsRoundedIcon /> },
//   { text: 'About', icon: <InfoRoundedIcon /> },
//   { text: 'Feedback', icon: <HelpRoundedIcon /> },
// ];

const MenuContent = () => {
  const { t } = useTranslation('sidebar');

  const [selectedIndex, setSelectedIndex] = React.useState<number>(() => {
    const savedIndex = sessionStorage.getItem('selectedIndex');
    return savedIndex !== null ? parseInt(savedIndex, 10) : 0;
  });

  const handleListItemClick = React.useCallback(
    (index: number) => {
      setSelectedIndex(index);
      sessionStorage.setItem('selectedIndex', index.toString());
    },
    []
  );

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block', padding: "5px 0" }}>
            <NavLink to={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItemButton
                selected={selectedIndex === index}
                onClick={() => handleListItemClick(index)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={t(item.lgk)} />
              </ListItemButton>
            </NavLink>
          </ListItem>
        ))}
      </List>

      {/* <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Stack>
  );
}

export default React.memo(MenuContent)
