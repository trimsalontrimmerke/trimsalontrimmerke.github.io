import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Table,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Tag,
  message,
  Space,
  Typography,
  Layout,
  Input,
  Spin
} from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import BackNav from '../nav/BackNav';
import dayjs from 'dayjs';
import { Popconfirm } from 'antd';
import useAuth from '../../../hooks/useAuth';
import './BackCadeau.css';

const { Title } = Typography;
const { Content } = Layout;

const generateHexCode = (length = 5) => {
  const chars = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

const BackCadeau = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState('');
const { isLoggedIn, loading: authLoading } = useAuth();
   useEffect(() => {
      if (isLoggedIn) {
         fetchVouchers();
      }
    }, [isLoggedIn]);



  const fetchVouchers = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, 'vouchers'));
    const data = snapshot.docs.map(doc => doc.data());
    setVouchers(data);
    setLoading(false);
  };

 const createVoucher = async () => {
  let created = false;
  let code;

  while (!created) {
    code = generateHexCode(5);
    const ref = doc(db, 'vouchers', code);

    try {
      await setDoc(
        ref,
        {
          code,
          amount: null,
          expiresAt: null,
          redeemed: false,
          redeemedAt: null,
          createdAt: serverTimestamp(),
        },
        { merge: false } // important
      );

      created = true;
    } catch (error) {
      // In the extremely rare case of collision, loop again
    }
  }

  message.success(`Voucher ${code} created`);
  fetchVouchers();
};


  const openEditModal = (voucher) => {
  setSelectedVoucher(voucher);

  form.setFieldsValue({
    amount: voucher.amount,
    expiresAt: voucher.expiresAt
      ? dayjs(voucher.expiresAt.toDate())
      : null,
  });

  setEditModalOpen(true);
};


 const updateVoucher = async (values) => {
  const ref = doc(db, 'vouchers', selectedVoucher.code);

  await updateDoc(ref, {
    amount: Number(values.amount),
    expiresAt: Timestamp.fromDate(values.expiresAt.toDate()),
  });

  message.success('Voucher updated');
  setEditModalOpen(false);
  fetchVouchers();
};

const redeemVoucherAdmin = async (voucher) => {
  if (voucher.redeemed) return;

  const ref = doc(db, 'vouchers', voucher.code);

  await updateDoc(ref, {
    redeemed: true,
    redeemedAt: serverTimestamp(),
  });

  message.success(`Voucher ${voucher.code} redeemed`);
  fetchVouchers();
};


  const renderStatus = (voucher) => {
    if (voucher.redeemed) return <Tag color="red">Redeemed</Tag>;
    if (!voucher.amount) return <Tag>Niet gebruikt</Tag>;
    if (voucher.expiresAt?.toDate() < new Date()) {
      return <Tag color="orange">Vervallen</Tag>;
    }
    return <Tag color="green">ingebruik</Tag>;
  };

  const filteredVouchers = vouchers.filter(voucher =>
  voucher.code.toLowerCase().includes(search.toLowerCase())
);
  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: code => <b>{code}</b>,
    },
    {
      title: 'Bedrag',
      dataIndex: 'amount',
      render: amount => amount ? `€${amount}` : '—',
    },
    {
      
      title: 'Verval Datum',
      dataIndex: 'expiresAt',
      render: (date) =>
        date ? dayjs(date.toDate()).format('DD/MM/YYYY') : '—',
    },
    {
      title: 'Status',
      render: (_, record) => renderStatus(record),
    },
    
   {
  title: 'Acties',
  render: (_, record) => (
    <Space>
     <Button
        icon={<EditOutlined />}
        onClick={() => openEditModal(record)}
        disabled={record.redeemed}
      >
        Edit
      </Button>


      <Popconfirm
        title="Redeem voucher?"
        description="This action cannot be undone."
        onConfirm={() => redeemVoucherAdmin(record)}
        okText="Yes"
        cancelText="No"
      >
        <Button danger disabled={record.redeemed}>
          Redeem
        </Button>
      </Popconfirm>
    </Space>
  ),
}
  ];

   if (authLoading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <BackNav />
        <Content style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (!isLoggedIn) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <BackNav />
        <Content style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Title level={4}>Please log in to manage photos</Title>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <BackNav />

      <Content className="back-Cadeau-container">
              <Card
                title={
                  <Title level={2} style={{ margin: 0 }}>
                   CadeauKaart Management
                  </Title>
                }
                className="back-Cadeau-card"
              >
     

        <Card
            style={{ marginBottom: 24 }}
            title={
              <Input
                placeholder="Search voucher code…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
                style={{ maxWidth: 300 }}
              />
            }
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={createVoucher}
              >
                Generate Voucher
              </Button>
            }
          >

        <Table
          rowKey="code"
          loading={loading}
          columns={columns}
          dataSource={filteredVouchers}
        />

          </Card>
        </Card>

        <Modal
          title={`Edit Voucher ${selectedVoucher?.code}`}
          open={editModalOpen}
          onCancel={() => setEditModalOpen(false)}
          onOk={() => form.submit()}
          okText="Save"
        >
          <Form form={form} layout="vertical" onFinish={updateVoucher}>
            <Form.Item
              label="Bedrag (€)"
              name="amount"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Verval Datum"
              name="expiresAt"
              rules={[{ required: true }]}
            >
              <DatePicker
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
            />

            </Form.Item>
          </Form>
        </Modal>
        
      </Content>
    </Layout>
  );
};

export default BackCadeau;
