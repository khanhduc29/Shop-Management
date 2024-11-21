import { Outlet } from "react-router-dom"
import { FC, memo } from "react"
import AppTheme from "../theme/AppTheme"
import { Box, CssBaseline, Stack } from "@mui/material"
import { chartsCustomizations, dataGridCustomizations, datePickersCustomizations, treeViewCustomizations } from "../theme/customizations"
import SideMenu from "../components/SideMenu/SideMenu"
import AppNavbar from "../components/SideMenu/AppNavbar"
import Header from "../components/Header/Header"

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const DefaultLayout: FC = (props: { disableCustomTheme?: boolean }) => {
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        {/* Main content */}
        <Box component="main" sx={{width:"100%"}}>
          <AppNavbar />
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <Outlet />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}

export default memo(DefaultLayout)