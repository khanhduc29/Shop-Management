import React from 'react';
import { Space, Table, Tag } from 'antd';
import { OrderType } from '../../../types/order.typs';
import { UserList } from '../../../../auth/types/auth.types';
import { NavLink } from 'react-router-dom';
import { ExportOutlined, EyeOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Column } = Table;

interface DataType {
  key: string;
  orderBy: UserList;
  total: number;
  status: string;
}

type Props = {
  orderList: OrderType[],
  totalOrders: number,
  page: number,
  pageSize: number,
  onPageChange: (page: number, pageSize: number) => void,
  onSearch: (searchTerm: string) => void,
}

const OrderTable: React.FC<Props> = ({ orderList, totalOrders, page, pageSize, onPageChange, onSearch }) => {

  // const [searchTerm, setSearchTerm] = React.useState('');
  // const [user, setUser] = React.useState<UserList[]>([]);

  const formattedOrder: DataType[] = orderList?.map((order) => ({
    key: order._id,
    orderBy: order.orderBy,
    total: order.total,
    status: order.status,
  }));

  console.log(formattedOrder)

  console.log(orderList)

  const handleExport = (order: OrderType) => {
    const dataForExcel = (order.products ?? []).map((item, index) => ({
      OrderID: index === 0 ? order._id : '',
      OrderStatus: index === 0 ? order.status : '',
      TotalAmount: index === 0 ? order.total : '',
      OrderBy: index === 0 ? order.orderBy : '',
      CreatedAt: index === 0 ? order.createdAt : '',
      UpdatedAt: index === 0 ? order.updatedAt : '',
      ProductID: item.product._id,
      ProductTitle: item.product.title,
      ProductThumb: item.product.thumb,
      Count: item.count,
      Color: item.color,
    }));

    // Tạo workbook và worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Order Data');

    // Xuất file Excel
    XLSX.writeFile(workbook, 'order_data.xlsx');
  };

  console.log(onSearch)

  return (
    <Table<DataType>
      dataSource={formattedOrder}
      tableLayout="fixed"
      pagination={{
        current: page,
        pageSize: pageSize,
        total: totalOrders,
        onChange: onPageChange,
      }}
    >
      <Column title="ID" dataIndex="key" key="key"
        render={(key: string) => {
          return (
            <NavLink to={`/order/${key}`}>#{key}</NavLink>
          );
        }}
      />
      <Column title="Total" dataIndex="total" key="total" />
      <Column title="User" dataIndex="orderBy" key="orderBy"
        render={(orderBy: any) => {
          return (
            (orderBy?.firstname != null && orderBy?.lastname != null) ?
              <NavLink to={`/user/${orderBy?._id}`}> {orderBy?.firstname} {orderBy?.lastname}</NavLink>
              : 'Unknown'
          );
        }}

      />
      <Column
        title="Status"
        dataIndex="status"
        key="status"
        render={(status: string) => {
          const color = (status == 'Cancelled') ? 'error' : (status == 'Succeeded') ? 'success' : 'warning';
          return (
            <Tag color={color} key={status}>
              {status?.toUpperCase()}
            </Tag>
          );
        }}
      />
      <Column
        title="Action"
        key="action"
        text-align="right"
        render={(_: any, record: DataType) => (
          <Space size="middle">
            <NavLink to={`/order/${record.key}`} style={{ color: '#00bfff' }}>
              <EyeOutlined />
            </NavLink>
            <ExportOutlined style={{ cursor: 'pointer', }} onClick={() => handleExport(orderList.find(item => item._id === record.key)!)} />
          </Space>
        )}
      />
    </Table>
  )
}

export default OrderTable