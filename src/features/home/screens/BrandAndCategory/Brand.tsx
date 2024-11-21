import { Box, Button, Stack, Typography } from "@mui/material"
import { Input, InputRef, Popconfirm, Space, Table, TableColumnsType, TableProps } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { DeleteOutlined } from "@ant-design/icons";
import { GridAddIcon } from "@mui/x-data-grid";
import { useCallback, useRef, useState } from "react";
import { instance } from "../../../../api/api";
import { addBrand, deleteBrand } from "../../redux/home.slice";
import { useTranslation } from "react-i18next";

const Brand = () => {
  const { t } = useTranslation('brandCategory')
  const [brandAdd, setBrandAdd] = useState<string>('')
  const dispatch = useAppDispatch()
  const inputRef = useRef<InputRef>(null);

  const brands = useAppSelector(state => state.home.brand)
  const text = t('acceptDelete');
  const description = t('desDelete');

  interface DataType {
    key: string;
    title: string;
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: t('title'),
      dataIndex: 'title',
      filters: [
        {
          text: 'Samsung',
          value: 'SAMSUNG',
        },
        {
          text: 'Apple',
          value: 'APPLE',
        }
      ],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.title.includes(value as string),
      width: '70%',
    },
    {
      title: t('action'),
      key: "action",
      align: 'right',
      render: (_: any, record: DataType) => (
        <Space size="middle">
          {/* <EditOutlined /> */}
          <Popconfirm
            placement="topRight"
            title={text}
            description={description}
            okText={t('okText')}
            cancelText={t('cancelText')}
            onConfirm={() => handleDeleteUser(record.key)}
          >
            <DeleteOutlined />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const data: DataType[] = brands.map((brand) => {
    return {
      key: brand._id.toString(),
      title: brand.title,
    }
  })

  const handleSubmit = useCallback(async () => {
    const response = await instance.post('brand', { title: brandAdd })
    setBrandAdd('')

    if (response.status === 200) {
      const dataAdd = response.data.createdBrand
      dispatch(addBrand({
        _id: dataAdd._id.toString(),
        title: dataAdd.title,
      }))
      setBrandAdd('')
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [brandAdd])


  const handleDeleteUser = useCallback(async (key: string) => {
    const response = await instance.delete(`brand/${key}`)
    if (response.status === 200) {
      dispatch(deleteBrand(key))
    }
  }, [])

  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <Stack flex={1} sx={{ boxShadow: '2px 2px 2px 2px #c2c9d666', borderRadius: '10px', padding: '10px', height: 'auto' }}>
      <Typography variant="h6">{t('brand')}</Typography>
      <Box component={'form'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '50px', marginTop: '20px' }}>
        <Input placeholder={`${t('brand')} ...`} value={brandAdd} onChange={(e) => setBrandAdd(e.target.value)} ref={inputRef} />
        <Button onClick={handleSubmit}>
          <GridAddIcon />
        </Button>
      </Box>
      <Table<DataType> columns={columns} dataSource={data} onChange={onChange} tableLayout='auto' pagination={{ pageSize: 5 }} />

    </Stack>
  )
}

export default Brand