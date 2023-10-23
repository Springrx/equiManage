import { Form, Image, Upload, Badge, DatePicker, Input, InputNumber, Popconfirm, Table, Select, Divider, Space, Row, Col, Tag, Tooltip, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './home.css';
import { currentUsers, locations, originData, categories } from './config.js';
import { updateEquipment, addEquipment, uploadPhoto, getEquipmentList, deleteEquipment,getCategoriesList,addCategory } from './service';
import dayjs from 'dayjs';

const { TextArea } = Input;
const uploadButton = (
    <div>
        <div style={{ marginTop: 8 }}>Upload</div>
    </div>
);

let index = 0;
const Home = () => {
    const location = useLocation();
    const { user_id, is_manager } = location.state;
    const [form] = Form.useForm();
    const[categories,setCategories]=useState([]);
    const getCategories=async()=>{  
        const categoryList=await getCategoriesList();
        setCategories(categoryList);
    };
    // const [data, setData] = useState(originData);
    const [data, setData] = useState([]);
    const getEquipments = async (pageNum) => {
        const equipmentList = await getEquipmentList(pageNum);
        const { records } = equipmentList;
        records.map((item) => {
            item.key = item.id;
            item.receive_time = item.receive_time ? dayjs(item.receive_time) : '';
            item.buy_time = dayjs(item.buy_time);
            return item;
        })
        setData(records);
    }
    useEffect(() => {
        getEquipments(1);
        getCategories();
    }, []);
    const [page, setPage] = useState(1);
    const [editingKey, setEditingKey] = useState('');
    const [file, setFile] = useState('');
    const [items, setItems] = useState(['D4006', 'lucy']);
    const [category, setCategory] = useState('');
    const[name,setName]=useState('');
    const inputRef = useRef(null);
    const onNameChange = (event) => {
        setName(event.target.value);
    };
    const receive = (key) => {
        debugger
        const newData = [...data];
        const index = newData.findIndex((item) => key === item.key);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
                ...item,
                user_id: user_id,
                is_receive: 1,
                state:'正在使用',
                receive_time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
            });
            // const updatedEquipment=await updateEquipment(newData[index])
            // if (updatedEquipment){
            // setData(newData);
            // setEditingKey('');}
            // else 
            // message.error('领用失败');
            setData(newData);
            setEditingKey('');
        } else {
            message.error('领用失败');
        }
    }
    const restore=(key)=>{
        const newData = [...data];
        const index = newData.findIndex((item) => key === item.key);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
                ...item,
                user_id: user_id,
                is_receive: 0,
                state:'闲置',
                receive_time: '',
            });
            // const updatedEquipment=await updateEquipment(newData[index])
            // if (updatedEquipment){
            // setData(newData);
            // setEditingKey('');}
            // else 
            // message.error('领用失败');
            setData(newData);
            setEditingKey('');
        } else {
            message.error('领用失败');
        }
    }
    const addItem = (e) => {
        e.preventDefault();
        setItems([...items, name || `New item ${index++}`]);
        setName('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };
    const [imageUrl, setImgUrl] = useState('');
    const isEditing = (record) => {
        return record.key === editingKey;
    };
    const onChange = (date, dateString) => {
        const newData = [...data];
        const index = newData.findIndex((item) => editingKey === item.key);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
                ...item,
                buy_time: date,
            });
            setData(newData);
        }
    };
    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }) => {
        let inputNode = <Input />;
        if (inputType === 'textArea') {
            inputNode = <TextArea autoSize={{ minRows: 4, maxRows: 16 }} />;
        }
        else if (inputType === 'upload') {
            const props = {
                name: 'file',
                customRequest: async detail => {
                    setFile(detail.file);
                    const reader = new FileReader();
                    reader.readAsDataURL(detail.file);
                    reader.onload = function () {
                        setImgUrl(reader.result);
                    };
                    detail.onSuccess();
                },
                headers: {
                    authorization: 'authorization-text',
                },
                showUploadList: false,
                fileList: [],
            };
            inputNode = <Upload
                {...props}
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
            >
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>;
        }
        else if (inputType === 'selectLocation') {
            inputNode = <Select
                style={{
                    width: 100,
                }}
                placeholder="输入位置"
                dropdownRender={(menu) => (
                    <>
                        {menu}
                        <Divider style={{ margin: '8px 0', }} />
                        <Space style={{ padding: '0 8px 4px', }}>
                            <Input
                                placeholder="输入位置"
                                ref={inputRef}
                                value={name}
                                onChange={onNameChange}
                            />
                            <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                                添加新位置
                            </Button>
                        </Space>
                    </>
                )}
                options={items.map((item) => ({
                    label: item,
                    value: item,
                }))}
            />
        }
        else if (inputType === 'selectState') {
            inputNode = <Select
            defaultValue="闲置"
                style={{
                    width: 120,
                }}
                // onChange={handleChange}
                options={[
                    {
                        value: 0,
                        label: '闲置',
                    },
                    // {
                    //     value: '正在使用',
                    //     label: '正在使用',
                    // },
                    {
                        value: 2,
                        label: '已报废',
                    },
                ]}
            />
        }
        else if (inputType === 'selectCategory') {
            const addCategoryItem =async () => {
                const newCategory = await addCategory({category:category});
                console.log(newCategory,'newCategory');
                // if(newCategory){
                //     getCategories();
                //     setCategory('');
                // }
                // else message.error('添加失败');
            }
            const onCategoryChange = (event) => {      
                console.log(event.target.value);
                setCategory(event.target.value);
            }
            inputNode = <Select
            style={{
                width: 300,
            }}
            placeholder="输入类别"
            dropdownRender={(menu) => (
                <>
                    {menu}
                    <Divider style={{ margin: '8px 0', }} />
                    <Space style={{ padding: '0 8px 4px', }}>
                        <Input
                            placeholder="输入类别"
                            // ref={inputRef}
                            value={category}
                            onChange={onCategoryChange}
                        />
                        <Button type="text" icon={<PlusOutlined />} 
                        onClick={addCategoryItem}
                        >
                            添加新类别
                        </Button>
                    </Space>
                </>
            )}
            options={['电脑','打印机'].map((item) => ({
                label: item,
                value: item,
            }))}
        />
        }
        else if (inputType === 'DatePicker') {
            inputNode = <DatePicker  onChange={onChange} />
        }
        else {
            inputNode = <InputNumber />;
        }
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: false,
                                // message: `请输入${title}!`,
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };
    const handleAdd =async () => {
        if (editingKey === '') {
            const maxKey = Math.max(...data.map(item => item.key));
            const newData = {
                // key: maxKey + 1,
                name: '',
                category: '',
                number: '',
                buy_time: '',
                
                state: 0,
                is_receive: 0,
                receive_time: '',
                
                user_id: 0,
                username: '',
                // photo_url: '',
                location: '',
                configuration: ''
            };
            // setData([...data, newData]);
            // setEditingKey(newData.key);
            const newEquipment = await addEquipment(newData);
            if(newEquipment){
                getEquipments(page);
                // setData([...data, newEquipment]);
                // setEditingKey(newEquipment.key);
            }
            else message.error('添加失败');
        }
        else {
            message.error('请先保存正在编辑的设备信息');
        }
    }
    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            category: '',
            number: '',
            ...record,
        });
        setEditingKey(record.key);
        debugger
    };
    const cancel = () => {
        debugger
        setImgUrl('');
        setEditingKey('');
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            debugger
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                let photo_url;
                if(imageUrl!==''){
                    photo_url=await uploadPhoto(file);
                    setImgUrl('');
                }
                else{
                    photo_url=newData[index].photo;
                }
                const updatedEquipment=await updateEquipment({...newData[index],photo_url:photo_url})
                if(updatedEquipment){
                    const item = newData[index];
                    newData.splice(index, 1, {
                        ...item,
                        ...row,
                    });
                    setData(newData);
                    setEditingKey('');
                }
            // if (index > -1) {
            //     const item = newData[index];
            //     newData.splice(index, 1, {
            //         ...item,
            //         ...row,
            //     });
            //     console.log(newData.buy_time, 'newData.buy_time');
            //     setData(newData);
            //     setEditingKey('');
            // } else {
            //     newData.push(row);
            //     setData(newData);
            //     setEditingKey('');
            // }
        } }catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    async function del(key) {
        const is_del = await deleteEquipment (key);
        if(is_del){
            const equiList = await getEquipmentList(page);
            setData(equiList);
        }
        else 
            message.error('删除失败');
        // const newData = data.filter((item) => item.key !== key);
        // setData(newData);
        // setEditingKey('');
    }
    async function changePage(pageNum) {
        setPage(pageNum);
        // const equipmentList= await getEquipmentList(pageNum);
        // setData(equipmentList);
    }
    const columns = [{
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        editable: true,
    },
    {
        title: '类别',
        dataIndex: 'category',
        filters: categories,
        onFilter: (value, record) => {
            return record.category === value
        },
        filterSearch: true,
        key: 'category',
        editable: true,
    },
    {
        title: '国有资产编号',
        dataIndex: 'number',
        key: 'number',
        editable: true,
    }, {
        title: '购入时间',
        dataIndex: 'buy_time',
        sorter: (a, b) => {
            // 按照日期进行排序
            return a.buy_time - b.buy_time;
        },
        render: (buy_time) => {
            return dayjs(buy_time).isValid()?dayjs(buy_time).format('YYYY-MM-DD'):'';
        },
        key: 'buy_time',
        required:false,
        editable: true,
    },
    {
        title: '当前使用者',
        dataIndex: 'user',
        filters: currentUsers,
        onFilter: (value, record) => {
            return record.user === value
        },
        filterSearch: true,
        key: 'user',
        editable: false,
    }, {
        title: '领用时间',
        dataIndex: 'receive_time',
        key: 'receive_time',
        sorter: (a, b) => {
            // 按照日期进行排序
            return a.receive_time - b.receive_time;
        },
        render: (receive_time) => { 
            return dayjs(receive_time).isValid()?dayjs(receive_time).format('YYYY-MM-DD'):''; 
        },
        editable: false,
    }, {
        title: '使用状态',
        dataIndex: 'state',
        key: 'state',
        render: (state) => {
            switch (state) {
                case 0:
                    return <Badge status="warning" text="闲置" />
                case 2:
                    return <Badge status="error" text="已报废" />
                default:
                    return <Badge status="success" text="正在使用" />
            }
        },
        filters: [
            {
                text: '正在使用',
                value: 1,
            },
            {
                text: '已报废',
                value: 2,
            },
            {
                text: '闲置',
                value: 0,
            },
        ],
        onFilter: (value, record) => {
            console.log(record.state, 'record.state');
            return record.state === value
        },
        editable: true,
    }, {
        title: '位置',
        dataIndex: 'location',
        key: 'location',
        filters: [
            {
                text: 'A栋',
                value: 'A栋',
            },
            {
                text: 'D栋',
                value: 'D栋',
            },
        ],
        onFilter: (value, record) => {
            console.log(record.location, 'record.location');
            return record.location === value
        },
        filterSearch: true,
        editable: true,
    }, {
        title: '配置',
        dataIndex: 'configuration',
        key: 'configuration',
        editable: true,
    },
    {
        title: '照片',
        dataIndex: 'photo',
        key: 'photo',
        render: photo => (
            <Image
                width={100}
                src={photo}
            />
        ),
        editable: true,
        required:false
    },
    {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
            const editable = isEditing(record);
            return is_manager === 1 ? editable ? (<span>
                <a
                    // href="javascript:;"
                    onClick={() => save(record.key)}
                    style={{
                        marginRight: 8,
                    }}
                >
                    保存
                </a>
                <Popconfirm title="确认取消？" onConfirm={cancel}>
                    <a>取消</a>
                </Popconfirm>
            </span>) : (
                <Row gutter={[16, 8]}>
                    <Col span={24}>
                        <Tag color={editingKey === '' ? 'green' : 'gray'} onClick={() => {
                            setImgUrl('');
                            if (editingKey === '') {
                                edit(record);
                            }
                        }} >编辑</Tag>
                    </Col>
                    <Col span={24}>
                        <Popconfirm title="Sure to delete?" onConfirm={() => del(record.key)}>
                            <Tag color="red" >删除</Tag>
                        </Popconfirm>
                    </Col>
                </Row>
            ) : (record.is_receive === 0 && record.user_id === user_id ?
                <Row gutter={[16, 8]}>
                    <Col span={24}>
                        <Popconfirm title="确认领用？" onConfirm={() => receive(record.key)}>
                            <Tag>领用</Tag>
                        </Popconfirm>
                    </Col>
                </Row> : <Row gutter={[16, 8]}>
                    <Col span={24}>
                        <Popconfirm title="确认归还？" onConfirm={() => restore(record.key)}>
                            <Tag>归还</Tag>
                        </Popconfirm>
                    </Col>
                </Row>
            );
        },
    }];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        const classfyInput = (dataIndex) => {
            switch (dataIndex) {
                case 'category':
                    return 'selectCategory';
                case 'location':
                    return 'selectLocation';
                case 'state':
                    return 'selectState';
                case 'buy_time':
                    return 'DatePicker';
                case 'photo':
                    return 'upload';
                default:
                    return 'textArea';
            }
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: classfyInput(col.dataIndex),
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <div className='home'>
            <Form form={form} component={false}>
                {is_manager === 1 && <div className='addBtn'>
                    <Row justify="space-around" align="middle" gutter={[0, 14]}>
                        <Col span={2}>
                            <Tooltip placement="top" title={'数据将被添加至列表尾部'}>
                                <Button
                                    onClick={handleAdd}
                                    type="primary"
                                >
                                    添加设备
                                </Button>
                            </Tooltip>
                        </Col>
                    </Row>
                </div>}
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: changePage,
                        pageSize: 10
                    }}
                />
            </Form>
        </div>
    );
};
export default Home;