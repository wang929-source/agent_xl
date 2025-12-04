import { Card, Tooltip, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import knldge_icon0 from '../../assets/knldge_icon0.png';
import knldge_icon1 from '../../assets/knldge_icon1.png';
import knldge_icon2 from '../../assets/knldge_icon2.png';
import knldge_icon3 from '../../assets/knldge_icon3.png';
import knldge_icon4 from '../../assets/knldge_icon4.png';
import knldge_icon5 from '../../assets/knldge_icon5.png';
import knldge_icon6 from '../../assets/knldge_icon6.png';
import knldge_icon7 from '../../assets/knldge_icon7.png';
import knldge_icon8 from '../../assets/knldge_icon8.png';
import huagege from '../../assets/huagege.png';

const { Meta, Paragraph } = Card;

/**
 * 知识库组件
 * 展示知识库卡片列表，支持点击查看详情
 */
const KnowledgeBase = () => {
  // 知识库数据列表
  const knowledgeItems = [
    {
      id: '01981312-4647-7b68-9bfc',
      logo: knldge_icon0,
      name: '保险条款',
      desc: '包含各类保险的条款内容',
      corp: '北京华胜天成科技股份有限公司',
      date: '2025-07-15 更新'
    },
    {
      id: '0197643d-0648-7e83-b820',
      logo: knldge_icon1,
      name: '人员信息表结构',
      desc: '人员信息字段说明',
      corp: '北京华胜天成科技股份有限公司',
      date: '2025-06-12 更新'
    },
    {
      id: '019760ee-7565-7238-a268',
      logo: knldge_icon2,
      name: '招聘信息表结构',
      desc: '招聘信息字段说明',
      corp: '北京华胜天成科技股份有限公司',
      date: '2025-06-12 更新'
    },
    {
      id: '01976124-b313-7170-a0af',
      logo: knldge_icon3,
      name: '纺机社区创业资源支持',
      desc: '用于支持创业的场地资源',
      corp: '北京华胜天成科技股份有限公司',
      date: '2025-06-12 更新'
    },
    {
      id: '01976119-58e7-7874-a888',
      logo: knldge_icon4,
      name: '培训机构信息表结构',
      desc: '培训机构信息字段说明',
      corp: '北京华胜天成科技股份有限公司',
      date: '2025-06-12 更新'
    },
    {
      id: '01973dc4-e866-7b3c-a64a',
      logo: knldge_icon5,
      name: '就业创业政策知识库',
      desc: '郑州市针对未就业、灵活社保人员以及个人创业、小微企业创业的政策知识库',
      corp: '北京华胜天成科技股份有限公司',
      date: '2025-06-05 更新'
    },
    {
      id: '019760ea-9374-7afd-903f',
      logo: knldge_icon6,
      name: '房屋信息表结构',
      desc: '房屋信息字段说明',
      corp: '北京华胜天成科技股份有限公司',
      date: '2025-06-12 更新'
    },
    {
      id: '01956f13-9d4d-7d90-96b4',
      logo: knldge_icon8,
      name: '地方医保政策',
      desc: '以廊坊市医保政策为示例',
      corp: '北京华胜天成科技股份有限公司',
      date: '2025-06-22 更新'
    },
    {
      id: '01956f13-9d4d-7d90-96b8',
      logo: knldge_icon3,
      name: '中原区招聘信息',
      desc: '郑州市中原区招聘信息汇总',
      corp: '北京华胜天成科技股份有限公司',
      date: '2025-06-22 更新'
    },
    {
      id: '019760ee-7565-7238-a268',
      logo: knldge_icon7,
      name: '青岛市文化和旅游局政府信息',
      desc: '青岛市文化和旅游局政府信息公开工作年度报告',
      corp: '北京华胜天成科技股份有限公司',
      date: '2025-06-18 更新'
    },
    {
      id: '01956f13-9d4d-7d90-96b1',
      logo: knldge_icon8,
      name: '城市治理应用综合知识库',
      desc: '集成多源数据构建一个全面的知识库。知识库包含城市治理相关的政策法规、历史数据、实时信息等，涵盖各种专业领域的知识，如交通管理、环境监测、公共安全等。知识库的数据在构建过程中经过采集、清洗、整合和建模等步骤以确保数据的准确性和一致性。',
      corp: '北京华胜天成科技股份有限公司',
      date: '2025-07-03 更新'
    },
    {
      id: '01956f13-9d4d-7d90-96b2',
      logo: knldge_icon8,
      name: '幸福长者食堂明细表',
      desc: '关于幸福长者食堂详细信息的汇总',
      corp: '北京华胜天成科技股份有限公司',
      date: '2025-06-20 更新'
    },
    {
      id: '01981312-4647-7b68-9bfd',
      logo: huagege,
      name: '华格格政府公文',
      desc: '满足15种公文类型的撰写需求，能进行新写、续写、扩写、重写、缩写、润色、校对等操作。',
      corp: '已发布',
      date: 'QWEN-32B',
      url: 'http://192.168.2.225:8081/chat/KNAqkJC1biMwutou'
    }
  ];

  // 处理卡片点击事件
  const handleCardClick = () => {
    window.location.href = 'https://hiagent.volcenginepaas.com/product/llm/personal/personal-2604/knowledge/01978108-4cfd-70ef-b6af-c2841c60982b';
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 16
      }}
    >
      {knowledgeItems.map((item, index) => (
        <Card
          key={`card_item_${index}`}
          style={{cursor: 'pointer'}}
          onClick={handleCardClick}
        >
          <Meta
            avatar={<img src={item.logo} alt={item.name} style={{ width: 32, height: 32 }} />}
            title={
              <>
                {item.name}
                <Tooltip title={
                  <Paragraph copyable={{ text: item.id }} style={{ color: 'white', fontSize: 10 }}>
                    ID: {item.id}
                  </Paragraph>
                }>
                  <InfoCircleOutlined className="ml-[4px] text-[12px]"/>
                </Tooltip>
              </>
            }
            description={
              <div className="flex-col justify-between">
                <div className="mb-[40px] text-slate-600 text-nowrap text-ellipsis overflow-hidden">
                  {item.desc}
                </div>
                <div className="text-[12px] flex justify-between">
                  <span>{item.corp}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            }
            className="flex-col justify-start text-left"
          />
        </Card>
      ))}
    </div>
  );
};

export default KnowledgeBase;