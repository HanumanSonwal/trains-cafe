import React, { useState } from "react";
import { Modal, Table, Button } from "antd";

const ItemsModal = ({ items }) => {
  const [visible, setVisible] = useState(false);

  const columns = [
    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: "quantity",
    },
    {
      title: "Item Name",
      dataIndex: ["MenuItem", "Item_Name"],
      key: "itemName",
      render: (text) => text || "Unnamed Item",
    },
    {
      title: "Category",
      dataIndex: ["MenuItem", "Category", "Title"],
      key: "category",
      render: (text) => text || "N/A",
    },
    {
      title: "Price",
      dataIndex: ["MenuItem", "Price"],
      key: "price",
      render: (price, record) => `₹${price || record.Price || 0}`,
    },
    {
      title: "Description",
      dataIndex: ["MenuItem", "Description"],
      key: "description",
      render: (text) => text || "N/A",
    },
  ];

  return (
    <>
      <Button type="link" onClick={() => setVisible(true)}>
        View All Items ({items.length})
      </Button>
      <Modal
        title="Order Items"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={700}
      >
        <Table
          dataSource={items.map((item, idx) => ({ ...item, key: idx }))}
          columns={columns}
          pagination={false}
          size="small"
        />
      </Modal>
    </>
  );
};

export default ItemsModal;
