import { Button } from "antd";

export default function Articles() {
  return (
    <div className="py-8 px-2 mx-auto max-w-[575px] bg-gray-100 rounded-md mb-3">
      <div className="relative text-center mb-8">
        <img
          src="/images/Articles.png"
          alt="Blog Title Background"
          className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2/3"
          // style={{top:'24px'}}
        />
        <h2 className="text-2xl font-bold relative z-10 text-[#704D25]">
          Latest Articles
        </h2>
      </div>

      <div className="text-center">
        <h2 className="font-bold mb-3">Article full heading</h2>
        <p className="text-sm mb-5">
          In publishing and graphic design, Lorem ipsum is a placeholder text
          commonly used to demonstrate the visual form of a document or a
          typeface without relying on meaningful content. Lorem ipsum may be
          used as a placeholder before the final copy is available. In
          publishing and graphic design, Lorem ipsum is a placeholder text
          commonly used to demonstrate the visual form of a document or a
          typeface without relying on meaningful content.{" "}
        </p>
        <Button
          type="btn"
           className='order-btn border-none rounded-full px-4 py-2 text-xs font-[600] hover:bg-[#D49929] hover:text-[#ffffff]'
        >
          View More
        </Button>
      </div>
    </div>
  );
}
