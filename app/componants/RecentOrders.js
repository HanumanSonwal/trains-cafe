import { Button, Card, Carousel } from "antd";
import { PhoneOutlined } from "@ant-design/icons";

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
              // style={{ top: '-20px' }}
            />
            <h2 className="text-2xl relative  text-[#704D25] font-bold z-10">
              Recent Orders
            </h2>
          </div>

          <Carousel autoplay className="carousel-container">
            <div className="flex flex-row space-x-6 recent-order-sl p-2">
              <Card className="flex-shrink-0 w-[calc(50%-1.5rem)] rounded-lg shadow-md">
                <p className="text-gray-600 text-sm ">
                  <span className="font-bold">Mamta Nagar</span> In publishing
                  and graphic design, Lorem ipsum is a placeholder text commonly
                </p>
              </Card>
              <Card className="flex-shrink-0 w-[calc(50%-1.5rem)]  rounded-lg shadow-md">
                <p className="text-gray-600 text-sm ">
                  <span className="font-bold"> Nagar</span> In publishing and
                  graphic design, Lorem ipsum is a placeholder text commonly
                </p>
              </Card>
            </div>
            <div className="flex flex-row space-x-6 recent-order-sl p-2">
              <Card className="flex-shrink-0 w-[calc(50%-1.5rem)]  rounded-lg shadow-md">
                <p className="text-gray-600 text-sm">
                  <span className="font-bold">hello</span> In publishing and
                  graphic design, Lorem ipsum is a placeholder text commonly
                </p>
              </Card>
              <Card className="flex-shrink-0 w-[calc(50%-1.5rem)] rounded-lg shadow-md">
                <p className="text-gray-600 text-sm ">
                  <span className="font-bold">hy</span> In publishing and
                  graphic design, Lorem ipsum is a placeholder text commonly
                </p>
              </Card>
            </div>
          </Carousel>
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
            className="w-2/3 my-4"
          />

          <Button
            type="btn"
            icon={<PhoneOutlined />}
            className="bg-[#704D25] text-[#FFFFFF] hover:bg-[#ffffff] hover:text-[#704D25] border-none flex items-center justify-center px-6 py-2 text-sm font-[600] rounded-full"
          >
            Order via call
          </Button>
        </div>
      </div>
    </div>
  );
}
