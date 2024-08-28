"use client";
import { useState } from 'react';
import { Radio, Input, Button, Form, Typography } from 'antd';

const { Title, Text } = Typography;

export default function OrderForm() {
  const [orderType, setOrderType] = useState('PNR');

  const handleOrderTypeChange = (e) => {
    setOrderType(e.target.value);
  };

  const onFinish = (values) => {
    console.log('Received values:', values);
   
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-md mt-4 mx-4">
      <Title level={3} className="text-center">Order Food in Train</Title>
      <Form layout="vertical" onFinish={onFinish} className="text-center">
        <Form.Item>
          <Radio.Group
            value={orderType}
            onChange={handleOrderTypeChange}
            className="flex justify-center mb-4"
          >
            <Radio value="PNR">PNR</Radio>
            <Radio value="TRAIN_NAME_NO">TRAIN NAME/NO.</Radio>
            <Radio value="STATION">STATION</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="identifier"
          rules={[{ required: true, message: 'Please input your PNR or other identifier!' }]}
          className="flex justify-center"
        >
          <Input.Group compact className="flex items-center">
            <Input
              style={{ width: '70%', borderRadius: '30px 0 0 30px', height: '40px' }}
              placeholder={`Enter ${
                orderType === 'PNR' ? 'PNR Number' : orderType === 'TRAIN_NAME_NO' ? 'Train Name/No.' : 'Station'
              } to Order`}
            />
            <Button
              type="primary"
              htmlType="submit"
              style={{
                borderRadius: '0 30px 30px 0',
                height: '40px',
                backgroundColor: 'black',
                border: 'none',
              }}
            >
              Submit
            </Button>
          </Input.Group>
        </Form.Item>
      </Form>
      <Text type="secondary" className="text-center block mt-2">
        Official IRCTC Partner
      </Text>
    </div>
  );
}

  