import React, { ChangeEvent, useEffect, useState } from "react";
import css from "styles/homeContent.module.scss";
import { Button, Modal, Input, message } from "antd";
import {
  UserSwitchOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { equalTo, get, orderByChild, query, ref } from "firebase/database";
import { db } from "../../services/firebase";
import {
  createChatRoom,
  createGroupChat,
  joinGroupChat,
} from "../function/common";
import {
  CreateGroupChatData,
  CreatePrivateRoomData,
} from "../../models/createRoomData";
import { _groupId, _roomId, _roomTarget, _user } from "../recoil/globalState";
import { useRecoilState, useSetRecoilState } from "recoil";

function JoinGroup() {
  const [open, setOpen] = useState(false);
  const [valid, setValid] = useState(false);
  const [chatName, setChatName] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [roomTarget, setRoomTarget] = useRecoilState(_roomTarget);
  const [user, setUser] = useRecoilState(_user);
  const setRoomId = useSetRecoilState(_roomId);
  const [groupId, setGroupId] = useRecoilState(_groupId);

  const showModal = () => {
    setValid(false);
    setChatName("");
    setOpen(true);
  };

  const handleCancel = () => {
    setValid(false);
    setChatName("");
    setOpen(false);
  };

  const onCreate = () => {
    if (!valid) return;

    if (chatName) {
      const q = query(
        ref(db, "groupChat"),
        orderByChild("title"),
        equalTo(chatName)
      );

      get(q).then((result) => {
        if (result) {
          const data = result.val();

          if (!data) {
            messageApi.open({
              type: "error",
              content: "존재하지 않는 그룹채팅방입니다.",
            });
          } else {
            const gId = Object.keys(data).toString();
            const jq = query(ref(db, `groupUsers/${user.uid}/${gId}`));

            get(jq).then((snapshot) => {
              const snap = snapshot.val();

              if (!snap) {
                // join
                const jData: CreateGroupChatData = {
                  title: data[gId].title,
                  nickname: user.nickname,
                  regist_date: "",
                  uid: user.uid,
                };

                joinGroupChat(jData, gId).then(() => {
                  setRoomId("");
                  setRoomTarget(data[gId].title);
                  setGroupId(gId);
                });
              } else {
                // 중복 채팅방으로 이동

                setRoomId("");
                setGroupId(gId);
                setRoomTarget(data[gId].title);
              }
            });
          }
        }
      });
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setChatName(value);

    if (!value) {
      setValid(false);
    } else {
      setValid(true);
    }
  };

  const onKeyPress = (e: any) => {
    if (e.key == "Enter") {
      onCreate();
    }
  };

  return (
    <>
      {contextHolder}
      <div
        className={`${css.content_middle} ${css.custom_btn} ${css.btn_1}`}
        onClick={showModal}
      >
        그룹채팅
        <br />
        참가하기
        <div className={`${css.content_button_wrap}`}>
          <UserSwitchOutlined />
        </div>
      </div>
      <Modal
        open={open}
        centered
        title="그룹채팅에 참가해보세요!"
        onOk={handleCancel}
        onCancel={handleCancel}
        footer={[
          <Button
            key="submit"
            type={valid ? "primary" : "default"}
            onClick={onCreate}
          >
            그룹채팅 참가하기
          </Button>,
        ]}
        width={400}
      >
        <Input
          status={valid ? "" : "error"}
          placeholder="채팅방 이름을 입력해주세요"
          prefix={
            valid ? (
              <CheckCircleOutlined
                style={{
                  color: "#52c41a",
                  fontSize: 20,
                  marginTop: 4,
                  marginBottom: 4,
                  marginRight: 4,
                }}
              />
            ) : (
              <ExclamationCircleOutlined
                style={{
                  fontSize: 20,
                  marginTop: 4,
                  marginBottom: 4,
                  marginRight: 4,
                }}
              />
            )
          }
          onChange={onChange}
          value={chatName}
          onKeyPress={onKeyPress}
          style={{ marginTop: 8 }}
        />
      </Modal>
    </>
  );
}
export default JoinGroup;
