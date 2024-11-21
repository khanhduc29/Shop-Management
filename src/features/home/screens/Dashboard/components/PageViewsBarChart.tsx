import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';

interface SessionsChartProps {
  orderSucceededByMonth?: any;
  orderCanceledByMonth?: any;
  orderProcessingByMonth?: any;
  totalOrders6Month?: any;
}

export default function PageViewsBarChart({ orderSucceededByMonth, orderCanceledByMonth, orderProcessingByMonth, totalOrders6Month }: SessionsChartProps) {
  const theme = useTheme();
  const colorPalette = [
    theme.palette.primary.dark,
    theme.palette.primary.main,
    theme.palette.primary.light,
  ];
  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Đơn hàng theo tháng
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {totalOrders6Month}
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Tổng số đơn hàng 6 tháng gần nhất
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={
            [
              {
                scaleType: 'band',
                categoryGapRatio: 0.5,
                data: orderCanceledByMonth?.map((item: any) => `T${item.month}`),
              },
            ] as any
          }
          series={[
            {
              id: 'canceled',
              label: 'Đã hủy',
              data: orderCanceledByMonth?.map((item: any) => item.totalOrders),
              stack: 'A',
            },
            {
              id: 'processing',
              label: 'Đang xử lý',
              data: orderProcessingByMonth.map((item: any) => item.totalOrders),
              stack: 'A',
            },
            {
              id: 'succeeded',
              label: 'Hoàn tất',
              data: orderSucceededByMonth.map((item: any) => item.totalOrders),
              stack: 'A',
            },
          ]}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
