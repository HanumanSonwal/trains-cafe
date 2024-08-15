import { Layout, Menu } from 'antd';

import Image from 'next/image';
import Menubar from './Menubar';

const { Sider } = Layout;

const Sidebar = ({ collapsed ,width}) => (
  <Sider className=''  theme='light'  trigger={null} collapsible collapsed={collapsed }  width={width}>
    <div className="logo" style={{ textAlign: 'center', padding: '10px' }}>
      <Image src="/images/logo.jpg" alt="Logo" width={500} height={500} />
    </div>
 <Menubar/>
  </Sider>
);

export default Sidebar;

// import Image from 'next/image';
// import Menubar from './Menubar';

// const Sidebar = ({ collapsed }) => (
//   <div 
//     className={`bg-white h-screen transition-all duration-300 ease-in-out fixed top-0 ${
//       collapsed ? 'w-30' : 'w-[256px]'
//     }`}
//   >
//     <div className="flex justify-center items-center p-4">
//       <Image 
//         src="/images/logo2.jpg" 
//         alt="Logo" 
//         width={collapsed ? 40 : 80} 
//         height={collapsed ? 40 : 80}
//         className="transition-all duration-300 ease-in-out"
//       />
//     </div>
//     <Menubar collapsed={collapsed} />
//   </div>
// );

// export default Sidebar;



