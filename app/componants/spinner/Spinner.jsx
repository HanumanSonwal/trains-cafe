// // import "../globals.css";
// import "./Spinner.css"

// const Spinner = ({ color }) => {
//   return (
//     <div className="container">
//       <div className="spinner"></div>
//     </div>
//   );
// };

// export default Spinner;


// import "../globals.css";
import "./Spinner.css";
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Spinner = ({ color }) => {
  return (
    <div className="container">
      <div>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: color }} spin />} />
      </div>
    </div>
  );
};

export default Spinner;
