// import { Layout, Menu } from 'antd';

// import Image from 'next/image';
// import Menubar from './Menubar';

// const { Sider } = Layout;

// const Sidebar = ({ collapsed ,width}) => (
//   <Sider className=''  theme='light'  trigger={null} collapsible collapsed={collapsed }  width={width}>
//     <div className="logo" style={{ textAlign: 'center', padding: '10px' }}>
//       <Image src="/images/logo.jpg" alt="Logo" width={500} height={500} />
//     </div>
//  <Menubar/>
//   </Sider>
// );

// export default Sidebar;


import { Layout } from 'antd';
import Image from 'next/image';
import Menubar from './Menubar';

const { Sider } = Layout;

const Sidebar = ({ collapsed, width }) => (
  <Sider
    theme="light"
    trigger={null}
    collapsible
    collapsed={collapsed}
    width={width}
    className="!h-screen !overflow-hidden"
  >
    <div className="text-center p-3">
      <Image src="/images/logo.jpg" alt="Logo" width={500} height={500} />
    </div>
    <div className="h-[calc(100vh-90px)] overflow-y-auto px-2">
      <Menubar />
    </div>
  </Sider>
);

export default Sidebar;



