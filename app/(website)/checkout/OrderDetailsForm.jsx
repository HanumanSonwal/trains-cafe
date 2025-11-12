import { Input, Form, Row, Col, Divider } from "antd";

const OrderDetailsForm = ({ createLead, updateLead, form }) => {
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
              { pattern: /^\d{10}$/, message: "Enter 10 digit mobile number" },
            ]}
          >
            <Input
              placeholder="Mobile Number"
              maxLength={10}
              onBlur={() => {
                const mobile = form.getFieldValue("mobile");
                if (mobile?.length === 10) createLead(mobile);
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item name="name" label="Name" style={{ marginBottom: 12 }}>
            <Input
              placeholder="Name"
              onBlur={() => updateLead(form.getFieldsValue())}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item name="email" label="Email" style={{ marginBottom: 12 }}>
            <Input
              placeholder="Email"
              onBlur={() => updateLead(form.getFieldsValue())}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            name="alternateMobile"
            label="Alternate Mobile (Optional)"
            style={{ marginBottom: 12 }}
          >
            <Input
              placeholder="Alternate Mobile"
              maxLength={10}
              onBlur={() => updateLead(form.getFieldsValue())}
            />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Train Details</Divider>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item name="pnr" label="PNR" style={{ marginBottom: 12 }}>
            <Input
              placeholder="Enter 10 Digit PNR"
              maxLength={10}
              onBlur={() => updateLead(form.getFieldsValue())}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            name="trainNo"
            label="Train Number"
            style={{ marginBottom: 12 }}
          >
            <Input
              placeholder="Train Number"
              maxLength={5}
              onBlur={() => updateLead(form.getFieldsValue())}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item name="coach" label="Coach" style={{ marginBottom: 12 }}>
            <Input
              placeholder="Coach"
              onBlur={() => updateLead(form.getFieldsValue())}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            name="seatNo"
            label="Seat No."
            style={{ marginBottom: 12 }}
          >
            <Input
              placeholder="Seat No."
              onBlur={() => updateLead(form.getFieldsValue())}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="instructions"
            label="Optional Instructions"
            style={{ marginBottom: 0 }}
          >
            <Input.TextArea
              rows={3}
              placeholder="Optional Instructions"
              onBlur={() => updateLead(form.getFieldsValue())}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetailsForm;
