import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Tabs, 
  Input, 
  Button, 
  Dropdown, 
  Menu, 
  Modal, 
  Form, 
  message, 
  Drawer, 
  Upload, 
  Select, 
  Typography, 
  Spin,
  Popconfirm
} from 'antd';
import { SearchOutlined, EditOutlined, EllipsisOutlined, PlusOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllAgentCards, getAgentCardsByType, updateAgentCardUrl, createAgentCard, uploadLogo, deleteAgentCard } from '../../api/agents';
import './SmartAgent.css';

/**
 * 智能体组件
 * 展示智能体卡片列表，支持按类型筛选和编辑URL功能
 */
const SmartAgent = () => {
  // 用于存储卡片的URL，初始值来自agentItems
  const [cardUrls, setCardUrls] = useState({});
  // 用于存储当前编辑的卡片ID和URL
  const [editingCardId, setEditingCardId] = useState(null);
  const [editingUrl, setEditingUrl] = useState('');
  // 控制编辑URL弹窗的显示与隐藏
  const [urlModalVisible, setUrlModalVisible] = useState(false);
  // 控制删除确认弹窗的显示与隐藏
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  // 从数据库获取的卡片数据
  const [agentItems, setAgentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('sub2_tab_key_0');
  
  // 注册表单相关状态
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  const [logoFile, setLogoFile] = useState(null);
  const [uploadedLogoPath, setUploadedLogoPath] = useState(null);
  
  // 添加一个新的useState来存储图片的Base64数据
  const [logoImages, setLogoImages] = useState({});
  
  // 获取图片的Base64数据
  const fetchLogoImage = async (logoPath, cardId = null) => {
    try {
      // 如果已经获取过该图片，直接返回
      if (logoImages[logoPath]) {
        return logoImages[logoPath];
      }
      
      // 处理空路径
      if (!logoPath) {
        const defaultImage = '/src/assets/general_Agent.png';
        if (cardId) {
          setLogoImages(prev => ({
            ...prev,
            [cardId]: defaultImage
          }));
        }
        return defaultImage;
      }
      
      // 检查logoPath是否为完整URL，如果不是则构建完整URL
      let imageUrl = logoPath;
      if (!logoPath.startsWith('http://') && !logoPath.startsWith('https://')) {
        // 构建完整URL，使用环境变量中的API_BASE_URL
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        // 构建完整的图片URL，与后端cards.js中的buildLogoUrl函数保持一致
        imageUrl = `${baseUrl.replace(/\/$/g, '')}/${process.env.UPLOAD_DIR || 'uploads'}/${logoPath}`;
      }
      
      // 获取图片数据
      const response = await fetch(imageUrl);
      if (!response.ok) {
        // 如果请求失败，使用默认图片
        const defaultImage = '/src/assets/general_Agent.png';
        if (cardId) {
          setLogoImages(prev => ({
            ...prev,
            [cardId]: defaultImage
          }));
        }
        return defaultImage;
      }
      
      // 将图片数据转换为Base64
      const blob = await response.blob();
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      
      // 更新状态
      setLogoImages(prev => ({
        ...prev,
        [logoPath]: base64
      }));
      
      return base64;
    } catch (error) {
      console.error('获取图片失败:', error);
      // 出现错误时返回默认图片
      const defaultImage = '/src/assets/general_Agent.png';
      if (cardId) {
        setLogoImages(prev => ({
          ...prev,
          [cardId]: defaultImage
        }));
      }
      return defaultImage;
    }
  };

  // 处理Logo上传
  const handleLogoUpload = async ({ file, fileList }) => {
    // 设置文件状态
    setLogoFile(file);
    
    try {
      // 上传文件到服务器
      const response = await uploadLogo(file);
      console.log('上传响应数据:', response); // 调试日志
      
      // 从统一响应格式中获取文件名
      const fileName = response.data?.filename;
      
      if (fileName && typeof fileName === 'string') {
        // 只使用文件名，不使用完整路径
        setUploadedLogoPath(fileName);
        form.setFieldsValue({ logo: fileName });
        message.success('Logo上传成功');
      } else {
        // 未知响应格式
        console.error('无法识别的上传响应格式:', response);
        throw new Error('上传响应格式不正确，无法获取文件名');
      }
    } catch (error) {
      console.error('Logo上传失败:', error);
      // 只在catch中显示一次错误消息
      message.error('Logo上传失败: ' + error.message);
    }
  };
  
  // 处理注册表单提交
  const handleRegisterSubmit = async (values) => {
    try {
      // 验证必填字段 - 使用安全的方式检查值是否存在
      if (!values || !values.name || !values.name.toString().trim()) {
        message.error('智能体名称不能为空');
        return;
      }
      if (!values || !values.description || !values.description.toString().trim()) {
        message.error('智能体描述不能为空');
        return;
      }
      // 验证description长度不超过100字符
      if (values.description.toString().trim().length > 100) {
        message.error('智能体描述长度不能超过100个字符');
        return;
      }

      // 准备卡片数据，确保必填字段有有效值，按照后端SQL语句列名顺序：name, logo, description, type, corp, date, url, status
      const cardData = {
        name: values.name ? values.name.toString().trim() : '',
        logo: values.logo || '',  // 使用上传的文件路径或者默认图片路径
        description: values.description ? values.description.toString().trim() : '',
        type: values.type ? values.type.toString().trim() : 'sub2_tab_key_7',
        corp: values.corp || '未发布',
        date: values.date || '',
        url: values.url || '',
        status: values.status || '正常'
      };

      console.log('准备创建智能体卡片，数据:', cardData);

      // 调用API创建卡片
      const result = await createAgentCard(cardData);
      console.log('创建智能体卡片成功，结果:', result);
      
      message.success('注册成功');
      setIsDrawerVisible(false);
      form.resetFields();
      setLogoFile(null);
      setUploadedLogoPath(null);
      
      // 重新获取卡片数据以更新列表
      loadAgentCards();
    } catch (error) {
      console.error('注册失败:', error);
      console.error('错误详情:', error.response?.data || error.message);
      message.error('注册失败: ' + (error.response?.data?.message || error.message));
    }
  };
  
  const sub2TabItems = [
    {
      label: '全部',
      key: 'sub2_tab_key_0'
    },
    {
      label: '政务',
      key: 'sub2_tab_key_1'
    },
    {
      label: '金融',
      key: 'sub2_tab_key_2'
    },
    {
      label: '医疗',
      key: 'sub2_tab_key_3'
    },
    {
      label: '制造',
      key: 'sub2_tab_key_4'
    },
    {
      label: '零售',
      key: 'sub2_tab_key_5'
    },
    {
      label: '教育',
      key: 'sub2_tab_key_6'
    },
    {
      label: '通用',
      key: 'sub2_tab_key_7'
    }
  ];

  // 处理从数据库获取的数据 - 直接使用数据库中的logo路径
  const processAgentData = (data) => {
    return data.map(item => {
      // 直接使用原始路径，不做任何转换
      return {
        ...item,
        logo: item.logo, // 直接使用原始路径
        desc: item.description
      };
    });
  };

  // 加载卡片数据
  const loadAgentCards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (activeTab === 'sub2_tab_key_0') {
        response = await getAllAgentCards();
      } else {
        response = await getAgentCardsByType(activeTab);
      }
      
      // 直接使用返回的数据，axios拦截器已经处理了成功/失败判断
      const processedData = processAgentData(response.data);
      setAgentItems(processedData);
      
      // 初始化cardUrls状态
      const urls = {};
      processedData.forEach(item => {
        if (item.url) {
          urls[item.id] = item.url;
        }
      });
      setCardUrls(urls);
    } catch (err) {
      console.error('加载卡片数据失败:', err);
      setError(err.message || '加载数据失败');
      message.error('加载卡片数据失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 标签页切换处理
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadAgentCards();
  }, [activeTab]);
  
  // 添加删除确认事件监听
  useEffect(() => {
    const handleDeleteEvent = (event) => {
      const { item } = event.detail;
      showDeleteConfirm(item);
    };

    window.addEventListener('delete-agent', handleDeleteEvent);

    // 清理事件监听器
    return () => {
      window.removeEventListener('delete-agent', handleDeleteEvent);
    };
  }, []);
  
  // 在组件加载时预加载所有图片
  useEffect(() => {
    const preloadLogos = async () => {
      const uniqueLogos = [...new Set(agentItems.map(item => item.logo).filter(logo => logo))];
      for (const logoPath of uniqueLogos) {
        await fetchLogoImage(logoPath);
      }
    };
    
    if (agentItems.length > 0) {
      preloadLogos();
    }
  }, [agentItems]);

  // 卡片点击事件处理
  const handleCardClick = (item) => {
    if (item.url) {
      window.open(item.url, '_blank');
    }
  };

  // 显示编辑URL弹窗
  const showEditUrlModal = (item) => {
    setEditingCardId(item.id);
    setEditingUrl(item.url || '');
    setUrlModalVisible(true);
  };

  // 删除卡片处理函数
  const handleDeleteCard = async (item) => {
    try {
      const response = await deleteAgentCard(item.id);
      console.log('删除卡片响应:', response);
      // 成功的删除操作会通过axios的成功回调返回
      message.success('删除成功');
      // 重新加载卡片数据以更新列表
      loadAgentCards();
    } catch (error) {
      console.error('删除卡片失败:', error);
      message.error('删除卡片失败: ' + error.message);
    }
  };

  // 显示删除确认弹窗
  const showDeleteConfirm = (item) => {
    setDeletingItem(item);
    setDeleteModalVisible(true);
  };

  // 处理删除确认
  const handleDeleteConfirm = async () => {
    if (deletingItem) {
      await handleDeleteCard(deletingItem);
      setDeleteModalVisible(false);
      setDeletingItem(null);
    }
  };

  // 处理删除取消
  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setDeletingItem(null);
  };

  // 保存URL的异步处理函数
  const handleSaveUrl = async () => {
    if (!editingCardId) return;
    
    try {
      // API调用成功时返回更新后的卡片数据，失败时会抛出异常
      const updatedCard = await updateAgentCardUrl(editingCardId, editingUrl);
      
      // 更新本地状态
      setCardUrls(prev => ({
        ...prev,
        [editingCardId]: editingUrl
      }));
      
      // 更新agentItems中的数据
      setAgentItems(prev => prev.map(item => 
        item.id === editingCardId 
          ? { ...item, url: editingUrl }
          : item
      ));
      
      message.success('URL更新成功');
    } catch (error) {
      console.error('更新URL失败:', error);
      message.error('更新URL失败: ' + error.message);
    } finally {
      setUrlModalVisible(false);
      setEditingCardId(null);
      setEditingUrl('');
    }
  };

  // 渲染加载状态
  const renderLoading = () => (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <Spin size="large" />
    </div>
  );

  // 渲染错误状态
  const renderError = () => (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <p style={{ color: 'red', marginBottom: '16px' }}>加载失败: {error}</p>
      <Button type="primary" onClick={loadAgentCards}>
        重新加载
      </Button>
    </div>
  );

  // 渲染空数据状态
  const renderEmpty = () => (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <p>暂无数据</p>
    </div>
  );

  // 打开注册抽屉
  const showRegisterDrawer = () => {
    setIsDrawerVisible(true);
  };

  // 关闭注册抽屉
  const closeRegisterDrawer = () => {
    setIsDrawerVisible(false);
    form.resetFields();
  };

  return (
    <>
      
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        type="card"
        tabBarExtraContent={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showRegisterDrawer}
          >
            注册
          </Button>
        }
        items={sub2TabItems.map(subItem => ({
          label: subItem.label,
          key: subItem.key,
          children: (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: 16
              }}
            >
              {loading ? renderLoading() : error ? renderError() : agentItems.length === 0 ? renderEmpty() : agentItems
                .filter(item => subItem.key === 'sub2_tab_key_0' || item.type === subItem.key)
                .map((item, index) => {
                      return (
                    <Card
                      key={`card_item_${index}`}
                      style={{ cursor: (cardUrls[item.id] || item.url) ? 'pointer' : 'default' }}
                      onClick={() => handleCardClick(item)}
                    >
                      <Card.Meta
                        avatar={
                          <img 
                            src={logoImages[item.logo] || item.logo || '/src/assets/general_Agent.png'} 
                            alt={item.name} 
                            style={{ width: 32, height: 32, borderRadius: 4 }}
                            onError={(e) => {
                              // 防止默认图片也加载失败的情况
                              e.target.onerror = null;
                            }}
                          />
                        }
                        title={
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                              <span style={{ color: (cardUrls[item.id] || item.url) ? '#646cff' : 'inherit' }}>{item.name}</span>
                              <Dropdown 
                                menu={{
                                  items: [
                                    {
                                      key: 'editUrl',
                                      label: '编辑URL',
                                      onClick: (menuInfo) => {
                                        const e = menuInfo.domEvent;
                                        if (e) e.stopPropagation();
                                        showEditUrlModal(item);
                                      }
                                    },
                                    {
                                      key: 'delete',
                                      label: (
                                        <span>
                                          <DeleteOutlined style={{ marginRight: 8 }} />
                                          删除
                                        </span>
                                      ),
                                      onClick: (menuInfo) => {
                                        // 阻止事件冒泡
                                        if (menuInfo.domEvent) {
                                          menuInfo.domEvent.stopPropagation();
                                          // 阻止下拉菜单关闭
                                          menuInfo.domEvent.preventDefault();
                                        }
                                        // 触发居中删除确认
                                        setTimeout(() => {
                                          const deleteEvent = new CustomEvent('delete-agent', {
                                            detail: { item }
                                          });
                                          window.dispatchEvent(deleteEvent);
                                        }, 0);
                                      }
                                    }
                                  ]
                                }} 
                                trigger={['click']} 
                                onClick={(e) => e.stopPropagation()}
                              >
                                <SettingOutlined style={{ cursor: 'pointer', fontSize: '16px', color: '#999' }} onClick={(e) => e.stopPropagation()} />
                              </Dropdown>
                            </div>
                        }
                        description={
                          <div className="flex flex-col justify-between h-[100px]">
                            <div className="text-slate-600 line-clamp-3 overflow-hidden">{item.desc}</div>
                            <div className="text-[12px] flex justify-between mb-1">
                              <span>{item.corp}</span>
                              <span className="text-nowrap text-ellipsis overflow-hidden max-w-[calc(100%-20px)] sm:max-w-[300px]">{item.date}</span>
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  );
                })}
            </div>
          )
        }))}
      />

      {/* 编辑URL弹窗 */}
      <Modal
        title="编辑URL"
        open={urlModalVisible}
        onOk={handleSaveUrl}
        onCancel={() => setUrlModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setUrlModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleSaveUrl}>保存</Button>
        ]}
      >
        <Input
          placeholder="请输入URL"
          value={editingUrl}
          onChange={(e) => setEditingUrl(e.target.value)}
          style={{ marginBottom: 16 }}
        />
      </Modal>

      {/* 删除确认弹窗 */}
      <Modal
        title="删除确认"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="确认"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除"{deletingItem?.name}"吗？</p>
      </Modal>

      {/* 注册抽屉 */}
      <Drawer
        title="注册智能体"
        width={480}
        onClose={closeRegisterDrawer}
        open={isDrawerVisible}
        styles={{ 
          body: { 
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          } 
        }}
       
      >
        {/* 标题行 - Drawer的title属性已经提供了标题行 */}
        
        {/* 内容区域 - 可滚动 */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto',
          marginBottom: 24
        }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleRegisterSubmit}
            requiredMark={false}
          >
            <Form.Item
              name="name"
              label="名称"
              rules={[{ required: true, message: '请输入名称，不超过20个字', max: 20 }]}
            >
              <Input placeholder="请输入名称，不超过20个字" />
            </Form.Item>

            <Form.Item
              name="logo"
              label="Logo"
            >
              <div>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={() => false} // 阻止自动上传
                  onChange={handleLogoUpload}
                  fileList={logoFile ? [logoFile] : []}
                >
                  <Button icon={<PlusOutlined />}>点击上传</Button>
                </Upload>
                {logoFile && (
                  <div style={{ marginTop: 8 }}>
                    <img 
                      src={URL.createObjectURL(logoFile)} 
                      alt="logo预览" 
                      style={{ maxWidth: '100%', maxHeight: 100 }} 
                    />
                  </div>
                )}
              </div>
            </Form.Item>

            <Form.Item
              name="description"
              label="描述"
            >
              <Input.TextArea 
                placeholder="请输入描述" 
                autoSize={{ minRows: 3, maxRows: 6 }} 
              />
            </Form.Item>

            <Form.Item
              name="type"
              label="分类"
            >
              <Select placeholder="请选择分类">
                <Select.Option value="sub2_tab_key_1">政务</Select.Option>
                <Select.Option value="sub2_tab_key_2">金融</Select.Option>
                <Select.Option value="sub2_tab_key_3">医疗</Select.Option>
                <Select.Option value="sub2_tab_key_4">制造</Select.Option>
                <Select.Option value="sub2_tab_key_5">零售</Select.Option>
                <Select.Option value="sub2_tab_key_6">教育</Select.Option>
                <Select.Option value="sub2_tab_key_7">通用</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="corp"
              label="状态"
              initialValue="未发布"
            >
              <Select>
                <Select.Option value="未发布">未发布</Select.Option>
                <Select.Option value="已发布">已发布</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="url"
              label="URL"
            >
              <Input placeholder="请输入URL" />
            </Form.Item>

            <Form.Item
              name="date"
              label="使用模型"
            >
              <Input placeholder="请输入使用的模型" />
            </Form.Item>
          </Form>
        </div>
        
        {/* 按钮区域 - 固定在底部 */}
        <div style={{ 
          borderTop: '1px solid #f0f0f0',
          paddingTop: 16,
          textAlign: 'right'
        }}>
          <Button onClick={closeRegisterDrawer} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button type="primary" htmlType="submit" onClick={form.submit}>
            提交
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default SmartAgent;