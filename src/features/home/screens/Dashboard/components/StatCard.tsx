import { Box, Card } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

export type StatCardProps = {
  title: string;
  value: string;
  interval: string;
  trend: 'up' | 'down' | 'neutral';
  percentage?: string;
  product?: number;
  backgroundColor?: string;
  isCurrency?: boolean;
  icon?: React.ReactNode;
};

export default function StatCard({
  title,
  value,
  interval,
  trend,
  percentage, product
}: StatCardProps) {

  const { t } = useTranslation('dashboard');

  const labelColors = {
    up: 'success' as const,
    down: 'error' as const,
    neutral: 'default' as const,
  };

  const color = labelColors[trend];
  const trendValues = { up: `+${percentage}%`, down: `-${percentage}%`, neutral: `~${percentage}%` };

  return (
    <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
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
                {Number(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </Typography>
              <Chip size="small" color={color} label={trendValues[trend]} />
            </Stack>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {interval}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {product} {t('pro')}
              </Typography>
            </Box>
          </Stack>

        </Stack>
      </CardContent>
    </Card>
  );
}
