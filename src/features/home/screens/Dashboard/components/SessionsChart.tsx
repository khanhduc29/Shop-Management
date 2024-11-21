import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}
interface SessionsChartProps {
  orderSucceededDaily?: any;
  orderCanceledDaily?: any;
  orderProcessingDaily?: any;
  totalOrders30Day?: any;
}

export default function SessionsChart({ orderSucceededDaily, orderCanceledDaily, orderProcessingDaily, totalOrders30Day }: SessionsChartProps) {
  const theme = useTheme();

  const data = orderCanceledDaily?.map((item: any) => {
    return `${item.day}/${item.month}`
  }).reverse();

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Đơn hàng
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
              {totalOrders30Day}
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Tổng số đơn hàng 30 ngày gần nhất
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'point',
              data,
              tickInterval: (_, i) => (i + 1) % 5 === 0,
            },
          ]}
          series={[
            {
              id: 'processing',
              label: 'Đang xử lý',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: orderProcessingDaily?.map((item: any) => {
                return item.totalOrders
              }).reverse(),
            },
            {
              id: 'succeeded',
              label: 'Hoàn thành',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: orderSucceededDaily?.map((item: any) => {
                return item.totalOrders
              }).reverse(),
            },
            {
              id: 'canceled',
              label: 'Đã hủy',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              stackOrder: 'ascending',
              data: orderCanceledDaily?.map((item: any) => {
                return item.totalOrders
              }).reverse(),
              area: true,
            },
          ]}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={{
            '& .MuiAreaElement-series-canceled': {
              fill: "url('#canceled')",
            },
            '& .MuiAreaElement-series-processing': {
              fill: "url('#processing')",
            },
            '& .MuiAreaElement-series-succeeded': {
              fill: "url('#succeeded')",
            },
          }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        >
          <AreaGradient color={theme.palette.primary.dark} id="canceled" />
          <AreaGradient color={theme.palette.primary.main} id="processing" />
          <AreaGradient color={theme.palette.primary.light} id="succeeded" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
