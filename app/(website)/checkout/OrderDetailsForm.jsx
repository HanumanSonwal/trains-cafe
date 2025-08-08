import { Input, Form, Row, Col, Divider } from "antd";

const OrderDetailsForm = () => {
  return (
    <div className="bg-white shadow rounded-lg p-2 sm:p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Customer Order Details
      </h2>

      <Divider orientation="left">User Details</Divider>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="mobile"
            label="Mobile Number"
            style={{ marginBottom: 12 }}
            rules={[
              { required: true, message: "Mobile number is required" },
              {
                pattern: /^\d{10}$/,
                message: "Enter a valid 10-digit mobile number",
              },
            ]}
          >
            <Input placeholder="Mobile Number" maxLength={10} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            name="name"
            label="Name"
            style={{ marginBottom: 12 }}
            rules={[
              { required: true, message: "Name is required" },
              {
                pattern: /^[A-Za-z\s]+$/,
                message: "Name should contain only letters",
              },
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            name="email"
            label="Email"
            style={{ marginBottom: 12 }}
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            name="alternateMobile"
            label="Alternate Mobile (Optional)"
            style={{ marginBottom: 12 }}
            rules={[
              {
                pattern: /^\d{10}$/,
                message: "Enter a valid 10-digit mobile number",
              },
            ]}
          >
            <Input placeholder="Alternate Mobile" maxLength={10} />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Train Details</Divider>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="pnr"
            label="PNR"
            style={{ marginBottom: 12 }}
            rules={[
              { required: true, message: "PNR is required" },
              {
                pattern: /^\d{10}$/,
                message: "PNR must be exactly 10 digits",
              },
            ]}
          >
            <Input placeholder="Enter 10 Digit PNR" maxLength={10} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            name="trainNo"
            label="Train Number"
            style={{ marginBottom: 12 }}
            rules={[
              { required: true, message: "Train number is required" },
              {
                pattern: /^\d{5}$/,
                message: "Train number should be exactly 5 digits only",
              },
            ]}
          >
            <Input placeholder="Train Number" maxLength={5} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item name="coach" label="Coach" style={{ marginBottom: 12 }}>
            <Input placeholder="Coach" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            name="seatNo"
            label="Seat No."
            style={{ marginBottom: 12 }}
          >
            <Input placeholder="Seat No." />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="instructions"
            label="Optional Instructions"
            style={{ marginBottom: 0 }}
          >
            <Input.TextArea placeholder="Optional Instructions" rows={3} />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetailsForm;
