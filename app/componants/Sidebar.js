import { Layout, Menu } from 'antd';

import Image from 'next/image';
import Menus from './Menus';

const { Sider } = Layout;

const Sidebar = ({ collapsed ,width}) => (
  <Sider  theme='light' trigger={null} collapsible collapsed={collapsed }  width={width}>
    <div className="logo" style={{ textAlign: 'center', padding: '20px' }}>
      <Image src="/next.svg" alt="Logo" width={80} height={40} />
    </div>
 <Menus/>
  </Sider>
);

export default Sidebar;