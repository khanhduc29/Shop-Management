import { Card } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { StatCardProps } from './StatCard';

const TotalCard = ({
  title,
  value,
  isCurrency,
  icon
}: StatCardProps) => {

  return (
    <Card variant="outlined" sx={{ height: '100%', flexGrow: 1, display: 'flex' }}>
      {icon}
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack
          direction="column"
          sx={{ justifyContent: 'space-between', flexGrow: '1', gap: 1 }}
        >
          <Stack sx={{ justifyContent: 'space-between' }}>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="h4" component="p">
                {(isCurrency)
                  ? Number(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                  : Number(value).toLocaleString('vi-VN')
                }
              </Typography>
              {/* <Chip size="small"  /> */}
            </Stack>

          </Stack>

        </Stack>
      </CardContent>
    </Card>
  )
}

export default TotalCard