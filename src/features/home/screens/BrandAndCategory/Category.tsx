import { Box, Stack, Typography } from "@mui/material"
import { Button, Input, InputRef, Popconfirm, Space, Table, TableColumnsType, TableProps } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { DeleteOutlined } from "@ant-design/icons";
import { GridAddIcon } from "@mui/x-data-grid";
import { useCallback, useRef, useState } from "react";
import { instance } from "../../../../api/api";
import { addCategory, deleteCategory } from "../../redux/home.slice";
import { useTranslation } from "react-i18next";
const Category = () => {
  const { t } = useTranslation('brandCategory')
  const [brandAdd, setBrandAdd] = useState<string>('')
  const dispatch = useAppDispatch()
  const inputRef = useRef<InputRef>(null);

  const category = useAppSelector(state => state.home.categories)
  const text = t('acceptDelete');
  const description = t('desDelete');

  interface DataType {
    key: string;
    title: string;
    image: string;
  }

  const columns: TableColumnsType<DataType> = [

    {
      title: t('title'),
      dataIndex: 'title',
      filters:
        category.map((cate) => {
          return {
            text: cate.title,
            value: cate._id.toString(),
          }
        })
      ,
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

  const data: DataType[] = category.map((cate) => {
    return {
      key: cate._id.toString(),
      title: cate.title,
      image: cate.image,
    }
  })

  const handleSubmit = useCallback(async () => {
    const response = await instance.post('brand', { title: brandAdd })
    setBrandAdd('')

    if (response.status === 200) {
      const dataAdd = response.data.createdBrand
      dispatch(addCategory({
        _id: dataAdd._id.toString(),
        title: dataAdd.title,
        image: dataAdd.image,
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
      dispatch(deleteCategory(key))
    }
  }, [])

  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };
  return (
    <Stack flex={1} sx={{ boxShadow: '2px 2px 2px 2px #c2c9d666', borderRadius: '10px', padding: '10px', height: 'auto' }}>
      <Typography variant="h6">{t('category')}</Typography>
      <Box component={'form'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '50px', marginTop: '20px' }}>
        <Input placeholder="Brand..." value={brandAdd} onChange={(e) => setBrandAdd(e.target.value)} ref={inputRef} />
        <Button onClick={handleSubmit}>
          <GridAddIcon />
        </Button>
      </Box>
      <Table<DataType> columns={columns} dataSource={data} onChange={onChange} tableLayout='auto' pagination={{ pageSize: 5 }} />

    </Stack>
  )
}

export default Category