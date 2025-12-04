import { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom"
import knldge_icon0 from '../../assets/knldge_icon0.png'
import { ArrowUpOutlined, CommentOutlined, UploadOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import style from './index.module.css'
import { Alert, Button, Upload, Input, message, Menu, Spin} from 'antd'
import { createConversation, chatQuery, getAppPreview } from '../../api/chat'
import { isJsonString } from '../../util/helps'

const { TextArea } = Input;
const UserID ='1';

const App = () => {
  const navigate = useNavigate();
  const readerRef = useRef(null)
  const messagesEndRef = useRef(null);

  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true)
  const [fileList, setFileList] = useState([
    // {
    //   uid: '-1',
    //   name: 'xxx.png',
    //   status: 'done',
    //   url: 'http://www.baidu.com/xxx.png',
    // },
  ]);
  const [curReply, setCurReply] = useState('spin')
  const [conversationID, setConversationID] = useState('')
  const [curItemIdx, setCurItemIdx] = useState(0)
  const [curMenu, setCurMenu] = useState('sub1')
  const [agentCfg, setAgentCfg] = useState({})
  const [qaInfos, setQaInfos] = useState([
    // {
    //   flag: 'answer',
    //   content: '我是面试小助手，可以帮你解答关于面试的相关问题，你有什么问题都可以向我提问~'
    // }
  ])

  const [inputContent, setInputContent] = useState('')


  const [isReplying, setIsReplying] = useState(false)

  const error = (msg) => {
    messageApi.open({
      type: 'error',
      content: msg,
    });
  };

  const onClick = (e) => {
    console.log('click', e)
    for (let index = 0; index < items.length; index++) {
      const element = items[index];
      if (element.key === e.key) {
        setCurItemIdx(index)
      }
    }
    setCurMenu(e.key || '')
  }

  const handleSendMsg = async () => {
    if (isReplying) {
      return;
    }
    if (inputContent === '') {
      error('提问内容不能为空')
      return
    }
    setIsReplying(true);
    setQaInfos(prev => [...prev, { flag: 'ask', content: inputContent }]);
    setInputContent('');
    let answerObj = {
      flag: 'answer',
      content: ''
    };
    let res = await chatQuery({
      AppConversationID: conversationID,
      Query: inputContent,
      UserID: "1",
      ResponseMode: "streaming",
      QueryExtends: {}
    })

    if (res?.ok) {
      readerRef.current = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let streamRes = await readerRef.current.read();
      while (!streamRes.done) {
        const chunk = decoder.decode(streamRes.value, { stream: true });
        console.log('收到一段数据:', chunk);
        let regex = /data:\s*(\{.*?\})\s*$/gm;
        let replyArr = [...chunk.matchAll(regex)].map(m => m[1]);
        if (replyArr?.length > 0) {
          replyArr = replyArr.forEach(item => {
            if (isJsonString(item)) {
              if (JSON.parse(item)?.event === 'message_start') {
                setQaInfos(prev => [...prev, answerObj]);
              }
              if (JSON.parse(item)?.event === 'message') {
                setCurReply(''); // 触发react重新渲染
                // answerObj.content = '';
              }
              answerObj.content += JSON.parse(item)?.answer || '';
              setCurReply(answerObj.content); // 触发react重新渲染
            }
          })
        }
        streamRes = await readerRef.current.read();
      }
      if (streamRes.done) {
        console.log('✅ 流读取完毕');
        setIsReplying(false);
        setCurReply(answerObj.content); // 触发react重新渲染
      }
    }
  }

  const handleChange = info => {
    let newFileList = [...info.fileList];
    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    newFileList = newFileList.slice(-2);
    // 2. Read from response and show file link
    newFileList = newFileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });
    setFileList(newFileList);
  };

  const items = [
    {
      key: 'sub1',
      label: '当前对话',
      subtitle: '当前对话',
      icon: <CommentOutlined />,
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const props = {
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange: handleChange,
    multiple: true,
  };

  useEffect(() => {
    Promise.all([getAppPreview({
      UserID
    }), createConversation({
      UserID
    })]).then(res => {
      setLoading(false)
      if (res[0].status === 200 && res[1].status === 200) {
        setAgentCfg({
          name: res[0].data.Name,
          openMsg: res[0].data.OpenMessage
        })
        setConversationID(res[1].data.Conversation.AppConversationID)
      } else {
        error('会话创建失败，请刷新重试')
      }
    })
  }, [])

  useEffect(() => {
    scrollToBottom();
  }, [qaInfos, curReply]);

  return (
    <>
    {contextHolder}
    {
      loading ?
      <Spin tip="会话创建中..." fullscreen>
        <Alert
          message="Alert message title"
          description="Further details about the context of this alert."
          type="info"
        />
      </Spin> :
      <div
        className="flex h-screen"
      >
        <div
          style={{
            backgroundColor: 'white',
            flex: '0 0 240px'
          }}
        >
          <div
            className="flex items-center justify-center w-[100%] py-[24px]"
            onClick={() => {
              /* navigate(-1); */
              window.location.href = "http://192.168.2.225/"
            }}
          >
            <Button className="w-[120px]" type="primary">返回</Button>
          </div>
          <Menu
            onClick={onClick}
            style={{ height: 'calc(100vh - 88px)', textAlign: 'left' }}
            defaultSelectedKeys={[curMenu]}
            mode="inline"
            items={items}
          />
        </div>
        <div className="container bg-white pt-[100px] flex flex-col relative" style={{ height: '100vh', overflowY: 'hidden' }}>
          <div className="flex items-center justify-center absolute w-[100%] top-[12px]">
            <img src={knldge_icon0} className={style["logo"]} />
            <div className="text-[28px]">
              {agentCfg.name}
            </div>
          </div>
          <div className="shrink grow overflow-y-scroll px-[120px] flex flex-col mb-[124px]"> 
            <div className="text-left text-[12px] mb-[48px] text-gray-500">
              {agentCfg.openMsg}
            </div>
            {
              qaInfos.map((item, index) => {
                return <div className={`${style.item} ${item.flag === 'ask' ? style['right'] : ''}`} key={`qa_item_${index}`}>
                  <ReactMarkdown>{
                  item.content
                }</ReactMarkdown></div>
              })
            }
            <div ref={messagesEndRef} />
          </div>
          <div style={{
            position: 'absolute',
            backgroundColor: 'white',
            marginBottom: 48,
            paddingBottom: 48,
            alignSelf: 'stretch',
            left: 120,
            right: 120,
            bottom: 0,
            border: '1px solid #d9d9d9',
            borderRadius: 6
          }}>
            <TextArea
              value={inputContent}
              onChange={e => setInputContent(e.target.value)}
              onPressEnter={(e) => {
                e.preventDefault();
                handleSendMsg();
              }}
              placeholder="询问任何问题"
              autoSize={{ minRows: 2, maxRows: 5 }}
              style={{
                border: 'none',
                boxShadow: 'none',
                color: '#213547'
              }}
            />
            {/* <div
              className="h-[36px] absolute flex left-[2px] bottom-[2px] text-[20px] justify-center"
            >
              <Upload {...props} fileList={fileList}>
                <Button icon={<UploadOutlined />}>上传文件</Button>
              </Upload>
            </div> */}
            <div
              className="size-[36px] absolute flex right-[12px] bottom-[12px] text-[20px] rounded-[50%] justify-center"
              style={{
                backgroundColor: `${isReplying ? 'rgba(22,100,255, .3)' : 'rgba(22,100,255, 1)'}`
              }}
            >
              <ArrowUpOutlined style={{color: 'white', cursor: `${isReplying ? 'not-allowed' : 'pointer'}`}} onClick={() => {
                handleSendMsg();
                console.log('提问内容：', inputContent);
              }} />
            </div>
          </div>
        </div>
      </div>
    }
    </>
  )
}

export default App
