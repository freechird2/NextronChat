import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Layout, Input, Drawer, Button, Modal, Avatar } from "antd";
import { db } from "../../services/firebase";
import { get, limitToLast, off, onValue, query, ref } from "firebase/database";
import { exitRoom, sendMessage } from "../function/common";
import { MessageModel } from "../../models/message";
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
  UserOutlined,
} from "@ant-design/icons";
import MessageBox from "./messageBox";
import css from "styles/chatRoom.module.scss";
import TimeBox from "./timeBox";
import moment from "moment";
import { UserListModel } from "../../models/userListModel";

function ChatRoom() {
  const [msgList, setMsgList] = useState<Array<MessageModel>>([]);
  const [dbRef, setDbRef] = useState<any>(null);
  const [rRef, setRRef] = useState<any>(null);
  const [roomId, setRoomId] = useRecoilState(_roomId);
  const [roomTarget, setRoomTarget] = useRecoilState(_roomTarget);
  const [groupId, setGroupId] = useRecoilState(_groupId);
  const [user, setUser] = useRecoilState(_user);
  const [msg, setMsg] = useState<string>("");
  // const [date, setDate] = useRecoilState(_roomDate);
  const [collapsed, setCollapsed] = useState(false);
  const [modal, modalHolder] = Modal.useModal();
  const [userList, setUserList] = useState<Array<UserListModel>>([]);

  let flag = true;
  let date = "";

  const scrollRef = useRef(null);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const onClose = () => {
    setCollapsed(false);
  };

  const onSend = () => {
    if (msg) {
      scrollToBottom();
      sendMessage(user, roomId, msg);
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
    title: `채팅방에서 퇴장하시겠습니까?`,
    content: <>퇴장 시 해당 사용자와의 메세지는 삭제됩니다.</>,
    centered: true,
    onOk() {
      if (rRef) off(rRef);

      exitRoom(userList[0].uid, userList[1].uid, roomId).then(() => {
        setRoomTarget("");
        setRoomId("");
        setGroupId("");
      });
    },
  };

  const onExit = () => {
    modal.confirm(config);
  };

  useEffect(() => {
    setMsgList([]);
    setUserList([]);

    if (roomId) {
      get(query(ref(db, `room/${roomId}/user`))).then((room) => {
        if (room.val()) {
          const u = room.val().toString();
          const users = room.val().split("_");

          users.map((au, index) => {
            get(query(ref(db, `users/${au}/nickname`))).then((data) => {
              if (data.val()) {
                setUserList((prev) => [
                  ...prev,
                  {
                    uid: au,
                    nickname: data.val().toString(),
                  },
                ]);
              }
            });
          });
        }
      });

      flag = true;

      if (dbRef) off(dbRef);
      const dr = ref(db, `message/${roomId}`);
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

        if (rRef) off(rRef);

        const rq = query(ref(db, `room/${roomId}`));
        setRRef(rq);

        onValue(rq, (data) => {
          if (!data.val()) {
            Modal.warning({
              title: "대화 상대가 퇴장하였습니다.",
              centered: true,
              onOk() {
                setRoomTarget("");
                setRoomId("");
              },
            });
          }
        });
      });
    }
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [msgList]);

  return (
    <>
      {modalHolder}
      <Layout style={{ height: "100%" }}>
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
                          size={26}
                          icon={<UserOutlined />}
                          style={{
                            marginRight: 5,
                            fontSize: 21,
                          }}
                        />
                        {users.nickname}
                      </div>
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
          {roomTarget}님 과의 대화방
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
                    <MessageBox {...msg} />
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
export default ChatRoom;
