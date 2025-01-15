import { Button, Card } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function RecentOrders() {
  return (
    <div className="py-8 px-4 max-w-[575px] mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between items-start space-y-6 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-2/3 py-6">
          <div className="relative mb-4 text-center">
            <img
              src="/images/Recent.png"
              alt="Recent"
              className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2/3"
            />
            <h2 className="text-2xl relative text-[#704D25] font-bold z-10">
              Recent Orders
            </h2>
          </div>

          {/* Smooth Continuous Slider */}
          <div className="overflow-hidden relative">
            <div className="flex animate-scroll space-x-6">
              {[...Array(6)].map((_, i) => (
                <Card
                  key={i}
                  className="flex-shrink-0 w-[calc(50%-1.5rem)] rounded-lg shadow-md"
                >
                  <p className="text-gray-600 text-sm">
                    <span className="font-bold">Order {i + 1}</span> In
                    publishing and graphic design, Lorem ipsum is a placeholder
                    text commonly
                  </p>
                </Card>
              ))}
              {/* Duplicate the cards for infinite scrolling */}
              {[...Array(6)].map((_, i) => (
                <Card
                  key={`duplicate-${i}`}
                  className="flex-shrink-0 w-[calc(50%-1.5rem)] rounded-lg shadow-md"
                >
                  <p className="text-gray-600 text-sm">
                    <span className="font-bold">Order {i + 1}</span> In
                    publishing and graphic design, Lorem ipsum is a placeholder
                    text commonly
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Order Food On Call Section */}
        <div
          className="w-full md:w-1/2 rounded-lg p-4 flex flex-col items-center justify-between bg-[#8B4513] text-white bg-cover bg-center"
          style={{
            minHeight: "300px",
            backgroundImage: 'url("/images/order-bg.png")',
            backgroundSize: "cover",
          }}
        >
          <h2 className="font-bold text-2xl text-white text-center">
            Order Food On Call
          </h2>

          <img
            src="/images/order-vector.png"
            alt="Person Ordering Food"
            className="my-4"
          />
          <Link href="tel:090909090">
            <Button
              type="btn"
              icon={<PhoneOutlined />}
              className="common-btn border-none flex items-center justify-center text-sm font-[600] rounded-full"
            >
              Order via call
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
