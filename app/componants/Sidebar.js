import { Layout, Menu } from 'antd';

import Image from 'next/image';
import Menubar from './Menubar';

const { Sider } = Layout;

const Sidebar = ({ collapsed ,width}) => (
  <Sider className=''  theme='light'  trigger={null} collapsible collapsed={collapsed }  width={width}>
    <div className="logo" style={{ textAlign: 'center', padding: '20px' }}>
      <Image src="/images/logo.jpg" alt="Logo" width={500} height={500} />
    </div>
 <Menubar/>
  </Sider>
);

export default Sidebar;


