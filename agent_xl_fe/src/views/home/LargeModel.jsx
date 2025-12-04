import { Avatar, Divider, Tabs } from 'antd';
import deepseek from '../../assets/deepseek.svg';
import qwen from '../../assets/qwen.png';

/**
 * 大模型组件
 * 展示当前应用模型和本机模型列表
 */
const LargeModel = () => {
  // 模型数据列表
  const modelItems = [
    {
      name: 'DeepSeek-R1-Distill-Qwen-32B',
      logo: deepseek,
      feat: '文本生成',
      corp: 'Alibaba',
      date: '2025/07/20'
    },
    {
      name: 'DeepSeek-R1-Distill-Qwen-14B',
      logo: qwen,
      feat: '文本生成',
      corp: 'Alibaba',
      date: '2025/07/20'
    },
    {
      name: 'DeepSeek-R1-Distill-Qwen-7B',
      logo: qwen,
      feat: '文本生成',
      corp: 'Alibaba',
      date: '2025/07/20'
    }
  ];

  return (
    <>
      <div className="model-card flex items-center mt-[18px]">
        <Avatar src={modelItems[2].logo} />
        <div className="desc flex-col justify-center items-start text-left m-[8px]">
          <div>{modelItems[2].name}</div>
          <div className="text-slate-400 text-[12px] flex justify-between gap-[4px]">
            <span>{modelItems[2].feat}</span>
            <span>{modelItems[2].corp}</span>
            <span>{modelItems[2].date}</span>
          </div>
        </div>
      </div>
      <Divider />
      <Tabs
        type="card"
        items={[
          {
            label: `本机模型`,
            key: 'tab_key_0',
            children: (
              <div className="flex justify-around">
                {modelItems.map((item, index) => (
                  <div className="model-card flex items-center" key={`mode_list_item_${index}`}>
                    <Avatar src={item.logo} />
                    <div className="desc flex-col justify-center items-start text-left m-[8px]">
                      <div>{item.name}</div>
                      <div className="text-slate-400 text-[12px] flex justify-between gap-[4px]">
                        <span>{item.feat}</span>
                        <span>{item.corp}</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ),
          }
        ]}
      />
    </>
  );
};

export default LargeModel;