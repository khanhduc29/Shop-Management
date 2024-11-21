import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import StatCard, { StatCardProps } from './components/StatCard';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SessionsChart from './components/SessionsChart';
import PageViewsBarChart from './components/PageViewsBarChart';
import ProductTable from './components/ProductTable';
import { instance } from '../../../../api/api';
import TotalCard from './components/TotalCard';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useTranslation } from "react-i18next";
import { WalletOutlined } from '@ant-design/icons';
import { Button } from '@mui/material';

const getFormattedDate = (type: any) => {
  const date = new Date();
  let result;

  switch (type) {
    case 'today':
      result = formatDate(date, 'day');
      break;

    case 'yesterday':
      date.setDate(date.getDate() - 1);
      result = formatDate(date, 'day');
      break;

    case 'currentMonth':
      result = formatDate(date, 'month');
      break;

    case 'lastMonth':
      date.setMonth(date.getMonth() - 1);
      result = formatDate(date, 'month');
      break;

    case 'currentYear':
      result = formatDate(date, 'year');
      break;

    case 'lastYear':
      date.setFullYear(date.getFullYear() - 1);
      result = formatDate(date, 'year');
      break;

    case 'currentQuarter':
      const currentQuarter = Math.floor(date.getMonth() / 3) + 1;
      result = `${currentQuarter}/${date.getFullYear()}`;
      break;

    case 'lastQuarter':
      let lastQuarter = Math.floor(date.getMonth() / 3);
      let year = date.getFullYear();
      if (lastQuarter === 0) {
        lastQuarter = 4;
        year -= 1;
      }
      result = `${lastQuarter}/${year}`;
      break;

    default:
      throw new Error('Invalid type specified');
  }

  return result;
};

const formatDate = (date: Date, format: string) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  switch (format) {
    case 'day':
      return `${day}/${month}/${year}`;
    case 'month':
      return `${month}/${year}`;
    case 'year':
      return `${year}`;
    default:
      return '';
  }
};

function generate30DayData(data: any[], referenceDate: any) {
  const existingData = new Map(
    data?.map(item => [
      new Date(item.year, item.month - 1, item.day).toISOString().split('T')[0],
      item.totalOrders
    ])
  );
  const result = [];
  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      referenceDate.getDate() - i
    );
    const dateKey = currentDate.toISOString().split('T')[0];
    result.push({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate(),
      totalOrders: existingData.get(dateKey) || 0,
    });
  }
  return result;
}

function generateLastSixMonthsData(data: any[]): any[] {
  const result: any[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const existingData = data?.find(d => d.year === year && d.month === month);
    result.push({
      year: year,
      month: month,
      totalOrders: existingData ? existingData.totalOrders : 0
    });
  }
  return result;
}

