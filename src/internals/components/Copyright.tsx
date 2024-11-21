import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { memo } from 'react';

const Copyright = (props: any) => {
  return (
    <Typography
      variant="body2"
      align="center"
      {...props}
      sx={[
        {
          color: 'text.secondary',
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      {'Copyright © '}
      <Link color="inherit" href="/">
        Project Graduation
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default memo(Copyright) 
