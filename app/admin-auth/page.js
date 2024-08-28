"use client";
import React from "react";
import { Button, Checkbox, Form, Grid, Input, theme, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import "@/app/globals.css"; // Import the CSS file

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

export default function App() {
  const { token } = useToken();
  const screens = useBreakpoint();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const dynamicStyles = {
    "--padding": screens.md ? `${token.paddingXL}px` : `${token.sizeXXL}px ${token.padding}px`,
    "--margin-lg": token.marginLG,
    "--margin-xl": token.marginXL,
    "--color-bg-container": token.colorBgContainer,
    "--height": screens.sm ? "100vh" : "auto",
    "--padding-section": screens.md ? `${token.sizeXXL}px 0px` : "0px",
    "--color-text-secondary": token.colorTextSecondary,
    "--font-size-title": screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
  };

  return (
    <section className="section" style={dynamicStyles}>
      <div className="container">
        <div className="header">
        

          <Title className="title">Sign in</Title>
          <Text className="text">
            Welcome back to AntBlocks UI! Please enter your details below to
            sign in.
          </Text>
        </div>
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a className="forgotPassword" href="">
              Forgot password?
            </a>
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button block type="primary" htmlType="submit">
              Log in
            </Button>
            <div className="footer">
              <Text className="text">Dont have an account?</Text>{" "}
              <Link href="">Sign up now</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}