const Dashboard = () => {
  const { t } = useTranslation('dashboard');

  const [revenueByDay, setRevenueByDay] = useState<any>();
  const [revenueBy2Day, setRevenueBy2Day] = useState<any>();
  const [revenueByMonth, setRevenueByMonth] = useState<any>();
  const [revenueBy2Month, setRevenueBy2Month] = useState<any>();
  const [revenueByQuarter, setRevenueByQuarter] = useState<any>();
  const [revenueBy2Quarter, setRevenueBy2Quarter] = useState<any>();
  const [revenueByYear, setRevenueByYear] = useState<any>();
  const [revenueBy2Year, setRevenueBy2Year] = useState<any>();

  const [totalRevenue, setTotalRevenue] = useState<any>();
  const [totalSoldProduct, setTotalSoldProduct] = useState<any>();
  const [totalInStockProduct, setTotalInStockProduct] = useState<any>();
  const [totalUsers, setTotalUsers] = useState<any>();

  const [productListView, setProductListView] = useState<any>();
  const [productListInStock, setProductListInStock] = useState<any>();
  const [productListRating, setProductListRating] = useState<any>();

  const [orderSucceeded, setOrderSucceeded] = useState<any>();
  const [orderProcessing, setOrderProcessing] = useState<any>();
  const [orderCanceled, setOrderCanceled] = useState<any>();

  const [loading, setLoading] = useState(false);

  const today = new Date();
  const orderSucceededDaily = generate30DayData(orderSucceeded?.dailyOrders, today);
  const orderProcessingDaily = generate30DayData(orderProcessing?.dailyOrders, today);
  const orderCanceledDaily = generate30DayData(orderCanceled?.dailyOrders, today);
  const totalOrders30Day = orderCanceled?.dailyOrders?.reduce((acc: number, cur: any) => acc + cur.totalOrders, 0)
    + orderProcessing?.dailyOrders?.reduce((acc: number, cur: any) => acc + cur.totalOrders, 0)
    + orderSucceeded?.dailyOrders?.reduce((acc: number, cur: any) => acc + cur.totalOrders, 0);

  const orderSucceededByMonth = generateLastSixMonthsData(orderSucceeded?.monthlyOrders);
  const orderProcessingByMonth = generateLastSixMonthsData(orderProcessing?.monthlyOrders);
  const orderCanceledByMonth = generateLastSixMonthsData(orderCanceled?.monthlyOrders);
  const totalOrders6Month = orderCanceled?.monthlyOrders?.reduce((acc: number, cur: any) => acc + cur.totalOrders, 0)
    + orderProcessing?.monthlyOrders?.reduce((acc: number, cur: any) => acc + cur.totalOrders, 0)
    + orderSucceeded?.monthlyOrders?.reduce((acc: number, cur: any) => acc + cur.totalOrders, 0);

  const handleExportPdf = async () => {
    setLoading(true);

    const element = document.getElementById('report');
    if (element) {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 20, 20, pdfWidth - 40, pdfHeight - 40);
      pdf.save('daily_sales_report.pdf');
    } else {
      console.error('Element not found');
    }

    setLoading(false);
  };

  // const exportByExcel = async () => {
  //   const day = '01/11/2024'; // Replace with dynamic date if necessary
  //   try {
  //     const response = await instance.post(
  //       'dashboard/export-daily-sales-report',
  //       { day },
  //       { responseType: 'blob' } // Ensure response is treated as a Blob
  //     );

  //     if (!response) {
  //       throw new Error('Network response was not ok');
  //     }

  //     const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //     const url = window.URL.createObjectURL(blob);

  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = `BaoCaoDoanhThu_${day}.xlsx`;
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();

  //     window.URL.revokeObjectURL(url); // Clean up URL reference
  //   } catch (error) {
  //     console.error('Error downloading the report:', error);
  //   }
  // };


  const getRevenues = useCallback(
    async (
      type: 'day' | 'month' | 'quarter' | 'year',
      value: string,
      setData: (data: any) => void
    ) => {
      try {
        const params =
          type === 'day'
            ? { day: value }
            : type === 'month'
              ? { month: value }
              : type === 'quarter'
                ? { quarter: value }
                : { year: value };
        const response = await instance.get('dashboard', { params });
        if (response.data.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const getValueAssociation = useCallback(
    async (type: string, setData: (data: any) => void) => {
      try {
        const response = await instance.get(`dashboard/${type}`);
        if (response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const getOrders = useCallback(async (type: string, setData: (data: any) => void) => {
    try {
      const body = {
        status: type,
      };
      const response = await instance.post('dashboard/order-summary', body);
      if (response) {
        setData(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [])

  useEffect(() => {
    getRevenues('day', getFormattedDate('today'), setRevenueByDay);
    getRevenues('day', getFormattedDate('yesterday'), setRevenueBy2Day);
    getRevenues('month', getFormattedDate('currentMonth'), setRevenueByMonth);
    getRevenues('month', getFormattedDate('lastMonth'), setRevenueBy2Month);
    getRevenues('year', getFormattedDate('currentYear'), setRevenueByYear);
    getRevenues('year', getFormattedDate('lastYear'), setRevenueBy2Year);
    getRevenues(
      'quarter',
      getFormattedDate('currentQuarter'),
      setRevenueByQuarter
    );
    getRevenues(
      'quarter',
      getFormattedDate('lastQuarter'),
      setRevenueBy2Quarter
    );

    getValueAssociation('getTotalRevenue', setTotalRevenue);
    getValueAssociation('total-sold', setTotalSoldProduct);
    getValueAssociation('total-inventory', setTotalInStockProduct);
    getValueAssociation('registrations-per-month', setTotalUsers);

    getValueAssociation('viewProducts', setProductListView);
    getValueAssociation('getProductsByQuantity', setProductListInStock);
    getValueAssociation('getProductsByRating', setProductListRating);

    getOrders('Processing', setOrderProcessing);
    getOrders('Succeeded', setOrderSucceeded);
    getOrders('Cancelled', setOrderCanceled);
  }, [getRevenues, getValueAssociation, getOrders]);


  const data: StatCardProps[] = useMemo(() => [
    {
      title: t('revenued'),
      value: revenueByDay?.data[0]?.totalRevenue || '0',
      interval: t('last24hours'),
      trend: (Number(revenueByDay?.data[0]?.totalRevenue ?? 0) - Number(revenueBy2Day?.data[0]?.totalRevenue ?? 0)) > 0
        ? 'up' as 'up'
        : (Number(revenueByDay?.data[0]?.totalRevenue ?? 0) - Number(revenueBy2Day?.data[0]?.totalRevenue ?? 0)) < 0
          ? 'down' as 'down' : 'neutral' as 'neutral',
      percentage: Number(revenueBy2Day?.data[0]?.totalRevenue ?? 0) === 0
        ? Number(revenueByDay?.data[0]?.totalRevenue ?? 0) === 0 ? '0' : '100'
        : (((Math.abs(Number(revenueByDay?.data[0]?.totalRevenue ?? 0) - Number(revenueBy2Day?.data[0]?.totalRevenue ?? 0))
          / Number(revenueBy2Day?.data[0]?.totalRevenue ?? 0)) * 100).toFixed(2)).toString()
      ,
      product: revenueByDay?.data[0]?.totalProductsSold || 0
    },
    {
      title: t('revenueM'),
      value: revenueByMonth?.data[0]?.totalRevenueMonth || '0',
      interval: getFormattedDate('currentMonth'),
      trend: (Number(revenueByMonth?.data[0]?.totalRevenueMonth ?? 0) - Number(revenueBy2Month?.data[0]?.totalRevenueMonth ?? 0)) > 0
        ? 'up' as 'up'
        : (Number(revenueByMonth?.data[0]?.totalRevenueMonth ?? 0) - Number(revenueBy2Month?.data[0]?.totalRevenueMonth ?? 0)) < 0
          ? 'down' as 'down' : 'neutral' as 'neutral'
      ,
      percentage: Number(revenueBy2Month?.data[0]?.totalRevenueMonth ?? 0) === 0
        ? Number(revenueByMonth?.data[0]?.totalRevenueMonth ?? 0) === 0 ? '0' : '100'
        : (((Math.abs(Number(revenueByMonth?.data[0]?.totalRevenueMonth ?? 0) - Number(revenueBy2Month?.data[0]?.totalRevenueMonth ?? 0))
          / Number(revenueBy2Month?.data[0]?.totalRevenueMonth ?? 0)) * 100).toFixed(2)).toString(),
      product: revenueByMonth?.data[0]?.totalProductMonth || 0

    },
    {
      title: t('revenueQ'),
      value: revenueByQuarter?.data[0]?.totalRevenueQuarter || '0',
      interval: 'Q' + getFormattedDate('currentQuarter'),
      trend:
        (Number(revenueByQuarter?.data[0]?.totalRevenueQuarter ?? 0) - Number(revenueBy2Quarter?.data[0]?.totalRevenueQuarter ?? 0)) > 0
          ? 'up' as 'up'
          : (Number(revenueByQuarter?.data[0]?.totalRevenueQuarter ?? 0) - Number(revenueBy2Quarter?.data[0]?.totalRevenueQuarter ?? 0)) < 0
            ? 'down' as 'down' : 'neutral' as 'neutral',
      percentage:
        Number(revenueBy2Quarter?.data[0]?.totalRevenueQuarter ?? 0) === 0
          ? Number(revenueByQuarter?.data[0]?.totalRevenueQuarter ?? 0) === 0 ? '0' : '100'
          : (((Math.abs(Number(revenueByQuarter?.data[0]?.totalRevenueQuarter ?? 0) - Number(revenueBy2Quarter?.data[0]?.totalRevenueQuarter ?? 0))
            / Number(revenueBy2Quarter?.data[0]?.totalRevenueQuarter ?? 0)) * 100).toFixed(2)).toString(),
      product: revenueByQuarter?.data[0]?.totalProductQuarter || 0
    },
    {
      title: t('revenueY'),
      value: revenueByYear?.data[0]?.totalRevenueYear || '0',
      interval: getFormattedDate('currentYear'),
      trend: (Number(revenueByYear?.data[0]?.totalRevenueYear ?? 0) - Number(revenueBy2Year?.data[0]?.totalRevenueYear ?? 0)) > 0
        ? 'up' as 'up'
        : (Number(revenueByYear?.data[0]?.totalRevenueYear ?? 0) - Number(revenueBy2Year?.data[0]?.totalRevenueYear ?? 0)) < 0
          ? 'down' as 'down' : 'neutral' as 'neutral',
      percentage: Number(revenueBy2Year?.data[0]?.totalRevenueYear ?? 0) === 0
        ? Number(revenueByYear?.data[0]?.totalRevenueYear ?? 0) === 0 ? '0' : '100'
        : (((Math.abs(Number(revenueByYear?.data[0]?.totalRevenueYear ?? 0) - Number(revenueBy2Year?.data[0]?.totalRevenueYear ?? 0))
          / Number(revenueBy2Year?.data[0]?.totalRevenueYear ?? 0)) * 100).toFixed(2)).toString(),
      product: revenueByYear?.data[0]?.totalProductYear || 0

    },
  ], [revenueByDay, revenueBy2Day, revenueByMonth, revenueBy2Month, revenueByQuarter, revenueBy2Quarter, revenueByYear, revenueBy2Year, t]);

  const data1: StatCardProps[] = useMemo(() => [
    {
      title: t('totalrevenue'),
      value: totalRevenue?.totalRevenue,
      interval: '',
      trend: 'up',
      isCurrency: true,
      icon: <WalletOutlined style={{ fontSize: '40px' }} />
    },
    {
      title: t('totalSoldProd'),
      value: totalSoldProduct?.totalSold,
      interval: '',
      trend: 'up',

    },
    {
      title: t('inStockProd'),
      value: totalInStockProduct?.totalQuantity,
      interval: '',
      trend: 'up',
    },
    {
      title: t('userReg'),
      value: totalUsers?.data.reduce((acc: number, cur: any) => acc + cur.count, 0),
      interval: '',
      trend: 'up',
    },

  ], [totalRevenue, totalInStockProduct, totalSoldProduct, t]);

  return (
    <Box
      sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}
      id="report"
    >
      {/* <button onClick={exportByExcel}> hsdjkfhkjsdf</button> */}
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        {t('overview')}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'end', marginBottom:'10px' }}>
        <Button variant='outlined' onClick={handleExportPdf} disabled={loading} >
          {loading ? 'Đang xuất...' : 'Xuất báo cáo'}
        </Button>
      </Box>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data1.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <TotalCard {...card} />
          </Grid>
        ))}
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ sm: 12, md: 6 }}    >
          <SessionsChart
            orderCanceledDaily={orderCanceledDaily}
            orderProcessingDaily={orderProcessingDaily}
            orderSucceededDaily={orderSucceededDaily}
            totalOrders30Day={totalOrders30Day}
          />
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <PageViewsBarChart
            orderCanceledByMonth={orderCanceledByMonth}
            orderProcessingByMonth={orderProcessingByMonth}
            orderSucceededByMonth={orderSucceededByMonth}
            totalOrders6Month={totalOrders6Month}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid size={12}>
          <ProductTable productListView={productListView} productListInStock={productListInStock} productListRating={productListRating} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(Dashboard);
