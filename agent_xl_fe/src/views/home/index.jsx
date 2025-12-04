import { useState } from 'react';
import { Menu } from 'antd';
import { AppstoreOutlined, OpenAIOutlined, ReadOutlined } from '@ant-design/icons';
import reactLogo from '../../assets/logo.png';
import './index.module.css';

// 导入拆分后的组件
import SmartAgent from './SmartAgent.jsx';
import LargeModel from './LargeModel.jsx';
import KnowledgeBase from './KnowledgeBase.jsx';

/**
 * 首页主组件
 * 包含菜单导航和根据菜单切换不同功能模块
 */
function Home() {
  // 当前选中的菜单
  const [curMenu, setCurMenu] = useState('sub2');
  
  /**
   * 菜单点击事件处理
   * @param {Object} e - 菜单点击事件对象
   */
  const onClick = (e) => {
    console.log('click', e);
    setCurMenu(e.key || '');
  };
  
  // 菜单配置项
  const menuItems = [
    {
      key: 'sub2',
      label: '智能体',
      subtitle: '智能体',
      icon: <AppstoreOutlined />,
    },
    {
      type: 'divider',
      subtitle: '',
    },
    {
      key: 'sub1',
      label: '大模型',
      subtitle: '当前应用模型',
      icon: <OpenAIOutlined />,
    },
    {
      type: 'divider',
      subtitle: '',
    },
    {
      key: 'sub5',
      label: '知识库',
      subtitle: '知识库',
      icon: <ReadOutlined />,
    },
  ];
  
  /**
   * 根据当前菜单渲染对应的组件
   * @returns {React.ReactNode} 渲染的组件
   */
  const renderContent = () => {
    switch (curMenu) {
      case 'sub1':
        return <LargeModel />;
      case 'sub2':
        return <SmartAgent />;
      case 'sub5':
        return <KnowledgeBase />;
      default:
        return <SmartAgent />;
    }
  };

  return (
    <>
      <header className="bg-white w-full">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <img src={reactLogo} alt="logo" className="w-[127px] h-[28px]" />
          </div>
        </div>
      </header>
      <div className="flex mt-[18px] w-full">
        {/* 左侧菜单 */}
        <Menu
          onClick={onClick}
          style={{ width: 192, height: 'calc(100vh - 88px)' }}
          defaultSelectedKeys={['sub2']}
          mode="inline"
          items={menuItems}
        />
        {/* 右侧内容区域 */}
        <div 
          className="ml-[18px] bg-white px-[24px] py-[12px] flex-1" 
          style={{ height: 'calc(100vh - 88px)', overflowY: 'scroll' }}
        >
          {renderContent()}
        </div>
      </div>
    </>
  );
}

export default Home;
