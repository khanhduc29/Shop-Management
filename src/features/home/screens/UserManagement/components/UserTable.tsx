import React from 'react';
import { Button, Input, Popconfirm, Space, Table, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons';
import { UserList } from '../../../../auth/types/auth.types';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Column, ColumnGroup } = Table;

interface DataType {
  key: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: string;
  role: string;
  status: string;
  avatar: string;
}

type Props = {
  userList: UserList[],
  totalUsers: number,
  page: number,
  pageSize: number,
  onPageChange: (page: number, pageSize: number) => void,
  handleUpdateStatus: (key: string, status: string) => void,
}

const UserTable: React.FC<Props> = ({ userList, totalUsers, page, pageSize, onPageChange, handleUpdateStatus }) => {
  const { t } = useTranslation('user');
  const [searchTerm, setSearchTerm] = React.useState('');

  const formattedUsers: DataType[] = userList?.map((user) => ({
    key: user._id,
    avatar: user.avatar,
    firstName: user.firstname,
    lastName: user.lastname,
    email: user.email,
    mobile: user.mobile,
    address: user.address[0],
    role: user.role?.toUpperCase() || 'UNKNOWN',
    status: user.isBlocked ? 'blocked' : 'active',
  }));

  const handleSearch = () => {
    // onSearch(searchTerm);
    console.log('search')
  };
  
  const text = t('acceptDelete');
  const description = t('deleteDes');

  const textActive = t('acceptActive');
  const descriptionActive = t('activeDes');

  const handleDeleteUser = (key: string, status: string) => {
    handleUpdateStatus(key, status);
  };


  return (
    <>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        <Input.Search
          placeholder="Search users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={handleSearch}
          style={{ marginBottom: '10px', width: '300px' }}
        />
        <Button type="primary" shape="round" icon={<PlusOutlined />} style={{ marginBottom: '10px' }}>
          <NavLink to='add'>
            {t(('add'))}
          </NavLink>
        </Button>
      </div>
      <Table<DataType>
        tableLayout="fixed"
        dataSource={formattedUsers}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: totalUsers,
          onChange: onPageChange,
        }}>
        <Column title='Avatar' dataIndex='avatar' key='avatar'
          render={(ava: string) =>
            <img
              src={ava}
              alt='avatar'
              height={50}
              width={50}
              style={{ objectFit: 'cover', borderRadius: '50%' }}
            />
          }
        />
        <ColumnGroup title={t(('name'))}>
          <Column title={t(('firstname'))} dataIndex="firstName" key="firstName" />
          <Column title={t('lastname')} dataIndex="lastName" key="lastName" />
        </ColumnGroup>
        <Column title="Email" dataIndex="email" key="email" />
        <Column title={t('mobile')} dataIndex="mobile" key="mobile" />
        <Column title={t('address')} dataIndex="address" key="address" />
        <Column title={t('role')} dataIndex="role" key="role" />
        <Column
          title={t('status')}
          dataIndex="status"
          key="status"
          render={(status: string) => {
            const color = (status == 'blocked') ? 'error' : 'success';
            return (
              <Tag color={color} key={status}>
                {status.toUpperCase()}
              </Tag>
            );
          }}
        />
        <Column
          title={t('action')}
          key="action"
          render={(_: any, record: DataType) => (
            <Space size="middle">
              <NavLink to={record.key} style={{ color: 'black' }}>
                <EditOutlined style={{ color: '#00bfff' }} />
              </NavLink>

              {record.status === 'active' ? (
                <Popconfirm
                  placement="topRight"
                  title={text}
                  description={description}
                  okText={t('okText')}
                  cancelText={t('cancelText')}
                  onConfirm={() => handleDeleteUser(record.key, record.status)}
                >
                  <DeleteOutlined style={{ color: 'red' }} />
                </Popconfirm>

              ) : (
                <Popconfirm
                  placement="topRight"
                  title={textActive}
                  description={descriptionActive}
                  okText={t('okText')}
                  cancelText={t('cancelText')}
                  onConfirm={() => handleDeleteUser(record.key, record.status)}
                >
                  <RedoOutlined style={{ color: 'brown' }} />
                </Popconfirm>
              )
              }
            </Space>
          )}
        />
      </Table>
    </>
  )
}

export default UserTable;