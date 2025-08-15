import React, { useState } from "react";
import { Modal, Table, Button, Tag, Typography, Space, Card, Badge } from "antd";
import { ShoppingCartOutlined, EyeOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

const ItemsModal = ({ items }) => {
  const [visible, setVisible] = useState(false);

  const columns = [
    {
      title: (
        <Space>
          <Text strong style={{ color: '#2c3e50' }}>Category</Text>
        </Space>
      ),
      dataIndex: ["MenuItem", "Category", "Title"],
      key: "category",
      width: 120,
      render: (text) => (
        <Tag 
          color="#8e44ad" 
          style={{ 
            fontSize: '11px', 
            fontWeight: 'bold',
            padding: '4px 8px',
            borderRadius: '12px'
          }}
        >
          {text || "N/A"}
        </Tag>
      ),
    },
    {
      title: (
        <Space>
          <ShoppingCartOutlined style={{ color: '#3498db' }} />
          <Text strong style={{ color: '#2c3e50' }}>Item Details</Text>
        </Space>
      ),
      key: "itemWithQty",
      width: 220,
      render: (_, record) => {
        const itemName = record.MenuItem?.Item_Name || "Unnamed Item";
        const qty = record.Quantity || 0;
        return (
          <div style={{ padding: '4px 0' }}>
            <Text strong style={{ fontSize: '13px', color: '#2c3e50' }}>
              {itemName}
            </Text>
            <div style={{ marginTop: '4px' }}>
              <Badge 
                count={qty} 
                style={{ 
                  backgroundColor: '#27ae60',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}
                showZero 
              />
              <Text style={{ fontSize: '11px', color: '#7f8c8d', marginLeft: '8px' }}>
                Quantity
              </Text>
            </div>
          </div>
        );
      },
    },
    {
      title: (
        <Text strong style={{ color: '#2c3e50' }}>Unit Price</Text>
      ),
      dataIndex: ["MenuItem", "Price"],
      key: "price",
      width: 100,
      align: 'center',
      render: (price, record) => (
        <Tag 
          color="#3498db" 
          style={{ 
            fontSize: '12px', 
            fontWeight: 'bold',
            padding: '4px 10px'
          }}
        >
          ₹{price || record.Price || 0}
        </Tag>
      ),
    },
    {
      title: (
        <Text strong style={{ color: '#2c3e50' }}>Total Amount</Text>
      ),
      key: "total",
      width: 120,
      align: 'center',
      render: (_, record) => {
        const price = record.MenuItem?.Price || record.Price || 0;
        const qty = record.Quantity || 0;
        const total = price * qty;
        return (
          <div style={{
            backgroundColor: '#34495e',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '13px',
            textAlign: 'center'
          }}>
            ₹{total}
          </div>
        );
      },
    },
    {
      title: (
        <Text strong style={{ color: '#2c3e50' }}>Description</Text>
      ),
      dataIndex: ["MenuItem", "Description"],
      key: "description",
      render: (text) => (
        <Text 
          style={{ 
            fontSize: '12px', 
            color: '#7f8c8d',
            fontStyle: text ? 'normal' : 'italic'
          }}
          ellipsis={{ tooltip: text || "No description available" }}
        >
          {text || "No description available"}
        </Text>
      ),
    },
  ];

  // Calculate total amount
  const grandTotal = items.reduce((sum, item) => {
    const price = item.MenuItem?.Price || item.Price || 0;
    const qty = item.Quantity || 0;
    return sum + (price * qty);
  }, 0);

  const totalItems = items.reduce((sum, item) => sum + (item.Quantity || 0), 0);

  const scrollConfig = items.length >= 8 ? { y: 400 } : undefined;

  return (
    <>
      <Button 
        type="primary" 
        ghost
        icon={<EyeOutlined />}
        onClick={() => setVisible(true)}
        style={{ 
          borderColor: '#3498db',
          color: '#3498db',
          fontWeight: '500',
          borderRadius: '6px'
        }}
      >
        View All Items ({items.length})
      </Button>
      
      <Modal
        title={
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            paddingBottom: '12px',
            borderBottom: '2px solid #ecf0f1'
          }}>
            <Space>
              <ShoppingCartOutlined style={{ color: '#3498db', fontSize: '18px' }} />
              <Title level={4} style={{ margin: 0, color: '#2c3e50' }}>
                Order Items Details
              </Title>
            </Space>
        
          </div>
        }
        open={visible}    
        onCancel={() => setVisible(false)}
        footer={
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '16px 0 8px',
            borderTop: '2px solid #ecf0f1'
          }}>
            <Space size="large">
              <Text style={{ fontSize: '14px', color: '#7f8c8d' }}>
                Total Items: <Text strong style={{ color: '#2c3e50' }}>{items.length}</Text>
              </Text>
              <Text style={{ fontSize: '14px', color: '#7f8c8d' }}>
                Total Quantity: <Text strong style={{ color: '#2c3e50' }}>{totalItems}</Text>
              </Text>
            </Space>
            <div style={{
              backgroundColor: '#2c3e50',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              Grand Total: ₹{grandTotal.toFixed(2)}
            </div>
          </div>
        }
        width={800}
        centered
        bodyStyle={{ 
          padding: '16px 0',
          maxHeight: '60vh',
          overflow: 'auto'
        }}
      >
        <Card 
          size="small" 
          style={{ 
            border: '1px solid #ecf0f1',
            borderRadius: '8px'
          }}
        >
          <Table
            dataSource={items.map((item, idx) => ({ ...item, key: idx }))}
            columns={columns}
            pagination={false}
            size="small"
            scroll={scrollConfig}
            style={{ fontSize: '12px' }}
            rowClassName={(record, index) => 
              index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
            }
          />
        </Card>

        <style jsx>{`
          .table-row-light {
            background-color: #ffffff;
          }
          .table-row-dark {
            background-color: #f8f9fa;
          }
          .table-row-light:hover,
          .table-row-dark:hover {
            background-color: #e3f2fd !important;
          }
        `}</style>
      </Modal>
    </>
  );
};

export default ItemsModal;