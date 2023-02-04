import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Layout,
  Input,
  Button,
  Drawer,
  Avatar,
  Tooltip,
  message,
  Modal,
} from "antd";
import { db } from "../../services/firebase";
import {
  equalTo,
  get,
  limitToLast,
  off,
  onValue,
  orderByChild,
  query,
  ref,
} from "firebase/database";
import { createChatRoom, exitGroupChat, sendMessage } from "../function/common";
import { MessageModel } from "../../models/message";
import { UserListModel } from "../../models/userListModel";
import {
  _groupId,
  _roomDate,
  _roomId,
  _roomTarget,
  _user,
} from "../recoil/globalState";
import { useRecoilState } from "recoil";
const { Header, Footer, Content } = Layout;
const { Search } = Input;
import {
  SendOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ExportOutlined,
  StarOutlined,
  UserOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import MessageBox from "./messageBox";
import css from "styles/chatRoom.module.scss";
import TimeBox from "./timeBox";
import moment from "moment";
import SystemBox from "./systemBox";
import { CreatePrivateRoomData } from "../../models/createRoomData";

function GroupChat() {
  const [msgList, setMsgList] = useState<Array<MessageModel>>([]);
  const [userList, setUserList] = useState<Array<UserListModel>>();
  const [dbRef, setDbRef] = useState<any>(null);
  const [ulRef, setUlRef] = useState<any>(null);
  const [gdRef, setGdRef] = useState<any>(null);
  const [roomId, setRoomId] = useRecoilState(_roomId);
  const [groupId, setGroupId] = useRecoilState(_groupId);
  const [roomTarget, setRoomTarget] = useRecoilState(_roomTarget);
  const [user, setUser] = useRecoilState(_user);
  const [msg, setMsg] = useState<string>("");
  const [ornerId, setOrnerId] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalHolder] = Modal.useModal();

  let flag = true;
  let date = "";

  const scrollRef = useRef(null);

  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const onClose = () => {
    setCollapsed(false);
  };

  const onSend = () => {
    if (msg) {
      scrollToBottom();
      sendMessage(user, groupId, msg);
      setMsg("");
    }
  };

  const scrollToBottom = useCallback(() => {
    scrollRef.current.scrollIntoView({
      block: "end",
      inline: "nearest",
    });
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMsg(e.currentTarget.value);
  };

  const config = {
    title: `${roomTarget} 그룹채팅에서 퇴장하시겠습니까?`,
    content: (
      <>
        참여자가 없는 경우
        <br />
        그룹채팅과 메세지는 삭제됩니다.
      </>
    ),
    centered: true,
    onOk() {
      exitGroup();
    },
  };

  const exitGroup = () => {
    exitGroupChat(user.uid, user.nickname, groupId).then((result) => {
      setGroupId("");
      setRoomId("");
      setRoomTarget("");
    });
  };

  const onExit = () => {
    modal.confirm(config);
  };

  const onInvite = (targetUser: UserListModel) => {
    const userArray = [user.uid, targetUser.uid];
    userArray.sort();

    const sq1 = query(
      ref(db, "room"),
      orderByChild("user"),
      equalTo(`${userArray[0]}_${userArray[1]}`)
    );

    get(sq1).then(async (list) => {
      const uList = list.val();
      setRoomTarget(targetUser.nickname);

      if (uList) {
        setRoomId(Object.keys(uList).toString());
      } else {
        const roomData: CreatePrivateRoomData = {
          user: `${userArray[0]}_${userArray[1]}`,
          userNickname: user.nickname,
          targetUid: targetUser.uid,
          target: targetUser.nickname,
          regist_date: moment().format("YYYY-MM-DD HH:mm:ss"),
        };

        createChatRoom(roomData, user).then((rId) => {
          setGroupId("");
          setRoomId(rId);
        });
      }
    });
  };

  useEffect(() => {
    setMsgList([]);

    if (groupId) {
      if (gdRef) off(gdRef);

      const gd = ref(db, `groupChat/${groupId}`);
      const gdq = query(gd);
      setGdRef(gdq);

      onValue(gdq, async (gData) => {
        const group = gData.val();

        if (group) {
          setOrnerId(group.uId);
        }
      });

      flag = true;

      if (dbRef) off(dbRef);
      if (ulRef) off(ulRef);

      const dr = ref(db, `message/${groupId}`);
      const gq = query(dr);

      get(gq).then((data) => {
        if (data && data.val()) {
          const list = data.val();
          const keys = Object.keys(list);
          const tempArr = [];

          keys.map((key, index) => {
            tempArr.push({
              mid: key,
              ...list[key],
            });
          });

          setMsgList(tempArr);
        }

        const q = query(dr, limitToLast(1));
        setDbRef(q);

        onValue(q, async (data) => {
          if (flag) {
            flag = false;
            return;
          } else {
            if (data && data.val()) {
              const list = data.val();

              setMsgList((prev) => [
                ...prev,
                {
                  mid: Object.keys(list).toString(),
                  ...list[Object.keys(list).toString()],
                },
              ]);
            }
          }
        });
      });

      const uldb = ref(db, `groupUserList/${groupId}`);
      const q = query(uldb);
      setUlRef(q);

      onValue(q, async (data) => {
        const list = data.val();

        if (list) {
          const keys = Object.keys(list);
          const tempArr = [];

          keys.map((key, index) => {
            tempArr.push({
              uid: key,
              nickname: list[key].nickname,
            });
          });

          setUserList(tempArr);
        } else {
          setUserList([]);
        }
      });
    }
  }, [groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [msgList]);

  return (
    <>
      <Layout style={{ height: "100%" }}>
        {contextHolder}
        {modalHolder}
        <Drawer
          title="참여자 목록"
          placement="right"
          onClose={onClose}
          open={collapsed}
          width={300}
        >
          <Layout style={{ height: "100%", background: "#fff" }}>
            <Content>
              {userList &&
                userList.map((users, index) => {
                  return (
                    <div
                      key={users.uid}
                      style={{
                        fontSize: 19,
                        padding: "0 13px",
                        marginBottom: 10,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <Avatar
                          className={`${
                            ornerId === users.uid ? css.orner_color : ""
                          }`}
                          size={26}
                          icon={
                            ornerId === users.uid ? (
                              <StarOutlined />
                            ) : (
                              <UserOutlined />
                            )
                          }
                          style={{
                            marginRight: 5,
                            fontSize: 21,
                          }}
                        />
                        {users.nickname}
                      </div>
                      {users.uid !== user.uid && (
                        <div>
                          <Tooltip
                            placement="bottomRight"
                            title={"1:1 채팅보내기"}
                          >
                            <MessageOutlined
                              style={{ fontSize: 20, cursor: "pointer" }}
                              onClick={() => onInvite(users)}
                            />
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  );
                })}
            </Content>
            <Footer style={{ padding: 0 }}>
              <Button
                icon={<ExportOutlined />}
                style={{ height: 45, width: "100%", fontSize: 20, padding: 0 }}
                onClick={onExit}
              >
                나가기
              </Button>
            </Footer>
          </Layout>
        </Drawer>
        <Header
          style={{
            textAlign: "center",
            color: "#000",
            height: 64,
            paddingInline: 15,
            lineHeight: "64px",
            backgroundColor: "#fff",
            fontWeight: 600,
            fontSize: 20,
            position: "relative",
          }}
        >
          <Button
            onClick={toggleCollapsed}
            style={{
              position: "absolute",
              top: 16,
              left: 25,
              backgroundColor: "#ffffff",
              border: "1px solid #000c17",
              color: "#000c17",
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          {roomTarget} [그룹채팅]
        </Header>
        <Content className={`${css.chat_content}`}>
          <div className={`${css.message_box_wrap}`} ref={scrollRef}>
            {msgList &&
              msgList.map((msg: MessageModel, index) => {
                const tDate = moment(msg.regist_date).format("YYYY년 M월 D일");

                const dFlag = date !== tDate;
                if (dFlag) date = tDate;

                return (
                  <div
                    key={msg.mid}
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {dFlag && <TimeBox {...{ date: tDate }} />}
                    {msg.uid ? (
                      <MessageBox orner={ornerId === msg.uid} group {...msg} />
                    ) : (
                      <SystemBox msg={msg.msg} />
                    )}
                  </div>
                );
              })}
          </div>
        </Content>
        <Footer
          style={{
            padding: "10px 20px",
            textAlign: "center",
            color: "#fff",
            backgroundColor: "#fff",
            height: 60,
          }}
        >
          <Search
            placeholder="메세지를 입력해주세요"
            allowClear
            enterButton={<SendOutlined />}
            size="large"
            onSearch={onSend}
            value={msg}
            onChange={onChange}
          />
        </Footer>
      </Layout>
    </>
  );
}
export default GroupChat;
